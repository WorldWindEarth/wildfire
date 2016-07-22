/*
 * The MIT License - http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2016 Bruce Schubert.
 */

/*global WorldWind*/

define(['knockout', 'model/Constants'],
        function (ko, constants) {
            "use strict";
            /**
             *
             * @param {Globe} globe
             * @param {WeatherScoutManager} weatherScoutManager
             * @constructor
             */
            function WeatherViewModel(globe, weatherScoutManager) {
                var self = this,
                        wwd = globe.wwd;

                self.weatherScoutsLayer = globe.layerManager.findLayer(constants.LAYER_NAME_MARKERS);
                self.weatherScouts = ko.observableArray()  // observable array
//                self.weatherScoutsLayer = globe.layerManager.findLayer(constants.LAYER_NAME_MARKERS);
//                self.weatherScouts = weatherScoutManager.weatherScouts;   // observable array
//
//                /** "Goto" function centers the globe on a selected weatherScout */
//                self.gotoWeatherScout = function (weatherScout) {
//                    globe.goto(weatherScout.latitude(), weatherScout.longitude());
//                };
//
//                /** "Edit" function invokes a modal dialog to edit the weatherScout attributes */
//                self.editWeatherScout = function (weatherScout) {
//                    if (weatherScout.isOpenable) {
//                        weatherScout.open();
//                    }
//                };
//                
//                /** "Remove" function removes a weatherScout from the globe */
//                self.removeWeatherScout = function (weatherScout) {
//                    if (weatherScout.isRemovable) {
//                        weatherScout.remove();
//                    }
//                };

            }

            return WeatherViewModel;
        }
);