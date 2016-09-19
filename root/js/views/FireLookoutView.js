/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * FireLookout content module.
 *
 * @param {type} ko
 * @param {type} $
 * @param {type} d3
 * @param {type} moment
 * @param {type} vis
 * 
 * @returns {FireLookoutView}
 */
define(['knockout',
    'jquery',
    'd3',
    'moment',
    'vis'],
        function (ko, $, d3, moment, vis) {

            /**
             * The view model for an individual FireLookout.
             * @constructor
             */
            function FireLookoutView() {
                var self = this;

                // Define custom Knockout bindings for a FireLookout.
                ko.bindingHandlers.visualizeWildfireDiamond = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                    }
                };
                ko.bindingHandlers.visualizeHaulChart = {
                    init: function (element, valueAccessor, allBindings, lookout, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                        self.createHaulChart(element);                    
                    },
                    update: function (element, valueAccessor, allBindings, lookout, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change.
                        self.updateHaulChart(element, lookout);
                    }
                };
                ko.bindingHandlers.visualizeFuelModel = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                    }
                };
                ko.bindingHandlers.visualizeFireBehavior = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                    }
                };
            }

            /**
             * Display the wildfire's timeline with a vis.js Timeline.
             * See: http://visjs.org/docs/timeline/
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutView.prototype.drawWildfireDiamond = function (element, lookout) {
                // TODO: Draw .png as a placemark for future d3 development

            };


            /**
             * Display the percent contained in a radial progress chart via d3, 
             * with the uncontained percentage displayed in red (e.g., uncontrolled fire).
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutView.prototype.createHaulChart = function (element) {

                var margin = {top: 20, right: 15, bottom: 60, left: 60}, 
                        width = 400 - margin.left - margin.right, 
                        height = 300 - margin.top - margin.bottom;

                var x = d3.scaleLog() // btu
                        .domain([10,11000])
                        .range([0, width]);

                var y = d3.scaleLog() // ros ft/min
                        .domain([1, 1100])
                        .range([height, 0]);

                var chart = d3.select(element)
                        .append('svg:svg')
                        .attr('width', width + margin.right + margin.left)
                        .attr('height', height + margin.top + margin.bottom)
                        .attr('class', 'chart')

                var main = chart.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('class', 'main')

                // draw the x axis
                var xAxis = d3.axisBottom(x);

                main.append('g')
                        .attr('transform', 'translate(0,' + height + ')')
                        .attr('class', 'main axis date')
                        .call(xAxis);

                // draw the y axis
                var yAxis = d3.axisLeft(y);

                main.append('g')
                        .attr('transform', 'translate(0,0)')
                        .attr('class', 'main axis date')
                        .call(yAxis);

                var g = main.append("svg:g")
                        .attr('id', 'plot');

            };
            /**
             * Display the percent contained in a radial progress chart via d3, 
             * with the uncontained percentage displayed in red (e.g., uncontrolled fire).
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutView.prototype.updateHaulChart = function (element, lookout) {
                lookout.fireBehavior.subscribe(function(fireBehavior) {
                    
                var heatRelease = (fireBehavior === null ? 0 : fireBehavior.heatRelease),
                    rateOfSpreadMax = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadMax),
                    rateOfSpreadFlanking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadFlanking),
                    rateOfSpreadBacking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadNoWindNoSlope),
                    data = [[heatRelease, rateOfSpreadMax], [heatRelease, rateOfSpreadFlanking]];

                var chart = d3.select(element);
                var g = chart.selectAll("#plot");

                g.selectAll("scatter-dots")
                        .data(data)
                        .enter().append("svg:circle")
                            .attr("cx", function (d, i) {
                                return x(d[0]);
                            })
                            .attr("cy", function (d) {
                                return y(d[1]);
                            })
                            .attr("r", 8);
                });
            };

            /**
             * Display the wildfire size as a category in a segmented chart via d3.
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutView.prototype.drawFuelModel = function (element, wildfire) {

            };

            return FireLookoutView;
        }
);

