/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, WorldWind*/

define([
    'model/globe/EnhancedGeographicText',    
    'model/Constants',
    'worldwind'],
    function (
        EnhancedGeographicText,
        constants,
        ww) {
        "use strict";

        /**
         * Creates a GeographicText component used to display the fuel model number in Fire Behavior Symbol.
         * @param {Number} latitude
         * @param {Number} longitude
         * @param {String} modelNo
         * @returns {FuelModelNo}
         */
        var FuelModelNo = function (latitude, longitude, modelNo) {
            EnhancedGeographicText.call(this, new WorldWind.Position(latitude, longitude, constants.MAP_SYMBOL_ALTITUDE_WILDFIRE), modelNo, true);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            this.alwaysOnTop = false;
            this.attributes = new WorldWind.TextAttributes(null);
            this.attributes.scale = 1.0;
            this.attributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,    // Center
                WorldWind.OFFSET_FRACTION, 0.5);   // Lower
            this.attributes.color = WorldWind.Color.WHITE;
            this.attributes.depthTest = false;
        };
        // Inherit Placemark parent methods
        FuelModelNo.prototype = Object.create(EnhancedGeographicText.prototype);

        /**
         * Creates a clone of this object.
         * @returns {FuelModelNo}
         */
        FuelModelNo.prototype.clone = function () {
            var clone = new FuelModelNo(this.position.latitude, this.position.longitude, this.text);
            clone.copy(this);
            clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;
            clone.attributes = new WorldWind.TextAttributes(this.attributes);
            return clone;
        };


        return FuelModelNo;
    }
);

