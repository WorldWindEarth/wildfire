/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define*/

define([
    'model/wildfire/FireLookout',
    'model/util/Log',
    'model/Constants',
    'knockout',
    'worldwind'],
    function (
        FireLookout,
        log,
        constants,
        ko) {
        "use strict";
        var FireLookoutManager = function (globe, layer) {
            var self = this;

            this.globe = globe;
            this.layer = layer || globe.findLayer(constants.LAYER_NAME_FIRE_LOOKOUTS);
            if (!this.layer) {
                log.error("FireLookoutManager", "constructor", "missingLayer");
            }
            this.lookouts = ko.observableArray();
            this.lookoutCount = ko.observable(0);
            this.selectedLookout = null;

            // Subscribe to "arrayChange" events in the lookouts array.
            // Here is where we add/remove lookouts from WW layer.
            this.lookouts.subscribe(function (changes) {
                // See: http://blog.stevensanderson.com/2013/10/08/knockout-3-0-release-candidate-available/
                changes.forEach(function (change) {
                    if (change.status === 'added' && change.moved === undefined) {
                        // Ensure the name is unique by appending a suffix if reqd.
                        // (but not if the array reordered -- i.e., moved items)
                        self.doEnsureUniqueName(change.value);
                        self.doAddLookoutToLayer(change.value);
                    } else if (change.status === 'deleted' && change.moved === undefined) {
                        // When a scout is removed we must remove the renderable,
                        // (but not if the array reordered -- i.e., moved items)
                        self.doRemoveLookoutFromLayer(change.value);
                    }
                });
                self.lookoutCount(self.lookouts().length);

            }, null, "arrayChange");

            /**
             * Adds the given lookout to to the manager.
             * @param {FireLookout} lookout
             */
            this.addLookout = function (lookout) {
                // Place the lookout under the management of this module
                self.lookouts.push(lookout);
            };
            
            /**
             * Centers the globe other the given lookout.
             * @param {FireLookout} lookout
             */
            this.gotoLookout = function (lookout) {
                self.globe.goto(lookout.latitude(), lookout.longitude());
            };
            /**
             * Finds the fire lookout with the given id.
             * @param {String} id System assigned id for the lookout.
             * @returns {FireLookout} The lookout object if found, else null.
             */
            this.findLookout = function (id) {
                var lookout, i, len;
                for (i = 0, len = self.lookouts().length; i < len; i += 1) {
                    lookout = self.lookouts()[i];
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
            this.removeLookout = function (lookout) {
                self.lookouts.remove(lookout);
            };

            /**
             * Invokes refresh on all the lookouts managed by this manager.
             */
            this.refreshLookouts = function () {
                var i, max;

                for (i = 0, max = self.lookouts().length; i < max; i++) {
                    self.lookouts()[i].refresh();
                }
            };
            // Internal method to ensure the name is unique by appending a suffix if reqd.
            this.doEnsureUniqueName = function (lookout) {
                lookout.name(self.generateUniqueName(lookout));
            };
            // Internal method to add the lookout to the layer.
            this.doAddLookoutToLayer = function (lookout) {
                self.layer.addRenderable(lookout.renderable);
            };

            // Internal method to remove the lookout's renderable from its layer.
            this.doRemoveLookoutFromLayer = function (lookout) {
                var i, max, renderable = lookout.renderable;
                // Remove the renderable from the renderable layer
                for (i = 0, max = self.layer.renderables.length; i < max; i++) {
                    if (self.layer.renderables[i] === renderable) {
                        self.layer.renderables.splice(i, 1);
                        break;
                    }
                }
            };

            /**
             * Saves the fire lookouts collection to local storage.
             */
            this.saveLookouts = function () {
                var validLookouts = [],
                    lookoutsString,
                    i, len, lookout;

                // Knockout's toJSON cannot process a WeatherScout/FireLookout object...
                // it appears to recurse and a call stack limit is reached.
                // So we create a simplfied the object here to pass to ko.toJSON()
                for (i = 0, len = self.lookouts().length; i < len; i++) {
                    lookout = self.lookouts()[i];
                    if (!lookout.invalid) {
                        validLookouts.push({
                            id: lookout.id,
                            name: lookout.name,
                            latitude: lookout.latitude,
                            longitude: lookout.longitude,
                            isMovable: lookout.isMovable,
                            fuelModelNo: lookout.fuelModelNo,
                            fuelModelManualSelect: lookout.fuelModelManualSelect,
                            moistureScenarioName: lookout.moistureScenarioName
                        });
                    }
                }
                lookoutsString = ko.toJSON(validLookouts, [
                    'id',
                    'name',
                    'latitude',
                    'longitude',
                    'isMovable',
                    'fuelModelNo',
                    'fuelModelManualSelect',
                    'moistureScenarioName'
                ]);
                localStorage.setItem(constants.STORAGE_KEY_FIRE_LOOKOUTS, lookoutsString);
            };

            /**
             * Restores the fire lookouts collection from local storage.
             */
            this.restoreLookouts = function () {
                var string = localStorage.getItem(constants.STORAGE_KEY_FIRE_LOOKOUTS),
                    array, i, max, item,
                    position, params;
                if (!string || string === 'null') {
                    return;
                }
                // Convert JSON array to array of FireLookout objects
                array = JSON.parse(string);
                for (i = 0, max = array.length; i < max; i++) {
                    item = array[i];
                    position = new WorldWind.Position(item.latitude, item.longitude, 0);
                    params = {
                        id: item.id,
                        name: item.name,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        isMovable: item.isMovable,
                        fuelModelNo: item.fuelModelNo,
                        fuelModelManualSelect: item.fuelModelManualSelect,
                        moistureScenarioName: item.moistureScenarioName
                    };
                    self.addLookout(new FireLookout(self, position, params));
                }
            };

            /**
             * Generates a unique name by appending a suffix '(n)'.
             * @param {FireLookout} lookout
             * @returns {String}
             */
            this.generateUniqueName = function (lookout) {
                var uniqueName = lookout.name().trim(),
                    otherLookout,
                    isUnique,
                    suffixes,
                    seqNos,
                    n, i, len;

                // Loop while name not unique
                do {
                    // Assume uniqueness, set to false if we find a matching name
                    isUnique = true;

                    // Test the name for uniqueness with the other scouts
                    for (i = 0, len = self.lookouts().length; i < len; i += 1) {
                        otherLookout = self.lookouts()[i];
                        if (otherLookout === lookout) {
                            continue; // Don't test with self
                        }
                        if (otherLookout.name() === uniqueName) {
                            isUnique = false;

                            // check for existing suffix '(n)' and increment
                            suffixes = uniqueName.match(/[(]\d+[)]$/);
                            if (suffixes) {
                                // increment an existing suffix's sequence number
                                seqNos = suffixes[0].match(/\d+/);
                                n = parseInt(seqNos[0], 10) + 1;
                                uniqueName = uniqueName.replace(/[(]\d+[)]$/, '(' + n + ')');
                            } else {
                                // else if no suffix, create one
                                uniqueName += ' (2)';   // The first duplicate is #2
                            }
                            // Break out of the for loop and recheck uniqueness
                            break;
                        }
                    }
                } while (!isUnique);

                return uniqueName;
            };
        };
        return FireLookoutManager;
    }
);

