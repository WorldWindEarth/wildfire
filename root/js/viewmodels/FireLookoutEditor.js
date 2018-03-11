/*
 * The MIT License - http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2016 Bruce Schubert.
 */

/*global WorldWind*/

define(['model/util/Log', 'knockout', 'jquery', 'jqueryui'],
    function (log, ko, $) {
        "use strict";
        /**
         *
         * @constructor
         * @param {String} viewFragment html
         */
        function FireLookoutEditor(viewFragment) {
            if (!viewFragment) {
                throw new ArgumentError(
                    log.error("FireLookoutEditor", "constructor", "missingFragment"));
            }
            var self = this;

            // Load the view fragment into the DOM's body.
            // Wrap the view in a hidden div for use in a JQuery UI dialog.
            var $view = $('<div style="display: none"></div>')
                .append(viewFragment)
                .appendTo($('body'));
            this.view = $view.children().first().get(0);

            this.lookout = ko.observable({});

            this.open = function (lookout) {
                console.log("Open Fire Lookout: " + lookout.name());
                self.lookout(lookout);

                // Prepare a JQuery UI dialog
                var $editorElement = $(self.view);
                $editorElement.dialog({
                    autoOpen: false,
                    title: "Edit Fire Lookout"
                });

                // Open the dialog
                $editorElement.dialog("open");
            };

            // Binds the view to this view model.
            ko.applyBindings(this, this.view);

        }

        return FireLookoutEditor;
    }
);