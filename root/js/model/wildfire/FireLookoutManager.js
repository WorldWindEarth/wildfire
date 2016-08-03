/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define*/

define([
    'wmt/model/FireLookout',
    'wmt/util/Log',
    'wmt/util/Publisher',
    'wmt/Wmt'],
    function (
        FireLookout,
        log,
        publisher,
        wmt) {
        "use strict";
        var FireLookoutManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            this.model = model;
            this.lookouts = [];
        };
        /**
         * Adds the given lookout to to the manager.
         * @param {FireLookout} lookout
         */
        FireLookoutManager.prototype.addLookout = function (lookout) {
            // Ensure we have a unique name by appending a (n) to duplicates.
            lookout.name = this.generateUniqueName(lookout.name || "Fire Lookout");
            // Subscribe to removal notifications
            lookout.on(wmt.EVENT_OBJECT_REMOVED, this.removeLookout, this);
            // Place the lookout under the management of this module
            this.lookouts.push(lookout);
            // Notify views that we have a new lookout
            this.fire(wmt.EVENT_FIRE_LOOKOUT_ADDED, lookout);
            // Now that views are attached, invoke a refresh which will notify the view of any updates as they occur.
            lookout.refresh();
        };
        /**
         * Finds the fire lookout with the given id.
         * @param {String} id System assigned id for the lookout.
         * @returns {FireLookout} The lookout object if found, else null.
         */
        FireLookoutManager.prototype.findLookout = function (id) {
            var lookout, i, len;
            for (i = 0, len = this.lookouts.length; i < len; i += 1) {
                lookout = this.lookouts[i];
                if (lookout.id === id) {
                    return lookout;
                }
            }
            return null;
        };
        /**
         * Removes the given lookout from the manager.
         * @param {FireLookout} lookout
         * @returns {Boolean}
         */
        FireLookoutManager.prototype.removeLookout = function (lookout) {
            var i, max,
                removed;
            // Find the lookout item with the given id (should create an associative array)
            for (i = 0, max = this.lookouts.length; i < max; i++) {
                if (this.lookouts[i].id === lookout.id) {
                    removed = this.lookouts.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                // Remove our subscription/reference to the lookout
                lookout.cancelSubscription(wmt.EVENT_OBJECT_REMOVED, this.removeLookout, this);
                // Notify others.
                this.fire(wmt.EVENT_FIRE_LOOKOUT_REMOVED, removed[0]);
                return true;
            }
            return false;
        };
        
        /**
         * Invokes refresh on all the lookouts managed by this manager.
         */
        FireLookoutManager.prototype.refreshLookouts = function () {
            var i, max;

            for (i = 0, max = this.lookouts.length; i < max; i++) {
                this.lookouts[i].refresh();
            }
        };
        
        /**
         * Saves the fire lookouts collection to local storage.
         */
        FireLookoutManager.prototype.saveLookouts = function () {
            var validLookouts = this.lookouts.filter(
                function (lookout) {
                    return !lookout.invalid;
                }),
                string = JSON.stringify(validLookouts, [
                    'id',
                    'name',
                    'toponym',
                    'latitude',
                    'longitude',
                    'isMovable',
                    'fuelModelNo',
                    'fuelModelManualSelect',
                    'moistureScenarioName'
                ]);
            localStorage.setItem(wmt.STORAGE_KEY_FIRE_LOOKOUTS, string);
        };
        /**
         * Restores the fire lookouts collection from local storage.
         */
        FireLookoutManager.prototype.restoreLookouts = function () {
            var string = localStorage.getItem(wmt.STORAGE_KEY_FIRE_LOOKOUTS),
                array,
                item,
                i, max;
            if (!string || string === 'null') {
                return;
            }
            // Convert JSON array to array of FireLookout objects
            array = JSON.parse(string);
            for (i = 0, max = array.length; i < max; i++) {
                item = array[i];
                if (isNaN(item.latitude) || isNaN(item.longitude)) {
                    log.error("FireLookoutManager", "restoreLookouts", "Invalid lat/lon. Ignored.");
                } else {
                    this.addLookout(new FireLookout({
                        id: array[i].id,
                        name: array[i].name,
                        toponym: array[i].toponym,
                        latitude: array[i].latitude,
                        longitude: array[i].longitude,
                        isMovable: array[i].isMovable,
                        fuelModelNo: array[i].fuelModelNo,
                        fuelModelManualSelect: array[i].fuelModelManualSelect,
                        moistureScenarioName: array[i].moistureScenarioName
                    }));
                }
            }
        };
        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        FireLookoutManager.prototype.generateUniqueName = function (name) {
            var uniqueName = name.trim(),
                isUnique,
                suffixes,
                seqNos,
                n,
                i,
                len;
            do {
                // Assume uniqueness, set to false if we find a matching name
                isUnique = true;
                for (i = 0, len = this.lookouts.length; i < len; i += 1) {
                    if (this.lookouts[i].name === uniqueName) {

                        isUnique = false;
                        // check for existing suffix '(n)' and increment
                        suffixes = uniqueName.match(/[(]\d+[)]$/);
                        if (suffixes) {
                            seqNos = suffixes[0].match(/\d+/);
                            n = parseInt(seqNos[0], 10) + 1;
                            uniqueName = uniqueName.replace(/[(]\d+[)]$/, '(' + n + ')');
                        } else {
                            // else if no suffix, create one
                            uniqueName += ' (2)'; // The first duplicate is #2
                        }
                        // Break out of for loop and recheck uniqueness
                        break;
                    }
                }
            } while (!isUnique);
            return uniqueName;
        };
        return FireLookoutManager;
    }
);

