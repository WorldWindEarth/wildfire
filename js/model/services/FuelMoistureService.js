/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */
/*global define, $ */

/**
 * 
 * @param {Log} log Consol logger.
 * @param {WmtUtil} util Utilities.
 * @param {Wmt} constants Constants.
 * @returns {FuelMoistureService}
 * 
 * @author Bruce Schubert
 */
define([
    'model/util/Log',
    'model/util/WmtUtil',
    'model/Constants'],
    function (
        log,
        util,
        constants) {
        "use strict";
        var FuelMoistureService = {
            /**
             * 
             * @param {String} conditions  Either "hot_and_dry", "cool_and_wet", or
             * "between_hot_and_cool". 
             * @param {Function(JSON)} callback Receives a FuelMoisture JSON object.
             */
            fuelMoistureTuple: function (conditions, callback) {
                // TODO: Assert conditions are valid
                var url = constants.FUELMOISTURE_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&conditions=" + conditions;
                console.log(url + '?' + query);
                $.get(url, query, callback);
            },
            /**
             * Returns a JSON array of fuel moisture scenarios. E.g.,
             * {
             *  "scenario" : [ {
             *    "name" : "Very Low Dead, Fully Cured Herb",
             *    "fuelMoisture" : {
             *      "dead1HrFuelMoisture" : {
             *        "type" : "fuel_moisture_1h:%",
             *        "value" : "3.0",
             *        "unit" : "%"
             *      },
             *      "dead10HrFuelMoisture" : {
             *        "type" : "fuel_moisture_10h:%",
             *        "value" : "4.0",
             *        "unit" : "%"
             *      },
             *      "dead100HrFuelMoisture" : {
             *        "type" : "fuel_moisture_100h:%",
             *        "value" : "5.0",
             *        "unit" : "%"
             *      },
             *      "liveHerbFuelMoisture" : {
             *        "type" : "fuel_moisture_herb:%",
             *        "value" : "30.0",
             *        "unit" : "%"
             *      },
             *      "liveWoodyFuelMoisture" : {
             *        "type" : "fuel_moisture_woody:%",
             *        "value" : "60.0",
             *        "unit" : "%"
             *      }
             *    }
             *  }, {
             *  ...
             *  } ]
             *}
             */
            fuelMoistureScenarios: function (callback, async) {
                // TODO: Assert conditions are valid
                var url = constants.FUELMOISTURE_REST_SERVICE + "/scenarios",
                    query = "mime-type=application/json";
                
                console.log(url + '?' + query);
                if (async === undefined || async) {
                    $.get(url, query, callback);
                }
                else {
                    $.ajax({
                        url: url,
                        data: query,
                        success: callback,
                        async: false
                    });
                }
            }
        };
        return FuelMoistureService;
    }
);