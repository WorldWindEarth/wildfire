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
                this.margin = {top: 20, right: 15, bottom: 60, left: 60};
            
                this.width = 400 - this.margin.left - this.margin.right;
                this.height = 300 - this.margin.top - this.margin.bottom;
                this.btuDomain = [10, 11000];
                this.rosDomain = [1, 1100];
                    

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
            FireLookoutView.prototype.createHaulChart = function (element, lookout) {
                var fireBehavior = lookout.fireBehavior;
                var heatRelease = (fireBehavior === null ? 0 : fireBehavior.heatRelease),
                    rateOfSpreadMax = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadMax),
                    rateOfSpreadFlanking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadFlanking),
                    rateOfSpreadBacking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadNoWindNoSlope),
                    data = [[heatRelease, rateOfSpreadMax], [heatRelease, rateOfSpreadFlanking]];
                
                var x = d3.scaleLog() // btu
                        .domain(this.btuDomain)
                        .range([0, this.width]);

                var y = d3.scaleLog() // ros ft/min
                        .domain(this.rosDomain)
                        .range([this.height, 0]);

                var chart = d3.select(element)
                        .append('svg:svg')
                        .attr('width', this.width + this.margin.right + this.margin.left)
                        .attr('height', this.height + this.margin.top + this.margin.bottom)
                        .attr('class', 'chart')

                var main = chart.append('g')
                        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
                        .attr('width', this.width)
                        .attr('height', this.height)
                        .attr('class', 'main')

                // draw the x axis
                var xAxis = d3.axisBottom(x);
                main.append('g')
                        .attr('transform', 'translate(0,' + this.height + ')')
                        .attr('class', 'main axis btu')
                        .call(xAxis);

                // draw the y axis
                var yAxis = d3.axisLeft(y);
                main.append('g')
                        .attr('transform', 'translate(0,0)')
                        .attr('class', 'main axis ros')
                        .call(yAxis);

                var g = main.append("svg:g")
                        .attr('id', 'plot');

                g.selectAll("scatter-dots")
                        .data(data)
                        .enter().append("svg:circle")
                        .attr("cx", function (d) {
                            return x(d[0]);
                        })
                        .attr("cy", function (d) {
                            return y(d[1]);
                        })
                        .attr("r", 8);
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
                var self = this;
                // Everytime the selected FireLookout is changed, we need to 
                // subscribe to the lookout's fire behavior observable to update
                // the chart when the fire behavior changes.
                // 
                // TODO: does the leak if we don't unsubscribe?
                lookout.fireBehavior.subscribe(function (fireBehavior) {

                    var heatRelease = (fireBehavior === null ? 0 : fireBehavior.heatRelease),
                        rateOfSpreadMax = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadMax),
                        rateOfSpreadFlanking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadFlanking),
                        rateOfSpreadBacking = (fireBehavior === null ? 0 : fireBehavior.rateOfSpreadNoWindNoSlope),
                        data = [[heatRelease, rateOfSpreadMax], [heatRelease, rateOfSpreadFlanking]];

                    var x = d3.scaleLog() // btu
                        .domain(self.btuDomain)
                        .range([0, self.width]);

                    var y = d3.scaleLog() // ros ft/min
                        .domain(self.rosDomain)
                        .range([self.height, 0]);
                    
                    var chart = d3.select(element);
                    var g = chart.selectAll("#plot");

                    g.selectAll("scatter-dots")
                        .data(data)
                        .attr("cx", function (d) {
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

