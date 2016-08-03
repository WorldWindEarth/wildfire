/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define*/

define([
    'wmt/resource/GeoMacResource',
    'wmt/util/Publisher',
    'wmt/model/WildlandFire',
    'wmt/Wmt'],
    function (
        geoMac,
        publisher,
        WildlandFire,
        wmt) {
        "use strict";
        var WildlandFireManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            this.model = model;
            this.fires = [];

            var self = this,
                i, max,
                feature,
                deferredFires = $.Deferred(),
                deferredPerimeters = $.Deferred();

            // Load the large fire points (includeGeometry)
            geoMac.activeFires(
                true, // include Geometry
                function (features) {
                    for (i = 0, max = features.length; i < max; i++) {
                        feature = features[i];
                        self.fires.push(new WildlandFire(feature));
                    }
                    deferredFires.resolve(self.fires);
                });
            // Load the current fire perimeters (without geometry)
            geoMac.activeFirePerimeters(
                false, // don't include Geometry
                function (features) {
                    for (i = 0, max = features.length; i < max; i++) {
                        feature = features[i];
                        self.fires.push(new WildlandFire(feature));
                    }
                    deferredPerimeters.resolve(self.fires);
                });
            $.when(deferredFires, deferredPerimeters).done(function () {
                // Notify views of the new fires
                self.fire(wmt.EVENT_WILDLAND_FIRES_ADDED, self.fires);
            });
        };


        /**
         * Adds the given fire to to the manager.
         * @param {WildlandFire} fire
         */
        WildlandFireManager.prototype.addFire = function (fire) {

            // Manage this object
            this.fires.push(fire);

            // Notify views of the new wx scount
            this.fire(wmt.EVENT_WILDLAND_FIRE_ADDED, fire);
        };

        /**
         * Finds the weather fire with the given id.
         * @param {String} id System assigned id for the fire.
         * @returns {WildlandFire} The fire object if found, else null.
         */
        WildlandFireManager.prototype.findFire = function (id) {
            var fire, i, len;

            for (i = 0, len = this.fires.length; i < len; i += 1) {
                fire = this.fires[i];
                if (fire.id === id) {
                    return fire;
                }
            }
            return null;
        };

        /**
         * Removes the given fire from the manager.
         * @param {WildlandFire} fire
         * @returns {Boolean}
         */
        WildlandFireManager.prototype.removeFire = function (fire) {
            var i, max,
                removed;

            // Find the fire item with the given id (should create an associative array)
            for (i = 0, max = this.fires.length; i < max; i++) {
                if (this.fires[i].id === fire.id) {
                    removed = this.fires.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                // Remove our subscription/reference to the fire
                fire.cancelSubscription(wmt.EVENT_OBJECT_REMOVED, this.removeFire, this);
                // Notify others.
                this.fire(wmt.EVENT_WILDLAND_FIRE_REMOVED, removed[0]);
                return true;
            }
            return false;
        };

        /**
         * Invokes refresh on all the fires managed by this manager.
         */
        WildlandFireManager.prototype.refreshFires = function () {
            var i, max;

            for (i = 0, max = this.fires.length; i < max; i++) {
                this.fires[i].refresh();
            }
        };


        return WildlandFireManager;
    }
);

