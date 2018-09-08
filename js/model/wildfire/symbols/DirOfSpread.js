/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, WorldWind*/

define([
    'model/globe/EnhancedPlacemark',
    'model/util/WmtUtil',
    'model/Constants',
    'worldwind'],
    function (
        EnhancedPlacemark,
        util,
        constants,
        ww) {
        "use strict";

        /**
         * @constructor
         * @param {type} latitude
         * @param {type} longitude
         * @param {type} dirOfSpread
         * @param {type} eyeDistanceScaling
         * @returns {DirOfSpread}
         */
        var DirOfSpread = function (latitude, longitude, dirOfSpread, eyeDistanceScaling) {

            EnhancedPlacemark.call(this, new WorldWind.Position(latitude, longitude, constants.MAP_SYMBOL_ALTITUDE_WILDFIRE), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = true;
            this.attributes.imageScale = 0.2;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Width centered
                WorldWind.OFFSET_FRACTION, 0.5);// Height centered
            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);

            this.imageRotation = 0;
            this.imageTilt = 0;

            this.updateDirOfSpreadImage(dirOfSpread);
        };
        // Inherit the Placemark methods (Note: calls the Placemark constructor a 2nd time).
        DirOfSpread.prototype = Object.create(EnhancedPlacemark.prototype);

        /**
         * 
         * @param {type} dirOfSpread
         * @returns {undefined}
         */
        DirOfSpread.prototype.updateDirOfSpreadImage = function (dirOfSpread) {
            var img = new Image(),
                self = this;

            if (dirOfSpread === null) {
                this.enabled = false;
                return;
            }

            // Draw the image in the canvas after loading
            img.onload = function () {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    size = Math.max(img.width, img.height) * 2,
                    center = size / 2,
                    ccwRadians = (-dirOfSpread) * (Math.PI / 180);

                // Create a square canvase
                canvas.width = size;
                canvas.height = size;

                // Rotate about the center
                self.rotateAbout(context, ccwRadians, center, center);
                context.drawImage(img, center / 2, 0);

                // Assign the loaded image to the placemark
                self.attributes.imageSource = new WorldWind.ImageSource(canvas);
                self.highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
            };
            // Set the image -- which fires the onload event
            img.src = constants.IMAGE_PATH + 'fire/dir-of-spread.png';

            this.enabled = true;
        };

        /**
         * Rotates theta radians counterclockwise around the point (x,y). This can also be accomplished with a 
         * translate,rotate,translate sequence.
         * Copied from the book "JavaScript: The Definitive Reference"
         * @param {Context} c
         * @param {Number} theta Radians
         * @param {Number} x
         * @param {Number} y
         */
        DirOfSpread.prototype.rotateAbout = function (c, theta, x, y) {
            var ct = Math.cos(theta), st = Math.sin(theta);
            c.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
        };

        return DirOfSpread;
    }
);

