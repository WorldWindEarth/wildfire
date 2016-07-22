/* 
 * The MIT License.
 * Copyright (c) 2015, 2016 Bruce Schubert.
 */

/*global define*/

/**
 * The WeatherScout module.
 * 
 * @param {ContextSensitive} constextSensitive Adds context menu capability.
 * @param {Openable} openable Adds open capability.
 * @param {Log} log Logger.
 * @param {Messenger} messenger UI notifications.
 * @param {Movable} movable Adds move capabilities.
 * @param {PlaceResource} PlaceResource Gets place names.
 * @param {Removable} removable Adds remove capability.
 * @param {WeatherResource} WeatherResource Gets weather forecasts.
 * @param {WmtUtil} util Utilities.
 * @param {Wmt} wmt Constants.
 * @returns {WeatherScout}
 * 
 * @author Bruce Schubert
 */
define([
    'model/util/ContextSensitive',
    'model/util/Openable',
    'model/util/Log',
    'model/util/Messenger',
    'model/util/Movable',
    'model/services/PlaceService',
    'model/util/Removable',
    'model/resource/WeatherResource',
    'model/view/WeatherScoutViewer',
    'model/util/WmtUtil',
    'model/Wmt'],
    function (
        contextSensitive,
        openable,
        log,
        messenger,
        movable,
        PlaceResource,
        removable,
        WeatherResource,
        weatherScoutViewer,
        util,
        wmt) {
        "use strict";

        var WeatherScout = function (params) {
            var arg = params || {},
                self = this;
            
            // Make movable by the SelectController: Fires the EVENT_OBJECT_MOVE... events.
            movable.makeMovable(this);

            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                weatherScoutViewer.show(self);
                return true; // return true to fire EVENT_OBJECT_OPENED event.
            });
            
            // Make deletable via menu: Fires the EVENT_OBJECT_REMOVED event on success.
            removable.makeRemovable(this, function () {
                // TODO: Ask for confirmation; return false if veto'd
                return true;    // return true to fire a notification that allows the delete to proceed.
            });
            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSenstive(this, function () {
                messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");
            });

            /**
             * The unique id used to identify this particular weather object
             */
            this.id = arg.id || util.guid();
            /**
             * The display name
             */
            this.name = arg.name || 'Wx Scout';
            this.duration = arg.duration || wmt.configuration.wxForecastDurationHours;
            this.latitude = arg.latitude;
            this.longitude = arg.longitude;
            this.isMovable = arg.isMovable === undefined ? true : arg.isMovable;

            this.rules = [];

            // Self subscribe to move operations so we can update the forecast and place
            // when the move is finished. We don't want to update during the move itself.
            this.on(wmt.EVENT_OBJECT_MOVE_FINISHED, this.refresh);

        };

        /**
         * Invalid Weather object
         */
        WeatherScout.INVALID_WX = {
            time: new Date(0),
            airTemperatureF: Number.NaN,
            relaltiveHumidityPct: Number.NaN,
            windSpeedKts: Number.NaN,
            windDirectionDeg: Number.NaN,
            skyCoverPct: Number.NaN
        };

        /**
         * Gets the earlies forecast entry.
         * @returns {Object} A fire weather object 
         *  {
         *      time: Date,
         *      airTemperatureF: Number,
         *      relaltiveHumidityPct: Number,
         *      windSpeedKts: Number, 
         *      windDirectionDeg: Number,
         *      skyCoverPct: Number
         *  }
         */
        WeatherScout.prototype.getFirstForecast = function () {
            return this.getForecastAtTime(null);
        };

        /**
         * Returns the forecast nearest the given time.
         * @param {Date} time The date/time used to select the forecast. If null, the first forecast is returned.
         * @returns {Object} Fire weather forecast. Example:
         *   {
         *       time: Date,
         *       airTemperatureF: Number,
         *       relaltiveHumidityPct: Number,
         *       windSpeedKts: Number,
         *       windDirectionDeg: Number,
         *       skyCoverPct: Number
         *   }
         */
        WeatherScout.prototype.getForecastAtTime = function (time) {
            if (!this.temporalWx || this.temporalWx.length === 0) {
                log.warning('WeatherScout', 'getForecastAtTime', 'missingWeatherData');
                return WeatherScout.INVALID_WX;
            }
            var wxTime,
                wxTimeNext,
                minutesSpan,
                minutesElapsed,
                forecast,
                i, max;

            // Use the earliest forecast if time arg is not provided
            if (!time) {
                forecast = this.temporalWx[0];
            }
            else {
                for (i = 0, max = this.temporalWx.length; i < max; i++) {
                    wxTime = this.temporalWx[i].time;
                    if (time.getTime() < wxTime.getTime()) {    // compare millisecs from epoch
                        break;
                    }
                    if (i === max - 1) {
                        // This is the last wx entry. Use it!
                        break;
                    }
                    // Take a peek at the next entry's time 
                    wxTimeNext = this.temporalWx[i + 1].time;
                    minutesSpan = util.minutesBetween(wxTime, wxTimeNext);
                    minutesElapsed = util.minutesBetween(wxTime, time);
                    if (minutesElapsed < (minutesSpan / 2)) {
                        break;
                    }
                }
                forecast = this.temporalWx[i];
            }
            return {
                time: new Date(forecast.time),
                airTemperatureF: parseInt(forecast.values[0], 10),
                relaltiveHumidityPct: parseInt(forecast.values[1], 10),
                windSpeedKts: parseInt(forecast.values[2], 10),
                windDirectionDeg: parseInt(forecast.values[3], 10),
                skyCoverPct: parseInt(forecast.values[4], 10)
            };
        };
        /**
         * Returns all the forecasts in an array.
         * @returns {Array} Example:
         *   [{
         *       time: Date,
         *       airTemperatureF: Number,
         *       relaltiveHumidityPct: Number,
         *       windSpeedKts: Number,
         *       windDirectionDeg: Number,
         *       skyCoverPct: Number
         *   }]
         */
        WeatherScout.prototype.getForecasts = function () {
            var array = [],
                forecast,
                i, max;
            
            if (!this.temporalWx) {
                log.error('WeatherScout', 'getForecasts', 'missingWeatherData');
                return array;
            }

            for (i = 0, max = this.temporalWx.length; i < max; i++) {
                forecast = this.temporalWx[i];
                array.push({
                    time: new Date(forecast.time),
                    airTemperatureF: parseInt(forecast.values[0], 10),
                    relaltiveHumidityPct: parseInt(forecast.values[1], 10),
                    windSpeedKts: parseInt(forecast.values[2], 10),
                    windDirectionDeg: parseInt(forecast.values[3], 10),
                    skyCoverPct: parseInt(forecast.values[4], 10)
                });
            }
            return array;
        };

        /**
         * Updates the weather lookout's weather forecast and location. 
         */
        WeatherScout.prototype.refresh = function () {
            this.refreshForecast();
            this.refreshPlace();
        };

        /**
         * Updates this object's weather attribute. 
         */
        WeatherScout.prototype.refreshForecast = function (deferred) {
            if (!this.latitude || !this.longitude || !this.duration) {
                return;
            }
            var self = this;

            // Get the weather forecast at this location
            WeatherResource.pointForecast(
                this.latitude,
                this.longitude,
                this.duration,
                function (json) { // Callback to process JSON result
                    self.processForecast(json);
                    log.info('WeatherScout', 'refreshForecast', self.name + ': EVENT_WEATHER_CHANGED');
                    self.fire(wmt.EVENT_WEATHER_CHANGED, self);
                    if (deferred) {
                        deferred.resolve(self);
                    }
                }
            );
        };

        /**
         * Updates this object's place attributes. 
         */
        WeatherScout.prototype.refreshPlace = function (deferred) {
            
            if (!this.latitude || !this.longitude) {
                return;
            }
            var self = this,
                i, max, item, place = [], 
                placename = '';

            // Get the place name(s) at this location
            PlaceResource.places(
                this.latitude,
                this.longitude,
                function (json) { // Callback to process YQL Geo.Places result

                    // Load all the places into a place object array
                    if (!json.query.results) {
                        log.error("WeatherScout", "refreshPlace", "json.query.results is null");
                        return;
                    }
                    if (json.query.count === 1) {
                        item = json.query.results.place;
                        place[0] = {"name": item.name, "type": item.placeTypeName.content};
                    } else {
                        for (i = 0, max = json.query.results.place.length; i < max; i++) {
                            item = json.query.results.place[i];
                            place[i] = {"name": item.name, "type": item.placeTypeName.content};
                        }
                    }
                    self.place = place; // Saving the place results for testing... not currently used

                    // Find the first place name (they're ordered by granularity) that's not a zip code
                    for (i = 0, max = place.length; i < max; i++) {
                        if (place[i].type !== "Zip Code") {
                            placename = place[i].name;
                            break;
                        }
                    }
                    // Update the placename property: toponym
                    self.toponym = placename;
                    
                    log.info('WeatherScout', 'refreshPlace', self.name + ': EVENT_PLACE_CHANGED');
                    self.fire(wmt.EVENT_PLACE_CHANGED, self);
                    if (deferred) {
                        deferred.resolve(self);
                    }
                }
            );
        };

        /**
         * 
         * @param {type} json
         */
        WeatherScout.prototype.processForecast = function (json) {
            //Log.info('WeatherScout', 'processForecast', JSON.stringify(json));

            var isoTime, i, max;

            this.wxForecast = json;
            this.temporalWx = this.wxForecast.spatioTemporalWeather.spatialDomain.temporalDomain.temporalWeather;
            this.range = this.wxForecast.spatioTemporalWeather.range;

            // Add a Date object to each temporal entry
            for (i = 0, max = this.temporalWx.length; i < max; i++) {
                // .@time doesn't work because of the '@', so we use ['@time']
                isoTime = this.temporalWx[i]['@time'];
                this.temporalWx[i].time = new Date(isoTime);
            }
        };

        return WeatherScout;

    }

);

