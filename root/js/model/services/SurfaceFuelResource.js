/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $ */

/**
 * The SurfaceFuelResource model retrieves a JSON surface fuel object from the WMT REST server.
 * SurfaceFuel JSON Example:
 * {
 *     "fuelModel": {
 *        "modelNo": "4",
 *        "modelCode": "#4",
 *        "modelName": "Chaparral (6 feet)",
 *        "modelGroup": "Original 13",
 *        "dynamic": "false",
 *        "dead1HrFuelLoad": {"type": "fuel_load:kg/m2", "value": "1.1230883661399034"},
 *        "dead10HrFuelLoad": {"type": "fuel_load:kg/m2", "value": "0.8989190315810404"},
 *        "dead100HrFuelLoad": {"type": "fuel_load:kg/m2", "value": "0.4483386691177259"},
 *        "liveHerbFuelLoad": {"type": "fuel_load:kg/m2", "value": "0.0"},
 *        "liveWoodyFuelLoad": {"type": "fuel_load:kg/m2", "value": "1.1230883661399034"},
 *        "dead1HrSAVRatio": {"type": "surface_to_volume:m2/m3", "value": "6561.679790026247"},
 *        "dead10HrSAVRatio": {"type": "surface_to_volume:m2/m3", "value": "357.6115485564305"},
 *        "dead100HrSAVRatio": {"type": "surface_to_volume:m2/m3", "value": "98.4251968503937"},
 *        "liveHerbSAVRatio": {"type": "surface_to_volume:m2/m3", "value": "0.0"},
 *        "liveWoodySAVRatio": {"type": "surface_to_volume:m2/m3", "value": "4921.259842519685"},
 *        "fuelBedDepth": {"type": "fuel_depth:m", "value": "1.8287999999999998", "unit": "m"},
 *        "moistureOfExtinction": {"type": "moisture_of_extinction:%", "value": "20.0", "unit": "%"},
 *        "lowHeatContent": {"type": "heat_content:kJ/kg", "value": "18608.0"}, "burnable": "true"},
 *    "fuelMoisture": {
 *        "dead1HrFuelMoisture": {"type": "fuel_moisture_1h:%", "value": "3.0", "unit": "%"},
 *        "dead10HrFuelMoisture": {"type": "fuel_moisture_10h:%", "value": "4.0", "unit": "%"},
 *        "dead100HrFuelMoisture": {"type": "fuel_moisture_100h:%", "value": "5.0", "unit": "%"},
 *        "liveHerbFuelMoisture": {"type": "fuel_moisture_herb:%", "value": "30.0", "unit": "%"},
 *        "liveWoodyFuelMoisture": {"type": "fuel_moisture_woody:%", "value": "60.0", "unit": "%"}},
 *    "fuelTemperature": {"type": "fuel_temp:F", "value": "NaN", "unit": "fahrenheit"},
 *    "meanBulkDensity": {"type": "bulk_density:lb/ft3", "value": "0.12266556382050901"},
 *    "fuelParticleDensity": {"type": "particle_density:lb/ft3", "value": "32.0"},
 *    "meanPackingRatio": {"type": "mean_packing_ratio", "value": "0.0038332988693909067", "unit": ""},
 *    "optimalPackingRatio": {"type": "optimal_packing_ratio", "value": "0.007434592860248393", "unit": ""},
 *    "relativePackingRatio": {"type": "relative_packing_ratio", "value": "0.5156030654868752", "unit": ""},
 *    "characteristicSAV": {"type": "fuel_complex:ft2/ft3", "value": "1739.2294964144478"},
 *    "liveMoistureOfExt": {"type": "live_moisture_of_ext:%", "value": "372.7662233555347", "unit": "%"},
 *    "mineralDamping": {"type": "mineral_damping_coefficient", "value": "0.4173969279093913", "unit": ""},
 *    "moistureDamping": {"type": "moisture_damping_coefficient", "value": "0.3051252202538136", "unit": ""},
 *    "lowHeatContent": {"type": "heat_content:Btu/lb", "value": "8000.0"},
 *    "reactionVelocity": {"type": "reaction_velocity:1/min", "value": "14.155533132296872", "unit": ""},
 *    "reactionIntensity": {"type": "reaction_intensity:BTU/ft2/min", "value": "14422.600430267765"},
 *    "flameResidenceTime": {"type": "GENERIC_REAL", "value": "0.22078742385156463", "unit": "UniversalUnit"},
 *    "heatRelease": {"type": "GENERIC_REAL", "value": "3184.3287942392876", "unit": "UniversalUnit"},
 *    "propagatingFluxRatio": {"type": "GENERIC_REAL", "value": "0.03220906883716744", "unit": "UniversalUnit"},
 *    "heatSink": {"type": "GENERIC_REAL", "value": "61.16207627186109", "unit": "UniversalUnit"},
 *    "burnable": "true"
 *}; 
 * 
 * @param {type} log
 * @param {type} messenger
 * @param {type} util
 * @param {type} wmt
 * @returns {SurfaceFuelResource}
 */
define([
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        log,
        messenger,
        util,
        wmt) {
        "use strict";
        var SurfaceFuelResource = {
            /**
             * Gets a surface fuel tuple that is compatible with SurfaceFireResource.
             * 
             * @param {FuelModel} fuelModel A fuel model object.
             * @param {FuelMoistureTuple} fuelMoisture A fuel moisture tuple object.
             * @param {SurfaceFuel} callback Recieves a SurfaceFuel JSON object. Example:
             * @param {Function(JSON)} callback Receives computed SurfaceFuel JSON object. 
             */
            surfaceFuel: function (fuelModel, fuelMoisture, callback) {
                if (!window.FormData) {
                    // FormData is not supported; degrade gracefully/ alert the user as appropiate
                    messenger.notify(log.error("SurfaceFuelResource", "surfaceFuel", "formDataNotSupported"));
                    return;
                }

                var url = util.currentDomain() + wmt.SURFACEFUEL_REST_SERVICE,
                    formData = new FormData(),
                    model = JSON.stringify(fuelModel),
                    moisture = JSON.stringify(fuelMoisture);

                // Passing FuelModel and FuelMoisture as text/plain
                formData.append('mime-type', 'application/json');
                formData.append('fuelModel', model);
                formData.append('fuelMoisture', moisture);

                // Example for passing FuelModel and FuelMoisture as application/json Blobs
                // 
                //var modelBlob = new Blob([model], {type: 'application/json'});
                //var moistureBlob = new Blob([moisture], {type: 'application/json'});
                //formData.append('mime-type', 'application/json');
                //formData.append('fuelModel', modelBlob);
                //formData.append('fuelMoisture', moistureBlob);
                //console.log(url + formData.toString());

                $.ajax({
                    url: url,
                    data: formData,
                    cache: false, // tell the browser not to serve up cached data
                    contentType: false, // tell jQuery not auto encode as application/x-www-form-urlencoded
                    dataType: "json", // tell the server what kind of response we want
                    processData: false, // tell jQuery not to transform data into query string
                    type: 'POST',
                    success: function (data) {
                        callback(data);
                    }
                });
            },
            /**
             * Gets a conditioned surface fuel tuple that is compatible with SurfaceFireResource.
             * 
             * @param {FuelModel} fuelModel A fuel model object.
             * @param {FuelMoistureTuple} fuelMoisture A fuel moisture tuple object.
             * @param {SurfaceFuel} callback Recieves a SurfaceFuel JSON object. Example:
             * @param {Function(JSON)} callback Receives computed SurfaceFuel JSON object. 
             * 
             * @param {FuelModel} fuelModel
             * @param {Object} sunlight
             * @param {WeatherTuple} weather
             * @param {TerrainTuple} terrain
             * @param {Boolean} shaded
             * @param {FuelMoistureTuple} initialFuelMoisture
             * @param {Function} callback
             */
            conditionedSurfaceFuel: function (fuelModel, sunlight, weather, terrain, shaded, initialFuelMoisture,
                callback) {
                if (!window.FormData) {
                    // FormData is not supported; degrade gracefully/ alert the user as appropiate
                    messenger.notify(log.error("SurfaceFuelResource", "surfaceFuel", "formDataNotSupported"));
                    return;
                }

                var url = util.currentDomain() + wmt.SURFACEFUEL_REST_SERVICE + '/conditioned',
                    formData = new FormData(),
                    model = JSON.stringify(fuelModel),
                    sun = JSON.stringify(sunlight),
                    wx = JSON.stringify(weather),
                    topo = JSON.stringify(terrain),
                    shade = JSON.stringify(shaded),
                    moisture = JSON.stringify(initialFuelMoisture);

                // Passing FuelModel and FuelMoisture as text/plain
                formData.append('mime-type', 'application/json');
                formData.append('fuelModel', model);
                formData.append('sunlight', sun);
                formData.append('weather', wx);
                formData.append('terrain', topo);
                formData.append('shaded', shade);
                formData.append('initialFuelMoisture', moisture);

                // Example for passing FuelModel and FuelMoisture as application/json Blobs
                // 
                //var modelBlob = new Blob([model], {type: 'application/json'});
                //var moistureBlob = new Blob([moisture], {type: 'application/json'});
                //formData.append('mime-type', 'application/json');
                //formData.append('fuelModel', modelBlob);
                //formData.append('fuelMoisture', moistureBlob);
                //console.log(url + formData.toString());

                $.ajax({
                    url: url,
                    data: formData,
                    cache: false, // tell the browser not to serve up cached data
                    contentType: false, // tell jQuery not auto encode as application/x-www-form-urlencoded
                    dataType: "json", // tell the server what kind of response we want
                    processData: false, // tell jQuery not to transform data into query string
                    type: 'POST',
                    timeout: 2000,
                    success: function (data, textStatus, jqXHR) {
                        callback(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        callback(null);
                    }
                });
            }
        };
        return SurfaceFuelResource;
    }
);