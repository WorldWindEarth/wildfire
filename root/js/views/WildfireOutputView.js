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
 * @returns {WildfireOutputView}
 */
define(['knockout',
    'jquery',
    'd3',
    'moment',
    'vis',
    'model/Constants'],
        function (ko, $, d3, moment, vis, constants) {

            /**
             * The view model for the Wildfire Output panel.
             * @constructor
             */
            function WildfireOutputView(globe) {
                var self = this;

                this.globe = globe;

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
            WildfireOutputView.prototype.dateRange = function (element, wildfire) {
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
            WildfireOutputView.prototype.percentContained = function (element, wildfire) {
                var progress = wildfire.percentContained / 100.0;
                var colors = {
                    'pink': '#E1499A',
                    'yellow': '#f0ff08',
                    'green': '#47e495',
                    'red': '#ff0000'
                };

                // The DOM element to contain the chart
                // See: https://github.com/d3/d3/blob/master/API.md#selecting-elements
                var parent = d3.select(element);

                var color = colors.red;

                // Chart dimensions
                var radius = 40;
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
                        .attr('fill', '#ccc')
                        .attr('fill-opacity', 0.5)
                        .attr('d', arc.endAngle(twoPi));

                var foreground = meter.append('path')
                        .attr('class', 'foreground')
                        .attr('fill', color)
                        .attr('fill-opacity', 1)
                        .attr('stroke', color)
                        .attr('stroke-width', 5)
                        .attr('stroke-opacity', 1)
                        .attr('filter', 'url(#blur)');

                var front = meter.append('path')
                        .attr('class', 'foreground')
                        .attr('fill', color)
                        .attr('fill-opacity', 1);

                var numberText = meter.append('text')
                        .attr('fill', '#fff')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em');

                var remaining = 1 - progress;
                foreground.attr('d', arc.endAngle(twoPi * remaining));
                front.attr('d', arc.endAngle(twoPi * remaining));
                numberText.text(formatPercent(progress));
            };

            WildfireOutputView.prototype.wildfireSize = function (element, wildfire) {
                var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el,
                        endPadRad, height, i, margin, needle, numSections, padRad, percToDeg,
                        percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad,
                        svg, totalPercent, width;

                percent = 0.65;

                barWidth = 5;
                numSections = 3;
                sectionPerc = 1 / numSections / 2;
                padRad = 0.05;
                chartInset = 10;
                totalPercent = 0.75;
                el = d3.select(element);

                margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 20
                };
                width = element.offsetWidth - margin.left - margin.right;
                height = width;
                radius = Math.min(width, height) / 2;

                percToDeg = function (perc) {
                    return perc * 360;
                };
                percToRad = function (perc) {
                    return degToRad(percToDeg(perc));
                };
                degToRad = function (deg) {
                    return deg * Math.PI / 180;
                };

                svg = el.append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom);

                chart = svg.append('g')
                        .attr('transform',
                                'translate(' + (width + margin.left) / 2 + ', ' + (height + margin.top) / 2 + ')');

                for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
                    arcStartRad = percToRad(totalPercent);
                    arcEndRad = arcStartRad + percToRad(sectionPerc);
                    totalPercent += sectionPerc;
                    startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
                    endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
                    arc = d3.arc()
                            .outerRadius(radius - chartInset)
                            .innerRadius(radius - chartInset - barWidth)
                            .startAngle(arcStartRad + startPadRad)
                            .endAngle(arcEndRad - endPadRad);
                    chart.append('path')
                            .attr('class', 'arc chart-color' + sectionIndx)
                            .attr('d', arc);
                }
                Needle = function () {
                    function Needle(len, radius1) {
                        this.len = len;
                        this.radius = radius1;
                    }
                    Needle.prototype.drawOn = function (el, perc) {
                        el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
                        return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
                    };
                    Needle.prototype.animateOn = function (el, perc) {
                        var self;
                        self = this;
                        return el.transition()
                                .delay(500)
                                .ease('elastic')
                                .duration(3000)
                                .selectAll('.needle')
                                .tween('progress', function () {
                            return function (percentOfPercent) {
                                var progress;
                                progress = percentOfPercent * perc;
                                return d3.select(this).attr('d', self.mkCmd(progress));
                            };
                        });
                    };
                    Needle.prototype.mkCmd = function (perc) {
                        var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
                        thetaRad = percToRad(perc / 2);
                        centerX = 0;
                        centerY = 0;
                        topX = centerX - this.len * Math.cos(thetaRad);
                        topY = centerY - this.len * Math.sin(thetaRad);
                        leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
                        leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
                        rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
                        rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
                        return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
                    };
                    return Needle;
                }();
                //needle = new Needle(90, 15);
                //needle.drawOn(chart, percent);
                //needle.animateOn(chart, percent);
            };

//            WildfireOutputView.prototype.percentContainedxx = function (element, wildfire) {
//                var percentContained = wildfire.percentContained;
//                var width = 960,
//                        height = 500,
//                        twoPi = 2 * Math.PI,
//                        progress = percentContained,
//                        total = 1308573, // must be hard-coded if server doesn't report Content-Length
//                        formatPercent = d3.format(".0%");
//
//                var arc = d3.svg.arc()
//                        .startAngle(0)
//                        .innerRadius(180)
//                        .outerRadius(240);
//
//                var svg = d3.select(element).append("svg")
//                        .attr("width", width)
//                        .attr("height", height)
//                        .append("g")
//                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//                var meter = svg.append("g")
//                        .attr("class", "progress-meter");
//
//                meter.append("path")
//                        .attr("class", "background")
//                        .attr("d", arc.endAngle(twoPi));
//
//                var foreground = meter.append("path")
//                        .attr("class", "foreground");
//
//                var text = meter.append("text")
//                        .attr("text-anchor", "middle")
//                        .attr("dy", ".35em");
//
//                d3.json("https://api.github.com/repos/mbostock/d3/git/blobs/2e0e3b6305fa10c1a89d1dfd6478b1fe7bc19c1e?" + Math.random())
//                        .on("progress", function () {
//                            var i = d3.interpolate(progress, d3.event.loaded / total);
//                            d3.transition().tween("progress", function () {
//                                return function (t) {
//                                    progress = i(t);
//                                    foreground.attr("d", arc.endAngle(twoPi * progress));
//                                    text.text(formatPercent(progress));
//                                };
//                            });
//                        })
//                        .get(function (error, data) {
//                            meter.transition().delay(250).attr("transform", "scale(0)");
//                        });
//            };



            return WildfireOutputView;
        }
);

