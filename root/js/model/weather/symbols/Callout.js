/* 
 * The MIT License.
 * Copyright (c) 2015, 2016 Bruce Schubert
 */


/*global define, WorldWind*/

define(['model/Constants', 'model/globe/EnhancedAnnotation', 'worldwind'],
        function (constants, EnhancedAnnotation, ww) {
            "use strict";

            var CalloutAnnotation = function (latitude, longitude, wx) {

                // Set default annotation attributes.
                var annotationAttributes = new WorldWind.AnnotationAttributes(null);
                annotationAttributes.cornerRadius = 14;
                annotationAttributes.backgroundColor = WorldWind.Color.BLUE;
                annotationAttributes.drawLeader = true;
                annotationAttributes.leaderGapWidth = 10;
                annotationAttributes.leaderGapHeight = 50;
                annotationAttributes.opacity = 1;
                annotationAttributes.scale = 1;
                annotationAttributes.width = 0; // auto-resize - no constraint
                annotationAttributes.height = 0; // auto-resize - no constraint
                annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
                annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);
        
                EnhancedAnnotation.call(this, new WorldWind.Position(latitude, longitude, constants.MAP_SYMBOL_ALTITUDE_WEATHER), annotationAttributes);
                this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                
                //this.updateAnnotation(wx)

            };
            // Inherit Annotation parent methods
            CalloutAnnotation.prototype = Object.create(EnhancedAnnotation.prototype);

            CalloutAnnotation.prototype.updateAnnotation = function(wx, timeOptions) {
                if (wx ) {
                    var skyCover = wx.skyCoverPct;
                    var windDir = wx.windDirectionDeg;
                    var windSpd = wx.windSpeedKts;
                    var airTempF =  wx.airTemperatureF;
                    var relHumidity = wx.relaltiveHumidityPct;
                    var forecastTime;
                    if (wx.time.getTime() === 0) { // See: WeatherScout.INVALID_WX.time
                        forecastTime = '-'; // empty labels not allowed
                    } else {
                        forecastTime = '@ ' + wx.time.toLocaleTimeString('en', timeOptions) +
                          " on " + wx.time.toLocaleDateString()
                    }
                    
                  this.text = "Wx Forecast " + forecastTime +
                    "\nWind Speed: " + windSpd + " knots" +
                    "\nWind From: " + windDir + " deg" +
                    "\nAir Temp: " + airTempF + " F" +
                    "\nRel Humitity: " + relHumidity + "%" +
                    "\nCloud Cover: " + skyCover + "%";
                } else {
                    this.text = "Standby...";
                }
              };

            return CalloutAnnotation;
        }
);

