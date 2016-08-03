/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $ */

/**
 * The FuelMoistureCatalog manages a collection of fuel moisture scenarios.
 *
 * @param {FuelMoistureResource} restService Fuel Moisture REST service.
 * @param {Log} log Console logger.
 * @returns {FuelMoistureCatalog}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/resource/FuelMoistureResource',
    'wmt/util/Log'],
    function (
        restService,
        log) {
        "use strict";
        var FuelMoistureCatalog = {
            /**
             * Creates collection of named fuel moisture scenarios.  
             * Note: The collection is populated asynchonously.
             */
            initialize: function () {
                /**
                 * A collection of FuelMoisture objects
                 */
                this.scenarios = [];
                /** 
                 * Loads this catalog with the scenario array.
                 */
                var self = this;
                restService.fuelMoistureScenarios(function (json) {
                    self.scenarios = json.scenario;
                    // Test
                    console.log(self.getScenario(self.getScenarioNames()[0]));
                }, false);  // async = false
            },
            /**
             * Gets an array of the scenario names in this catalog.
             * @returns {Array} An array of Strings.
             */
            getScenarioNames: function () {
                var names = [],
                    i, len = this.scenarios.length;

                if (len === 0) {
                    // Probably not initialized yet. Async?
                    log.error('FuelMoistureCatalog', 'getScenarioNames', 'The scenarios array is empty.');
                    return names;
                }
                for (i = 0; i < len; i++) {
                    names.push(this.scenarios[i].name);
                }
                return names;
            },
            /**
             * Gets the fuel moisture for the given scenario.
             * @param {String} scenarioName
             * @returns {Object} A JSON FuelModel object.
             * E.g.:
             * {
             *  name: "Very Low Dead, Fully Cured Herb",
             *  fuelMoisture: {
             *      dead1HrFuelMoisture: {type: "fuel_moisture_1h:%", value: "3.0", unit: "%"},
             *      dead1HrFuelMoisture: {type: "fuel_moisture_1h:%", value: "3.0", unit: "%"},
             *      dead10HrFuelMoisture: {type: "fuel_moisture_10h:%", value: "4.0", unit: "%"},
             *      dead100HrFuelMoisture: {type: "fuel_moisture_100h:%", value: "5.0", unit: "%"},
             *      liveHerbFuelMoisture: {type: "fuel_moisture_herb:%", value: "30.0", unit: "%"},
             *      liveWoodyFuelMoisture: {type: "fuel_moisture_woody:%", value: "60.0", unit: "%"}
             *  }
             * }
             */
            getScenario: function (scenarioName) {
                var scenario = null;

                // TODO: Add custom fuel model processing
                scenario = FuelMoistureCatalog.findScenario(scenarioName, this.scenarios);
                if (!scenario) {
                    log.warning('FuelMoistureCatalog', 'getScenario', 'No fuel moisture scenario found for: ' + scenarioName);
                }
                return scenario;
            },
            /**
             * Returns the fuel moisture item with the matching fuel moisture no.
             * @param {String} scenarioName Unique moisture no.
             * @param {Array} array Fuel moisture scenario array
             * @returns {Object} JSON fuel moisture scenario object.
             */
            findScenario: function (scenarioName, array) {
                var i, max;

                if (!array || array.length === 0) {
                    log.error('FuelMoistureCatalog', 'findFuelMoisture', 'The array arg is null or empty.');
                    return null;
                }
                for (i = 0, max = array.length; i < max; i++) {
                    if (array[i].name === scenarioName) {
                        return array[i];
                    }
                }
                return null;
            }
        };
        return FuelMoistureCatalog;
    });
