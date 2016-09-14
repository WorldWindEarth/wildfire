/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Output content module.
 *
 * @param {type} ko
 * @param {type} $
 * @returns {OutputViewModel}
 */
define(['knockout',
    'jquery',
    'views/FireLookoutViewModel',
    'views/WeatherScoutViewModel',
    'views/WildfireViewModel'],
        function (ko, $, 
                FireLookoutViewModel,
                WeatherScoutViewModel,
                WildfireViewModel) {

            /**
             * The view model for the Output panel.
             * @constructor
             */
            function OutputViewModel(globe) {
                var self = this;

                this.globe = globe;

                // Knockout custom binding used in the #fire-lookout-view-template
                this.fireLookoutViewModel = new FireLookoutViewModel();
                // Knockout custom binding used in the #weather-scout-view-template
                this.wxScoutViewModel = new WeatherScoutViewModel();
                // Knockout custom binding used in the #wildfire-view-template
                this.wildfireView = new WildfireViewModel();

                // The viewTemplate defines the content displayed in the output pane.
                this.viewTemplateName = ko.observable(null);

                // Get a reference to the SelectController's selectedItem observable
                this.selectedItem = this.globe.selectController.lastSelectedItem;
                
                // Update the view template from the selected object.
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
            }
            
            return OutputViewModel;
        }
);

