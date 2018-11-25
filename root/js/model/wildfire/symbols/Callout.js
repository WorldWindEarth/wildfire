/* 
 * The MIT License.
 * Copyright (c) 2015, 2016 Bruce Schubert
 */


/*global define, WorldWind*/

define(['model/Constants', 'model/globe/EnhancedAnnotation', 'worldwind'],
        function (constants, EnhancedAnnotation, ww) {
            "use strict";

            var CalloutAnnotation = function (latitude, longitude, lookout) {

                // Set default annotation attributes.
                var annotationAttributes = new WorldWind.AnnotationAttributes(null);
                annotationAttributes.cornerRadius = 14;
                annotationAttributes.backgroundColor = new WorldWind.Color(0.5, 0, 0, 1); // dark red
                annotationAttributes.drawLeader = true;
                annotationAttributes.leaderGapWidth = 10;
                annotationAttributes.leaderGapHeight = 50;
                annotationAttributes.opacity = 1;
                annotationAttributes.scale = 1;
                annotationAttributes.width = 0; // auto-resize - no constraint
                annotationAttributes.height = 0; // auto-resize - no constraint
                annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
                annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);
        
                EnhancedAnnotation.call(this, new WorldWind.Position(latitude, longitude, constants.MAP_SYMBOL_ALTITUDE_WILDFIRE), annotationAttributes);
                this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                
                this.updateAnnotation(lookout)

            };
            // Inherit Annotation parent methods
            CalloutAnnotation.prototype = Object.create(EnhancedAnnotation.prototype);

            CalloutAnnotation.prototype.updateAnnotation = function(lookout) {
                if (lookout && lookout.surfaceFire) {
                  var head = Number(lookout.surfaceFire.flameLength.value);
                  var flanks = Number(lookout.surfaceFire.flameLengthFlanking.value);
                  var heel = Number(lookout.surfaceFire.flameLengthBacking.value);
                  var dir = Math.round(lookout.surfaceFire.directionMaxSpread.value);
                  var ros = Math.round(lookout.surfaceFire.rateOfSpreadMax.value);
                  var modelNo = lookout.surfaceFire.fuelBed.fuelModel.modelCode;
                  var modelName = lookout.surfaceFire.fuelBed.fuelModel.modelName;
                  
                  head = Number.isNaN(head) ? '0' : Number(head).toFixed(head > 1 ? 0 : 1);
                  flanks = Number.isNaN(flanks) ? '0' : Number(flanks).toFixed(flanks > 1 ? 0 : 1);
                  heel = Number.isNaN(heel) ? '0' : Number(heel).toFixed(heel > 1 ? 0 : 1);
                  
                  this.text = "Fuel Model: " + modelNo + " - " + modelName +
                    "\nHead Fire: " + head + "'" +
                    "\nFlanking Fire: " + flanks + "'" +
                    "\nBacking Fire: " + heel + "'" +
                    "\nRate of Max Spread: " + ros + " fpm" +
                    "\nDirection of Max Spread: " + dir + " deg";
                } else {
                    this.text = "Standby..."
                }
              }

            return CalloutAnnotation;
        }
);

