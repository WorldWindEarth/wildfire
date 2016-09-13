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
 * @returns {FireLookoutViewModel}
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
            function FireLookoutViewModel() {
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
            }

            /**
             * Display the wildfire's timeline with a vis.js Timeline.
             * See: http://visjs.org/docs/timeline/
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutViewModel.prototype.drawWildfireDiamond = function (element, lookout) {

            };


            /**
             * Display the percent contained in a radial progress chart via d3, 
             * with the uncontained percentage displayed in red (e.g., uncontrolled fire).
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutViewModel.prototype.drawHaulChart = function (element, wildfire) {
                
            };

            /**
             * Display the wildfire size as a category in a segmented chart via d3.
             * See: https://github.com/d3/d3/blob/master/API.md
             * 
             * @param {type} element DOM element where the Timeline will be attached
             * @param {type} wildfire The Wildfire model element
             */
            FireLookoutViewModel.prototype.drawFuelModel = function (element, wildfire) {

            };

            return FireLookoutViewModel;
        }
);

