/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Output content module
 *
 * @param {type} ko
 * @param {type} $
 * @returns {OutputViewModel}
 */
define(['knockout',
    'jquery',
    'vis',
    'model/Constants'],
        function (ko, $, vis, constants) {

            /**
             * The view model for the Output panel.
             * @constructor
             */
            function OutputViewModel(globe) {
                var self = this;

                this.globe = globe;

                // Get a reference to the SelectController's selectedItem observable
                this.selectedItem = this.globe.selectController.lastSelectedItem;

                this.viewTemplateName = ko.observable(null);

                this.selectedItem.subscribe(function (newItem) {
                    // Determine if the new item has a view template
                    if (newItem !== null) {
                        if (typeof newItem.viewTemplateName !== "undefined") {
                            self.viewTemplateName(newItem.viewTemplateName);
                        } else {
                            self.viewTemplateName(null);
                        }
                    }
                });

                ko.bindingHandlers.visualizeWeather = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.

                        // First get the latest data that we're bound to
                        var value = valueAccessor();

                        // Next, whether or not the supplied model property is observable, get its current value
                        var valueUnwrapped = ko.unwrap(value);

                        self.visualizeWeather(element, viewModel);
                    }
                };
            }

            OutputViewModel.prototype.visualizeWeather = function (element, wxScout) {
                var forecasts = wxScout.getForecasts(),
                        i, len, wx,
                        items = [],
                        names = ["F ", "RH %"],
                        groups = new vis.DataSet();

                groups.add({
                    id: 0,
                    content: names[0],
                    options: {
                        drawPoints: {
                            style: 'square' // square, circle
                        },
                        shaded: {
                            orientation: 'bottom' // top, bottom
                        }
                    }
                });
                groups.add({
                    id: 1,
                    content: names[1],
                    options: {
                        drawPoints: {
                            style: 'circle' // square, circle
                        },
                        shaded: {
                            orientation: 'top' // top, bottom
                        },
                        yAxisOrientation: 'right'
                    }
                });


                for (i = 0, len = forecasts.length; i < len; i++) {
                    wx = forecasts[i];
                    items.push({x: wx.time, y: wx.airTemperatureF, group: 0, label: 'F'});
                    items.push({x: wx.time, y: wx.relaltiveHumidityPct, group: 1});
                }


                var dataset = new vis.DataSet(items);
                var options = {
                    dataAxis: {
                        left: {
                            range: {min: 32, max: 120}
                        },
                        right: {
                            range: {min: 0, max: 100}
                        },
                        icons: true
                    },
                    legend: true,
                    height: 300,
//                    start: forecasts[0].time,
//                    end: forecasts[len-1].time
                };
                var graph2d = new vis.Graph2d(element, dataset, groups, options);
            }

            return OutputViewModel;
        }
);

