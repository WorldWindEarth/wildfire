/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Wildfire content module
 *
 * @param {type} ko
 * @param {type} $
 * @param {type} d3
 * @param {type} vis
 * 
 * @returns {WildfireView}
 */
define(['knockout',
    'jquery',
    'd3',
    'moment',
    'vis'],
        function (ko, $, d3, moment, vis) {

            /**
             * The view model for an individual Wildfire.
             * @constructor
             */
            function WildfireView() {
                var self = this;

                // Define the custom binding used in the #wildfire-view-template template
                ko.bindingHandlers.visualizePercentContained = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                        self.percentContained(element, viewModel);
                    }
                };
                // Define the custom binding used in the #wildfire-view-template template
                ko.bindingHandlers.visualizeWildfireDates = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                        self.dateRange(element, viewModel);
                    }
                };
                // Define the custom binding used in the #wildfire-view-template template
                ko.bindingHandlers.visualizeWildfireSize = {
                    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called when the binding is first applied to an element
                        // Set up any initial state, event handlers, etc. here
                    },
                    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        // This will be called once when the binding is first applied to an element,
                        // and again whenever any observables/computeds that are accessed change
                        // Update the DOM element based on the supplied values here.
                        self.wildfireSize(element, viewModel);
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
            WildfireView.prototype.dateRange = function (element, wildfire) {
                var discovered = moment(wildfire.discoveryDate),
                        lastReported = moment(wildfire.reportDate),
                        duration = moment.duration(discovered.diff(lastReported, 'days'), 'days');

                // Create a DataSet (allows two way data-binding)
                // See: http://visjs.org/docs/timeline/#Data_Format
                var items = new vis.DataSet([
                    {id: 1, content: 'Discovered', start: discovered, title: discovered.format('llll')},
                    {id: 2, content: 'Last Report', start: lastReported, title: lastReported.format('llll')},
                    {id: 3,
                        start: discovered,
                        end: lastReported,
                        content: duration.humanize(),
                        type: 'background'}
                ]);

                // Configuration for the Timeline
                // See: http://visjs.org/docs/timeline/#Configuration_Options
                var options = {
                    align: 'center',
                    zoomable: false
                };

                // Create a Timeline
                // See: http://visjs.org/docs/timeline/
                var timeline = new vis.Timeline(element, items, options);
            };


            /**
             * Display the percent contained in a radial progress chart via d3, 
             * with the uncontained percentage displayed in red (e.g., uncontrolled fire).
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            WildfireView.prototype.percentContained = function (element, wildfire) {
                var progress = wildfire.percentContained / 100.0;
                var remaining = 1 - progress;
                var colors = {
                    'pink': '#E1499A',
                    'yellow': '#f0ff08',
                    'green': '#47e495',
                    'red': '#ff0000',
                    'grey': '#cc',
                    'black': '#000000'
                };

                // The DOM element to contain the chart
                // See: https://github.com/d3/d3/blob/master/API.md#selecting-elements
                var parent = d3.select(element);

                var uncontainedColor = colors.red;
                var containedColor = colors.grey;

                // Chart dimensions
                var radius = 50;
                var border = 5;
                var padding = 5;
                var twoPi = Math.PI * 2;
                var formatPercent = d3.format('.0%');
                var boxSize = (radius + padding) * 2;

                // Generate a 360 arc.
                // See: https://github.com/d3/d3/blob/master/API.md#arcs
                var arc = d3.arc()
                        .startAngle(0)
                        .innerRadius(radius)
                        .outerRadius(radius - border);

                var svg = parent.append('svg')
                        .attr('width', boxSize)
                        .attr('height', boxSize);

                var defs = svg.append('defs');

                var filter = defs.append('filter')
                        .attr('id', 'blur');

                filter.append('feGaussianBlur')
                        .attr('in', 'SourceGraphic')
                        .attr('stdDeviation', '7');

                var g = svg.append('g')
                        .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

                var meter = g.append('g')
                        .attr('class', 'progress-meter');

                meter.append('path')
                        .attr('class', 'background')
                        .attr('fill', colors.grey)
                        .attr('fill-opacity', 0.5)
                        .attr('d', arc.endAngle(twoPi));

                var containedForeground = meter.append('path')
                        .attr('class', 'foreground')
                        .attr('fill', containedColor)
                        .attr('fill-opacity', 1)
                        .attr('stroke', containedColor)
                        .attr('stroke-width', 5)
                        .attr('stroke-opacity', 1)
                        .attr('filter', 'url(#blur)');
                      
                var uncontainedForeground = meter.append('path')
                        .attr('class', 'foreground')
                        .attr('fill', uncontainedColor)
                        .attr('fill-opacity', 1)
                        .attr('stroke', uncontainedColor)
                        .attr('stroke-width', 5)
                        .attr('stroke-opacity', 1)
                        .attr('filter', 'url(#blur)');

                var front = meter.append('path')
                        .attr('class', 'foreground')
                        .attr('fill', uncontainedColor)
                        .attr('fill-opacity', 1);

                var containedText = meter.append('text')
                        .attr('fill', '#fff')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em');

                containedForeground.attr('d', arc.endAngle(twoPi * progress));
                front.attr('d', arc.endAngle(twoPi * progress));
                
                uncontainedForeground.attr('d', arc.endAngle(twoPi * remaining));
                front.attr('d', arc.endAngle(twoPi * remaining));
                
                containedText.text(formatPercent(progress) + " contained");
            };

            /**
             * Display the wildfire size as a category in a segmented chart via d3.
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the chart will be attached
             * @param {type} wildfire The Wildfire model element
             */
            WildfireView.prototype.wildfireSize = function (element, wildfire) {

              // Dataset elements: [bar height, threshold for red fill, label]
              var dataset = [
                [10, 0, "<10K"], 
                [30, 10e3, "<20K"], 
                [50, 20e3, "<50K"],
                [70, 50e3, "<100K"], 
                [90, 100e3, ">100K"]
              ];

              var svgWidth = 120; 
              var svgHeight = 100;
              var barPadding = 2;
              var barWidth = (svgWidth / dataset.length);
              var colors = {
                  'pink': '#E1499A',
                  'yellow': '#f0ff08',
                  'green': '#47e495',
                  'red': '#ff0000',
                  'grey': '#cc',
                  'black': '#000000'
              };
              
              var parent = d3.select(element);
              var svg = parent.append('svg')
                  .attr("width", svgWidth + 20)
                  .attr("height", svgHeight);

              var bar = svg.selectAll("g")
                  .data(dataset)
                  .enter().append("g")
                  .attr("transform", function(d, i) { 
                    var translate = [barWidth * i, 0]; 
                      return "translate("+ translate +")";
                    });

              bar.append("rect")
                  .attr("y", function(d) {
                       return svgHeight - d[0];
                  })
                  .attr("height", function(d) { 
                      return d[0]; 
                  })
                  .attr("width", barWidth - barPadding)
                  .attr("fill", function(d) { 
                      return wildfire.acres > d[1] ? colors.red : colors.black; 
                  });

              var title = svg.append("text")
                .attr("x", svgWidth / 2)
                .attr("y", svgHeight / 2)
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .text(Number(wildfire.acres).toLocaleString() + " acres");
              
              var subtitle = svg.append("text")
                .attr("x", svgWidth / 2)
                .attr("y", svgHeight / 2 + 20)
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .attr('font-style', 'italic')
                .text("(" + Number(Math.round(wildfire.acres * 0.404686)).toLocaleString() + " hectares)");
                
            };

            return WildfireView;
        }
);

