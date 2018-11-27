/* 
 * The MIT License.
 * Copyright (c) 2015, 2016 Bruce Schubert
 */


/*global define, WorldWind*/

define(['model/Constants', 'model/globe/EnhancedAnnotation', 'model/util/Formatter', 'moment', 'worldwind'],
        function (constants, EnhancedAnnotation, formatter, moment, ww) {
            "use strict";

            var FireBehaviorCallout = function (latitude, longitude, lookout) {

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
            FireBehaviorCallout.prototype = Object.create(EnhancedAnnotation.prototype);

            FireBehaviorCallout.prototype.updateAnnotation = function(lookout) {
                if (lookout && lookout.surfaceFire) {
                  var head = Number(lookout.surfaceFire.flameLength.value);
                  var flanks = Number(lookout.surfaceFire.flameLengthFlanking.value);
                  var heel = Number(lookout.surfaceFire.flameLengthBacking.value);
                  var dir = Number(lookout.surfaceFire.directionMaxSpread.value);
                  var ros = Number(lookout.surfaceFire.rateOfSpreadMax.value);
                  var modelNo = lookout.surfaceFire.fuelBed.fuelModel.modelCode;
                  var modelName = lookout.surfaceFire.fuelBed.fuelModel.modelName;
                  var dateTime = moment(lookout.sunlight.dateTime);
                  var windDir = Number(lookout.activeWeather.windDirectionDeg);
                  var windSpd = Number(lookout.activeWeather.windSpeedKts);   
                  var aspect = formatter.formatAngle360(lookout.terrain.aspect, 0);
                  var slope = formatter.formatPercentSlope(lookout.terrain.slope, 0);   
                  ros = Number.isNaN(ros) ? '-' : ros.toFixed(0);
                  dir = Number.isNaN(dir) ? '-' : dir.toFixed(0);
                  
                  
                  this.text = "Potential Fire Behavior @ " + (dateTime.isValid() ? dateTime.format("llll") : "?") +
                    "\nWinds from " + windDir + "° at " + windSpd + " knots" +
                    "\nSlope aspect is " + aspect + " at " + slope +
                    "\nFuel Model: " + modelNo + " - " + modelName +
                    "\nHead Fire: " + FireBehaviorCallout.formatFlameLength(head) +
                    "\nFlanking Fire: " + FireBehaviorCallout.formatFlameLength(flanks) +
                    "\nBacking Fire: " + FireBehaviorCallout.formatFlameLength(heel) +
                    "\nRate of Max Spread: " + ros + " fpm" +
                    "\nDirection of Max Spread: " + dir + "°";
                } else {
                    this.text = "Standby...";
                }
            };
            
            FireBehaviorCallout.formatFlameLength = function(flameLen) {
                if (Number.isNaN(flameLen)) {
                    return "NA"
                } else {
                    var len = Number(flameLen).toFixed(flameLen > 1 ? 0 : 1);
                    return len + "' - " + (len <= 1 ? "LOW" : len <= 3 ? "MODERATE" : len <= 7 ? "ACTIVE" : len <= 15 ? "VERY ACTIVE" : "EXTREME");
                }
            };
            
            return FireBehaviorCallout;
        }
);

