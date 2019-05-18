/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/*global define, WorldWind*/

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
            function FireLookoutView(globe) {
                var self = this;
                this.globe = globe;
                
                // Haul Chart dimensions
                this.haulChartContainter = null;
                this.margin = {top: 20, right: 15, bottom: 30, left: 40};
                this.width = 400 - this.margin.left - this.margin.right;
                this.height = 300 - this.margin.top - this.margin.bottom;
                // Chart x/y domains
                this.btuDomain = [10, 11000];       // btu/ft^2
                this.rosDomain = [0.1, 1100];       // chains/hr
                // Chart colors for fire behavior adjectives
                this.COLOR_LOW = WorldWind.Color.colorFromBytes(128, 127, 255, 200);         // blue
                this.COLOR_MODERATE = WorldWind.Color.colorFromBytes(127, 193, 151, 200);    // green
                this.COLOR_ACTIVE = WorldWind.Color.colorFromBytes(255, 179, 130, 200);      // tan
                this.COLOR_VERY_ACTIVE = WorldWind.Color.colorFromBytes(255, 128, 255, 200); // magenta
                this.COLOR_EXTREME = WorldWind.Color.colorFromBytes(253, 128, 124, 200);     // orange
                // Flame Length thresholds
                this.FL_THRESHOLD_LOW = 1;
                this.FL_THRESHOLD_MODERATE = 3;
                this.FL_THRESHOLD_ACTIVE = 7;
                this.FL_THRESHOLD_VERY_ACTIVE = 15;
               
                    

                // Define custom Knockout bindings for a FireLookout.
                ko.bindingHandlers.visualizeWildfireDiamond = {
                    init: function (element, valueAccessor, allBindings, viewModel/*deprecated*/, bindingContext) {
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
                    init: function (element, valueAccessor, allBindings, viewModel/*deprecated*/, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                        console.log("visualizeHaulChart.init called");
                        self.haulChartContainter = element;
                        // Draw the initial haul chart
                        var lookout = bindingContext.$data;           // observable
                        self.createHaulChart(lookout.fireBehavior()); // observable
                    },
                    update: function (element, valueAccessor, allBindings, viewModel/*deprecated*/, bindingContext) {                
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change.
                        console.log("visualizeHaulChart.update called");
                        // Update the haul chart
                        var lookout = bindingContext.$data;           // observable
                        self.updateHaulChart(lookout.fireBehavior()); // observable
                    }
                };
                ko.bindingHandlers.visualizeFuelModel = {
                    init: function (element, valueAccessor, allBindings, viewModel/*deprecated*/, bindingContext) {
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
                    init: function (element, valueAccessor, allBindings, viewModel/*deprecated*/, bindingContext) {
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
             * Display the Wildfire Diamond representing the current fire behavior
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} lookout 
             */
            FireLookoutView.prototype.drawWildfireDiamond = function (element, lookout) {
                // TODO: Draw .png as a placemark for future d3 development

            };


            /**
             * Display the Haul Chart
             * 
             * @param {type} fireBehavior The fire behavior to be visualized
             */
            FireLookoutView.prototype.createHaulChart = function (fireBehavior) {
                console.log("createHaulChart called");
                this.width = parseInt(d3.select(this.haulChartContainter).style('width'), 10);
                this.width = this.width - this.margin.left - this.margin.right;
                
                var heatRelease = (Number.isNaN(fireBehavior.heatRelease) ? 0 : Number(fireBehavior.heatRelease)),
                    rateOfSpreadHead = (Number.isNaN(fireBehavior.rateOfSpreadMax) ? 0 : Number(fireBehavior.rateOfSpreadMax)) / 1.1, //ft/min to ch/hr
                    rateOfSpreadFlanking = (Number.isNaN(fireBehavior.rateOfSpreadFlanking) ? 0 : Number(fireBehavior.rateOfSpreadFlanking)) / 1.1,
                    rateOfSpreadBacking = (Number.isNaN(fireBehavior.rateOfSpreadBacking) ? 0 : Number(fireBehavior.rateOfSpreadBacking)) / 1.1,
                    dataset = [
                      [heatRelease, rateOfSpreadHead], 
                      [heatRelease, rateOfSpreadFlanking], 
                      [heatRelease, rateOfSpreadBacking]];
                
                var x = d3.scaleLog() // btu
                        .domain(this.btuDomain)
                        .range([0, this.width]);

                var y = d3.scaleLog() // ros ch/hr
                        .domain(this.rosDomain)
                        .range([this.height, 0]);

                var chart = d3.select(this.haulChartContainter)
                        .append('svg:svg')
                        .attr('width', this.width + this.margin.right + this.margin.left)
                        .attr('height', this.height + this.margin.top + this.margin.bottom)
                        .attr('class', 'chart');

                var xyPlot = chart.append('g')
                        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
                        .attr('width', this.width)
                        .attr('height', this.height)
                        .attr('class', 'xyplot');

                // draw the x axis
                var xAxis = d3.axisBottom(x)
                        .ticks(4, d3.format(",.0f"));
                xyPlot.append('g')
                        .attr('transform', 'translate(0,' + this.height + ')')
                        .attr('class', 'xyplot axis btu')
                        .call(xAxis); 

                // draw the y axis
                var yAxis = d3.axisLeft(y)
                        .ticks(5, d3.format(",.0f"));
                xyPlot.append('g')
                        .attr('transform', 'translate(0,0)')
                        .attr('class', 'xyplot axis ros')
                        .call(yAxis);

                var g = xyPlot.append("svg:g")
                        .attr('id', 'plot');

                g.selectAll("scatter-dots")
                        .data(dataset)
                        .enter().append("svg:circle")
                        .attr("cx", function (d) {
                            return x(d[0]);
                        })
                        .attr("cy", function (d) {
                            return y(d[1]);
                        })
                        .attr("r", 4);
            };
            /**
             * Update the Haul Chart.
             * @param {type} fireBehavior The fire behavior data
             */
            FireLookoutView.prototype.updateHaulChart = function (fireBehavior) {
                console.log("updateHaulChart called");

                var heatRelease = (Number.isNaN(fireBehavior.heatRelease) ? 0 : Number(fireBehavior.heatRelease)),
                    rateOfSpreadHead = (Number.isNaN(fireBehavior.rateOfSpreadMax) ? 0 : Number(fireBehavior.rateOfSpreadMax))/ 1.1,
                    rateOfSpreadFlanking = (Number.isNaN(fireBehavior.rateOfSpreadFlanking) ? 0 : Number(fireBehavior.rateOfSpreadFlanking))/ 1.1,
                    rateOfSpreadBacking = (Number.isNaN(fireBehavior.rateOfSpreadBacking) ? 0 : Number(fireBehavior.rateOfSpreadBacking))/ 1.1,
                    dataset = [
                      [heatRelease, rateOfSpreadHead], 
                      [heatRelease, rateOfSpreadFlanking], 
                      [heatRelease, rateOfSpreadBacking]];
                    
               // TODO: Rescale to fire behavior vals
                var x = d3.scaleLog() // btu
                    .domain(this.btuDomain)
                    .range([0, this.width]);
                var y = d3.scaleLog() // ros ft/min
                    .domain(this.rosDomain)
                    .range([this.height, 0]);

                var chart = d3.select(this.haulChartContainter);
                var g = chart.selectAll("#plot");

                // Update the values
                g.selectAll("circle")
                    .data(dataset)
                    .attr("cx", function (d) {
                        return x(d[0]);
                    })
                    .attr("cy", function (d) {
                        return y(d[1]);
                    })
                    .attr("r", 4);
                  
//                // Update all circles
//                chart.selectAll('circle')
//                    .data(dataset)
//                    .transition() // Transition 1
//                    .duration(1000)
//                        .ease('circle')
//                        .each('start', function() {
//                            d3.select(this)
//                                .attr('fill', 'gray')
//                                .attr('r', 2);
//                        })
//                        .attr('cx', function(d) {
//                            return xScale(d[0]);
//                        })
//                        .attr('cy', function(d) {
//                            return yScale(d[1]);
//                        })
//                    .transition() // Transition 2, equiv to below
//                    .duration(250)
//                        .attr('fill', 'teal')
//                        .attr('r', 4);
//                  
                  
                  
            };

            /**
             * Render a photo and description of the current fuel model
             * @param {type} element
             * @param {type} wildfire
             * @returns {undefined}
             */
            FireLookoutView.prototype.drawFuelModel = function (element, wildfire) {

            };

            return FireLookoutView;
        }
);

