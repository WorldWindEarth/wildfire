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
            this.afterRenderFunction = null;

            this.selectedItem.subscribe(function (newItem) {
                // Determine if the new item has a view template
                if (newItem !== null) {
                    if (typeof newItem.viewTemplateName !== "undefined") {
                        self.viewTemplateName(newItem.viewTemplateName);
                        self.afterRenderFunction = newItem.visualize;
                    } else {
                        self.viewTemplateName(null);
                    }
                }
            });
        }

        return OutputViewModel;
    }
);
