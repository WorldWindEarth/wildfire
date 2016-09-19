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
 * @param {type} FireLookoutView
 * @param {type} WeatherScoutView
 * @param {type} WildfireView
 * 
 * @returns {OutputViewModel}
 */
define(['knockout',
    'jquery',
    'views/FireLookoutView',
    'views/WeatherScoutView',
    'views/WildfireView'],
        function (ko, $, 
                FireLookoutView,
                WeatherScoutView,
                WildfireView) {

            /**
             * The view model for the Output panel.
             * @constructor
             */
            function OutputViewModel(globe) {
                var self = this;

                this.globe = globe;

                // Load the Knockout custom binding used in the #fire-lookout-view-template
                this.fireLookoutView = new FireLookoutView();
                // Load the Knockout custom binding used in the #weather-scout-view-template
                this.wxScoutView = new WeatherScoutView();
                // Load the Knockout custom binding used in the #wildfire-view-template
                this.wildfireView = new WildfireView();

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

