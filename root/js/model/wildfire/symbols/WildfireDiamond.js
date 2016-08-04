/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, WorldWind*/

define([
    'wmt/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        var WildfireDiamond = function (latitude, longitude, head, flanks, heal, eyeDistanceScaling) {
            WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, wmt.MAP_SYMBOL_ALTITUDE_WILDFIRE), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = false;
            this.attributes.imageScale = 0.3;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            this.attributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Centered
                WorldWind.OFFSET_FRACTION, 2.2);    // Below RH
            this.attributes.drawLeaderLine = true;
            this.attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
            this.attributes.leaderLineAttributes.outlineWidth = 3;
            this.attributes.labelAttributes.color = WorldWind.Color.WHITE;
            this.attributes.labelAttributes.depthTest = false;
            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);
            //this.highlightAttributes.imageScale = placemarkAttr.imageScale * 1.2;
            //this.eyeDistanceScalingThreshold = 2500000;

            this.updateWildfireDiamondImage(head, flanks, heal);

        };
        // Inherit Placemark parent methods
        WildfireDiamond.prototype = Object.create(WorldWind.Placemark.prototype);


        WildfireDiamond.prototype.updateWildfireDiamondImage = function (head, flanks, heal) {
            var imgName = 'unkn';

            // if burnable
            if (!isNaN(head)) {
                imgName = WildfireDiamond.getColorCode(head)
                    + WildfireDiamond.getColorCode(flanks)
                    + WildfireDiamond.getColorCode(flanks)
                    + WildfireDiamond.getColorCode(heal);
            }

            this.attributes.imageSource = wmt.IMAGE_PATH + 'fire/' + imgName + '.png';
            this.highlightAttributes.imageSource = this.attributes.imageSource;
        };

        WildfireDiamond.getColorCode = function (flameLen) {
            if (flameLen >= 15) {
                return 'f'; // RED
            }
            if (flameLen >= 7) {
                return '7'; // MAGENTA
            }
            if (flameLen >= 3) {
                return '3'; // ORANGE
            }
            if (flameLen >= 1) {
                return '1'; // GREEN
            }
            return '0';     // BLUE
        };

        return WildfireDiamond;
    }
);

