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
             * @param {FireLookoutManager} fireLookoutManager
             * @constructor
             */
            function WildfireViewModel(globe, fireLookoutManager) {
                var self = this;

                self.fireLookouts = fireLookoutManager.lookouts;

                /** "Goto" function centers the globe on a selected fireLookout */
                self.gotoFireLookout = function (fireLookout) {
                    globe.goto(fireLookout.latitude(), fireLookout.longitude());
                };

                /** "Edit" function invokes a modal dialog to edit the fireLookout attributes */
                self.editFireLookout = function (fireLookout) {
                    if (fireLookout.isOpenable) {
                        fireLookout.open();
                    }
                };
                
                /** "Remove" function removes a fireLookout from the globe */
                self.removeFireLookout = function (fireLookout) {
                    if (fireLookout.isRemovable) {
                        fireLookout.remove();
                    }
                };
            }

            return  WildfireViewModel;
        }
);