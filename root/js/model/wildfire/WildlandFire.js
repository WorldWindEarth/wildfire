/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, WorldWind*/

define([
    'model/util/ContextSensitive',
    'model/services/GeoMacService',
    'model/util/Openable',
    'model/util/Log',
    'model/util/WmtUtil',
    'model/Constants'],
    function (
        contextSensitive,
        geoMac,
        openable,
        log,
        util,
        constants) {
        "use strict";

        var WildlandFire = function (feature) {
            var attributes = feature.attributes || {};

            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                //messenger.infoGrowl("The open feature has not been implemented yet.", "Sorry");
                return false;
            });

            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSensitive(this, function () {
                //messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");
            });

            /**
             * The unique id used to identify this particular object within WMTweb session. It is not persistant.
             */
            this.id = util.guid();
            this.name = attributes.incidentname
                || attributes.fire_name
                || 'Fire';
            this.state = attributes.state || attributes.inc_num.substr(0,2);
            this.number = attributes.uniquefireidentifier
                || attributes.inc_num
                || 'Unknown';
            this.featureId = attributes.objectid;
            this.featureType = attributes.incidentname ? constants.WILDLAND_FIRE_POINT : constants.WILDLAND_FIRE_PERIMETER;

            // If the feature has geometry then process it, otherwise defer until needed
            if (feature.geometry) {
                this.processGeometry(feature.geometry);
            } else {
                this.geometryType = constants.GEOMETRY_UNKNOWN;
                this.geometry = null;
                this.extents = null;
            }
        };
        /**
         * 
         * @param {type} deferred
         */
        WildlandFire.prototype.loadDeferredGeometry = function (deferred) {
            var self = this;
            if (this.featureType === constants.WILDLAND_FIRE_POINT) {
                geoMac.getActiveFireFeature(this.featureId,
                    function (feature) {
                        self.processGeometry(feature.geometry);
                        if (deferred) {
                            deferred.resolve(self);
                        }
                    });
            }
            else if (this.featureType === constants.WILDLAND_FIRE_PERIMETER) {
                geoMac.getActivePerimeterFeature(this.featureId,
                    function (feature) {
                        self.processGeometry(feature.geometry);
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


//        WildlandFire.prototype.goto = function () {
//            var controller = require("wmt/controller/Controller"),
//                deferred = $.Deferred();
//
//            if (this.geometry) {
//                controller.lookAtLatLon(this.latitude, this.longitude);
//            } else {
//                // Load the geometry
//                this.loadDeferredGeometry(deferred);
//                $.when(deferred).done(function (self) {
//                    controller.lookAtLatLon(self.latitude, self.longitude);
//                });
//
//            }
//        };


        return WildlandFire;

    }
);

