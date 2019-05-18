/* 
 * The MIT License.
 * Copyright (c) 2015, 2016 Bruce Schubert
 */


/*global define, WorldWind*/

define(['model/Constants', 'model/globe/EnhancedAnnotation', 'worldwind'],
        function (constants, EnhancedAnnotation, ww) {
            "use strict";

            var WildlandFireCallout = function (fire) {

                // Set default annotation attributes.
                var annotationAttributes = new WorldWind.AnnotationAttributes(null);
                annotationAttributes.cornerRadius = 14;
                annotationAttributes.backgroundColor = new WorldWind.Color(0, 0.5, 0, 1); // dark green
                annotationAttributes.drawLeader = true;
                annotationAttributes.leaderGapWidth = 10;
                annotationAttributes.leaderGapHeight = 50;
                annotationAttributes.opacity = 1;
                annotationAttributes.scale = 1;
                annotationAttributes.width = 0; // auto-resize - no constraint
                annotationAttributes.height = 0; // auto-resize - no constraint
                annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
                annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);
        
                EnhancedAnnotation.call(this, new WorldWind.Position(fire.latitude, fire.longitude), annotationAttributes);
                this.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                
                this.updateAnnotation(fire);

            };
            // Inherit Annotation parent methods
            WildlandFireCallout.prototype = Object.create(EnhancedAnnotation.prototype);

            WildlandFireCallout.prototype.updateAnnotation = function(fire) {
                if (fire) {
                  this.text = "Incident Name: " + fire.name +
                    "\nNumber: " + fire.number + 
                    "\nSize: " + Number(fire.acres).toLocaleString() + " acres" +
                    "\nPercent Contained: " + fire.percentContained + "%" +
                    "\nDiscovery Date: " + fire.discoveryDate.toLocaleDateString() +
                    "\nReport Date: " + fire.reportDate.toLocaleDateString() +
                    "\nStatus: " + (fire.status === 'U' ? "U (Update)" : fire.status === 'I' ? "I (Initial)" : fire.status === 'F' ? "F (Final)" : "Other");
                } else {
                    this.text = "Standby...";
                }
              };

            return WildlandFireCallout;
        }
);

