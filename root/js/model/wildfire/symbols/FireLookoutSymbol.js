/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $, WorldWind */

define([
    'model/wildfire/symbols/Background',
    'model/wildfire/symbols/DirOfSpread',
    'model/wildfire/symbols/FireBehaviorCallout',
    'model/wildfire/symbols/FlameLengthHead',
    'model/util/Formatter',
    'model/wildfire/symbols/FuelModelNo',
    'model/wildfire/symbols/WildfireDiamond',
    'model/util/Log',
    'model/Constants',
    'model/Config',
    'model/Events',
    'worldwind'],
    function (
        Background,
        DirOfSpread,
        FireBehaviorCallout,
        FlameLengthHead,
        formatter,
        FuelModelNo,
        WildfireDiamond,
        logger,
        constants,
        config,
        events,
        ww) {
        "use strict";

        var FireBehaviorSymbol = function (lookout) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Maintain a reference to the fire lookout object this symbol represents
            this.lookout = lookout;

            var self = this,
                surfaceFire = lookout.surfaceFire,
                head = surfaceFire ? lookout.surfaceFire.flameLength.value : null,
                flanks = surfaceFire ? lookout.surfaceFire.flameLengthFlanking.value : null,
                heal = surfaceFire ? lookout.surfaceFire.flameLengthBacking.value : null,
                dir = surfaceFire ? lookout.surfaceFire.directionMaxSpread.value : null,
                ros = surfaceFire ? lookout.surfaceFire.rateOfSpreadMax.value : null,
                modelNo = surfaceFire ? lookout.surfaceFire.fuelBed.fuelModel.modelCode : '-',
                eyeDistanceScalingThreshold = 1000000;

            // Create the fire lookout symbol components
            this.background = new Background(lookout.latitude(), lookout.longitude(), eyeDistanceScalingThreshold);
            this.callout = new FireBehaviorCallout(lookout.latitude(), lookout.longitude(), lookout);
            this.diamond = new WildfireDiamond(lookout.latitude(), lookout.longitude(), Math.round(head), Math.round(flanks), Math.round(heal), eyeDistanceScalingThreshold);
            this.dirOfSpread = new DirOfSpread(lookout.latitude(), lookout.longitude(), Math.round(dir), eyeDistanceScalingThreshold);
            this.flameLengthHead = new FlameLengthHead(lookout.latitude(), lookout.longitude(), head || '-');
            this.fuelModelNo = new FuelModelNo(lookout.latitude(), lookout.longitude(), modelNo);

            if (config.fireLookoutLabels === constants.FIRE_LOOKOUT_LABEL_NAME) {
                this.diamond.label = lookout.name();
            }


            // Add a reference to our lookout object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.background.pickDelegate = lookout;
            this.callout.pickDelegate = lookout;
            this.diamond.pickDelegate = lookout;
            this.dirOfSpread.pickDelegate = lookout;
            this.flameLengthHead.pickDelegate = lookout;
            this.fuelModelNo.pickDelegate = lookout;

            // EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            this.handleObjectMovedEvent = function (lookout) {
                self.background.position.latitude = lookout.latitude();
                self.background.position.longitude = lookout.longitude();
                self.callout.position.latitude = lookout.latitude();
                self.callout.position.longitude = lookout.longitude();
                self.diamond.position.latitude = lookout.latitude();
                self.diamond.position.longitude = lookout.longitude();
                self.dirOfSpread.position.latitude = lookout.latitude();
                self.dirOfSpread.position.longitude = lookout.longitude();
                self.flameLengthHead.position.latitude = lookout.latitude();
                self.flameLengthHead.position.longitude = lookout.longitude();
                self.fuelModelNo.position.latitude = lookout.latitude();
                self.fuelModelNo.position.longitude = lookout.longitude();
            };
            // EVENT_FIRE_BEHAVIOR_CHANGED handler 
            this.handleFireBehaviorChangedEvent = function (lookout) {
                head = lookout.surfaceFire.flameLength.value;
                flanks = lookout.surfaceFire.flameLengthFlanking.value;
                heal = lookout.surfaceFire.flameLengthBacking.value;
                dir = lookout.surfaceFire.directionMaxSpread.value;
                ros = lookout.surfaceFire.rateOfSpreadMax.value;
                modelNo = lookout.surfaceFire.fuelBed.fuelModel.modelCode;

                this.callout.updateAnnotation(lookout);
                this.diamond.updateWildfireDiamondImage(head, flanks, heal);
                this.dirOfSpread.updateDirOfSpreadImage(head > 0 ? Math.round(dir) : null);
                if (head > 1) {
                    this.flameLengthHead.text = Math.round(head) + "'";
                } else {
                    this.flameLengthHead.text = (Math.round(head * 10) / 10) + "'";
                }
                this.fuelModelNo.text = modelNo;
                
                this.lookout.globe.redraw();
            };
            // EVENT_PLACE_CHANGED handler
            this.handlePlaceChangedEvent = function (lookout) {
                if (config.fireLookoutLabels === constants.FIRE_LOOKOUT_LABEL_PLACE) {
                    // Display the place name
                    self.diamond.label = lookout.toponym() || null;
                } else if (config.fireLookoutLabels === constants.FIRE_LOOKOUT_LABEL_LATLON) {
                    // Display "Lat Lon"
                    self.diamond.label = lookout.latitude().toFixed(3) + ' ' + lookout.longitude().toFixed(3);
                }
            };

            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            lookout.on(events.EVENT_FIRE_BEHAVIOR_CHANGED, this.handleFireBehaviorChangedEvent, this);
            lookout.on(events.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            lookout.on(events.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);

        };
        // Inherit Renderable functions.
        FireBehaviorSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this symbol. 
         * @param {DrawContext} dc The current draw context.
         */
        FireBehaviorSymbol.prototype.render = function (dc) {

            // Enable the background/border when selected/highlighted
            this.background.enabled = this.highlighted;

            // The callout rendering is conditional
            this.callout.enabled = this.lookout.showCallout;

            // Rotate and dir of spread arrot to match the view
            this.dirOfSpread.imageRotation = -dc.navigator.heading;

            this.background.render(dc);
            this.callout.render(dc);
            this.diamond.render(dc);
            this.dirOfSpread.render(dc);
            this.flameLengthHead.render(dc);
            this.fuelModelNo.render(dc);
        };

        return FireBehaviorSymbol;
    }
);
