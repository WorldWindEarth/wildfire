/*
 * The MIT License - http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2016 Bruce Schubert.
 */

/*global WorldWind*/

define(['knockout', 'jquery', 'jqueryui'],
        function (ko, $) {
            "use strict";
            /**
             *
             * @constructor
             */
            function FireLookoutEditor() {
                var self = this;
                self.lookout = ko.observable({});
                
                self.open = function (lookout) {
                    console.log("Open Fire Lookout: " + lookout.name());
                    self.lookout(lookout);
                    
                    // Prepare a JQuery UI dialog
                    var $editorElement = $("#fire-lookout-editor");                    
                    $editorElement.dialog({
                        autoOpen: false,
                        title: "Edit Fire Lookout"
                    });
                    
                    // Open the dialog
                    $editorElement.dialog("open");
                };

            }

            return FireLookoutEditor;
        }
);