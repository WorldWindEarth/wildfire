/*
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
define([], function () {
    "use strict";
    var Constants = {
        BUTTON_TEXT_CANCEL: 'Cancel',
        BUTTON_TEXT_DELETE: 'Delete',
        BUTTON_TEXT_GOTO: 'Go To',
        BUTTON_TEXT_NO: 'No',
        BUTTON_TEXT_OK: 'OK',
        BUTTON_TEXT_SAVE: 'Save',
        BUTTON_TEXT_YES: 'Yes',
        FIRE_LOOKOUT_LABEL_LATLON: "fireLookoutLabelLatLon",
        FIRE_LOOKOUT_LABEL_NAME: "fireLookoutLabelName",
        FIRE_LOOKOUT_LABEL_NONE: "fireLookoutLabelNone",
        FIRE_LOOKOUT_LABEL_PLACE: "fireLookoutLabelPlace",
        /**
         * The URL for the fuel models REST service.
         */
//        FUELMODELS_REST_SERVICE: "http://emxsys.azurewebsites.net/wmt-rest/rs/fuelmodels",
        FUELMODELS_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/fuelmodels",
        /**
         * The URL for the fuel models REST service.
         */
//        FUELMOISTURE_REST_SERVICE: "http://emxsys.azurewebsites.net/wmt-rest/rs/fuelmoisture",
        FUELMOISTURE_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/fuelmoisture",
        /**
         * The URL for the GeoMAC MapServer REST service.
         */
        GEOMAC_REST_SERVICE: "http://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_fires/MapServer",
        GEOMETRY_POINT: 'point',
        GEOMETRY_POLYGON: 'polygon',
        GEOMETRY_POLYLINE: 'polyline',
        GEOMETRY_UNKNOWN: 'unknown',
        /**
         * Base URL for WMT application images. (Do not use a relative path.)
         */
        IMAGE_PATH: "js/model/images/",
        /**
         * The URL for the LANDFIRE MapServer REST service.
         * LANDFIRE 2012 (LF 2012 - LF_1.3.0) 
         */
        LANDFIRE_REST_SERVICE: "http://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_130/MapServer",        
        /**
         * Layer categories
         */
        LAYER_CATEGORY_BACKGROUND: "Background",
        LAYER_CATEGORY_BASE: "Base",
        LAYER_CATEGORY_DATA: "Data",
        LAYER_CATEGORY_EFFECT: "Effect",
        LAYER_CATEGORY_OVERLAY: "Overlay",
        LAYER_CATEGORY_WIDGET: "Widget",
        /**
         * The display name for the layer that displays markers.
         */
        LAYER_NAME_COMPASS: "Compass",
        LAYER_NAME_FIRE_LOOKOUTS: "Fire Lookouts",
        LAYER_NAME_MARKERS: "Markers",
        LAYER_NAME_RETICLE: "Crosshairs",
        LAYER_NAME_SKY: "Sky",
        LAYER_NAME_TIME_ZONES: "Time Zones",
        LAYER_NAME_VIEW_CONTROLS: "Controls",
        LAYER_NAME_WEATHER: "Weather Scouts",
        LAYER_NAME_WIDGETS: "Widgets",
        /**
        * The display name for the layer that displays fire perimeters and related data.
        */
        LAYER_NAME_WILDLAND_FIRES: "Active Fires",
        LAYER_NAME_WILDLAND_FIRE_PERIMETERS: "Active Fire Permimeters",
        MAP_SYMBOL_ALTITUDE_WEATHER: 500,
        MAP_SYMBOL_ALTITUDE_WILDFIRE: 250,       
        MARKER_LABEL_LATLON: "markerLabelLatLon",
        MARKER_LABEL_NAME: "markerLabelName",
        MARKER_LABEL_NONE: "markerLabelNone",
        MARKER_LABEL_PLACE: "markerLabelPlace",
        /**
         * The maximum range that the globe can be zoomed out to.
         * @default 20,000,000 meters.
         */
        NAVIGATOR_MAX_RANGE: 20000000,
        PROJECTION_NAME_3D: "3D",
        PROJECTION_NAME_EQ_RECT: "Equirectangular",
        PROJECTION_NAME_MERCATOR: "Mercator",
        PROJECTION_NAME_NORTH_POLAR: "North Polar",
        PROJECTION_NAME_SOUTH_POLAR: "South Polar",
        PROJECTION_NAME_NORTH_UPS: "North UPS",
        PROJECTION_NAME_SOUTH_UPS: "South UPS",
        PROJECTION_NAME_NORTH_GNOMONIC: "North Gnomic",
        PROJECTION_NAME_SOUTH_GNOMONIC: "South Gnomic",
        /**
         * The local storage key for fire lookouts.
         */
        STORAGE_KEY_FIRE_LOOKOUTS: "firelookouts",
        /**
         * The local storage key for markers.
         */
        STORAGE_KEY_MARKERS: "markers",
        /**
         * The local storage key for weather scouts.
         */
        STORAGE_KEY_WEATHER_SCOUTS: "wxscouts",
        /**
         * The URL for the sunlight REST service.
         */
        SUNLIGHT_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/sunlight",
        /**
         * The URL for the surface fuel REST service.
         */
        SURFACEFUEL_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/surfacefuel",
        /**
         * The URL for the surface fire REST service.
         */
        SURFACEFIRE_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/surfacefire",
        /**
         * The URL for the terrain REST service.
         */
        TERRAIN_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/terrain",
        /**
         * The URL for the weather REST service.
         */        
         /**
         * The URL for the weather REST service.
         */
        WEATHER_REST_SERVICE: "http://rhombus.emxsys.net/wmt-rest/rs/weather",
        WEATHER_SCOUT_LABEL_LATLON: "weatherScoutLabelLatLon",
        WEATHER_SCOUT_LABEL_NAME: "weatherScoutLabelName",
        WEATHER_SCOUT_LABEL_NONE: "weatherScoutLabelNone",
        WEATHER_SCOUT_LABEL_PLACE: "weatherScoutLabelPlace",
        WILDLAND_FIRE_POINT: "point",
        WILDLAND_FIRE_PERIMETER: "perimeter",
         /**
         * Base URL for Web World Wind SDK. (Do not use a relative path.)
         * @default "js/libs/webworldwind/"
         * @constant
         */
        WORLD_WIND_PATH: "js/libs/webworldwind/"
    };

    return Constants;
});
