/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, WorldWind*/

define([
    'model/wildfire/symbols/WildlandFireSymbol',
    'model/services/GeoMacService',
    'model/util/ContextSensitive',
    'model/util/Openable',
    'model/util/Selectable',
    'model/util/Log',
    'model/util/WmtUtil',
    'model/Constants'],
    function (
        WildlandFireSymbol,
        geoMac,
        contextSensitive,
        openable,
        selectable,
        log,
        util,
        constants) {
        "use strict";

        /**
         * 
         * @param {WildlandFireManager} manager The manager for this wildland fire
         * @param {Object} feature A JSON feature object returned by the GeoMacService
         * @param {String} featureType A string identifing the feature type (e.g., point or perimeter)
         * @returns {WildlandFire} 
         * @constructor
         */
        var WildlandFire = function (manager, feature, featureType) {
            var attributes = feature.attributes || {},
                self = this;

            this.manager = manager;
            
            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                //messenger.infoGrowl("The open feature has not been implemented yet.", "Sorry");
                return false;
            });

            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSensitive(this, function () {
                //messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");
            });

            // Make selectable via picking (see SelectController): adds the "select" method
            selectable.makeSelectable(this, function (params) {   // define the callback that selects this marker
                this.renderable.highlighted = params.selected;
                return true;    // return true to fire a EVENT_OBJECT_SELECTED event
            });
            
            /**
             * The unique id used to identify this particular object within WMTweb session. It is not persistant.
             */
            this.id = util.guid();
            this.name = attributes.incidentname
                || attributes.fire_name
                || 'Fire';
            this.number = attributes.uniquefireidentifier
                || attributes.inc_num
                || 'Unknown';
            this.acres = attributes.acres;
            this.currentDate = new Date(attributes.datecurrent);
            this.discoveryDate = new Date(attributes.firediscoverydatetime);
            this.featureId = attributes.objectid;
            this.featureType = featureType;
            this.fireCause = attributes.firecause;
            this.hotlink = attributes.hotlink || "#";
            this.isComplex = attributes.iscomplex;
            this.percentContained = attributes.percentcontained;
            this.reportDate = new Date(attributes.reportdatetime);
            this.state = attributes.state || attributes.inc_num.substr(0,2);
            this.status = attributes.status;
            
            // FOR DEBUGGING ONLY
            this.featureAttributes = attributes;

            // If the supplied feature has geometry then process it, otherwise defer until needed
            if (feature.geometry) {
                this.processGeometry(feature.geometry);
                this.renderable = new WildlandFireSymbol(this); // Either a Placemark or a SurfaceShape depending on geometry
                this.renderable.pickDelgate = this;
            } else {
                var deferredRenderable = $.Deferred();
                this.loadDeferredGeometry(deferredRenderable);
                $.when(deferredRenderable).done(function () {
                    self.renderable = new WildlandFireSymbol(self); // Either a Placemark or a SurfaceShape depending on geometry
                    self.renderable.pickDelgate = self;
                });
            } 
            /** DOM element id to display when this object is selected in the globe. */
            this.viewTemplateName = 'wildland-fire-view-template';
        };
        /**
         * Load
         * @param {type} deferred
         */
        WildlandFire.prototype.loadDeferredGeometry = function (deferred) {
            var self = this;
            if (this.featureType === constants.WILDLAND_FIRE_POINT) {
                geoMac.getActiveFireFeature(this.featureId,
                    function (feature) {
                        if (feature) {
                            self.processGeometry(feature.geometry);
                        } else {
                            log.warning("WildlandFireSymbol", "loadDeferredGeometry", "featureMissing");
                        }
                        if (deferred) {
                            deferred.resolve(self);
                        }
                    });
            }
            else if (this.featureType === constants.WILDLAND_FIRE_PERIMETER) {
                geoMac.getActivePerimeterFeature(this.featureId,
                    function (feature) {
                        if (feature) {
                            self.processGeometry(feature.geometry);
                        } else {
                            log.warning("WildlandFireSymbol", "loadDeferredGeometry", "featureMissing");
                        }                        
                        if (deferred) {
                            deferred.resolve(self);
                        }
                    });
            }
        };
        /**
         * 
         * @param {type} geometry
         * @returns {undefined}
         */
        WildlandFire.prototype.processGeometry = function (geometry) {
            var i, numRings, ring,
                j, numPoints,
                minLat, maxLat,
                minLon, maxLon;

            this.geometry = geometry;

            if (geometry.x && geometry.y) {
                this.geometryType = constants.GEOMETRY_POINT;

                // Set the "goto" locaiton
                this.latitude = geometry.y;
                this.longitude = geometry.x;
                this.extents = null;

            } else if (geometry.rings) {
                this.geometryType = constants.GEOMETRY_POLYGON;

                // Compute the extents
                minLat = Number.MAX_VALUE;
                minLon = Number.MAX_VALUE;
                maxLat = -Number.MAX_VALUE;
                maxLon = -Number.MAX_VALUE;
                for (i = 0, numRings = geometry.rings.length; i < numRings; i++) {
                    ring = geometry.rings[i];
                    for (j = 0, numPoints = ring.length; j < numPoints; j++) {
                        minLat = Math.min(minLat, ring[j][1]);
                        maxLat = Math.max(maxLat, ring[j][1]);
                        minLon = Math.min(minLon, ring[j][0]);
                        maxLon = Math.max(maxLon, ring[j][0]);
                    }
                }
                this.extents = new WorldWind.Sector(minLat, maxLat, minLon, maxLon);

                // Set the "goto" locaiton
                this.latitude = this.extents.centroidLatitude();
                this.longitude = this.extents.centroidLongitude();
            }
        };

        return WildlandFire;

    }
);

