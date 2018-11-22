/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * https://www.opensource.org/licenses/mit-license
 */

/*global require, requirejs, WorldWind */

/**
 * Set DEBUG true to use debug versions of the libraries; 
 * set false to use minified versions for production.
 * @type Boolean
 */
window.DEBUG = false;

/**
 * Defined the RequreJS configuration
 */
requirejs.config({
    // Path mappings for the logical module names
    paths: {
        // Bootstrap responsive layout
        'bootstrap': window.DEBUG ? 'libs/bootstrap/v3.3.6/bootstrap.min' : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
        // d3 graphics library
        'd3': window.DEBUG ? 'libs/d3/d3' : 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min',
        // RequireJS plugin to wait for DOM ready
        'domReady': 'libs/require/domReady',
        // Dragula drag-n-drop library
        'dragula': 'libs/dragula/dragula',
        // Knockout Model-View-View Model
        'knockout': window.DEBUG ? 'libs/knockout/knockout-3.4.0.debug' : 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min',
        // RequireJS plugin to load 'i18n!' prefixed modules
        'i18n': 'libs/require/i18n',
        // The ubuiqutious JQuery library
        'jquery': window.DEBUG ? 'libs/jquery/jquery-2.1.3' : 'https://code.jquery.com/jquery-2.2.4.min',
        // JQuery UI elements
        'jqueryui': window.DEBUG ? 'libs/jquery-ui/jquery-ui-1.11.4' : 'https://code.jquery.com/ui/1.12.1/jquery-ui.min',
        // JQuery FancyTree component
        'jquery-fancytree': window.DEBUG ? 'libs/jquery.fancytree/jquery.fancytree-all.min' : 'https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.19.0/jquery.fancytree-all.min',
        // JQuery UI based 'growl' messaging
        'jquery-growl': 'libs/jquery-plugins/growl/jquery.growl',
        // JQuery UI touch event support
        'jquery-touch': 'libs/jquery-plugins/touch-punch/jquery.ui.touch-punch.min',
        // MomentJS date/time library
        'milsymbol': 'libs/milsymbol/1.3.3/milsymbol',
        // MomentJS date/time library
        'moment': window.DEBUG ? 'libs/moment/moment-2.14.1.min' : 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min',
        // PaceJS progress bar library
        'pace': 'libs/pace/pace.min',
        // URL search param parsing
        'url-search-params': 'libs/url-search-params/url-search-params.max.amd',
        // RequireJS plugin to load text/html files using the 'text!' prefixed modules
        'text': 'libs/require/text',
        // VisJS charting library
        'vis': window.DEBUG ? 'libs/vis/v4.16.1/vis' : 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min',
        // Emxsys WorldWindJS
        'worldwind': window.DEBUG ? 'https://unpkg.com/worldwindjs@1.6.90/build/dist/worldwind' : 'https://unpkg.com/worldwindjs@1.6.90/build/dist/worldwind.min'
    },
    // Increase the time to wait before giving up on loading a script to avoid timeout erros on slow 3G connections (default 7s)
    waitSeconds: 15,
    // Shim configuration for Bootstrap's JQuery dependency
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$.fn.popover"
        }
    }
});

/**
 * Override the RequireJS error handling to provide some user feedback.
 * @param {Object} err
 */
requirejs.onError = function (err) {
    if (err.requireType === 'timeout') {
        alert("A timeout occurred while loading scripts.\n\
The server may be busy or you have a slow connection.\n\
Try refreshing the page or try again later.\n\n" + err);
    } else {
        alert("An error occurred. \n\n" + err + "\n\n\
Try refreshing the page or report the error at \n\
https://github.com/WorldWindEarth/wildfire/issues");      
        throw err;
    }
};

/**
 * The application's main entry point, called by RequireJS in index.html.
 * The callback function gets executed after all modules defined in the array 
 * are loaded and after the DOM is ready (via domReady with "!").
 * 
 * @param {Config} config Explorer configuration
 * @param {Constants} constants Explorer constants
 * @param {Pace} pace 
 * @param {JQuery} $
 */
require([
    'WorldWindFixes',
    'model/Config',
    'model/Constants',
    'pace',
    'jquery',
    'domReady!', // The value for domReady! is the current document
    'worldwind'],
    function (fixes, config, constants, pace, $) {
        "use strict";

        // Start a  progress counter
        pace.start({
            // Only show the progress on initial load, not on every request.
            // See: https://github.com/HubSpot/pace/blob/master/pace.coffee
            restartOnRequestAfter: false,
            restartOnPushState: false
        });


        // -----------------------------------------------------------
        // Add handlers for UI elements
        // -----------------------------------------------------------
        // Auto-collapse navbar when its tab items are clicked
        $('.navbar-collapse a[role="tab"]').click(function () {
            $('.navbar-collapse').collapse('hide');
        });
        // Auto-scroll-into-view expanded dropdown menus
        $('.dropdown').on('shown.bs.dropdown', function (event) {
            event.target.scrollIntoView(false); // align to bottom
        });
        // Auto-expand menu section-bodies when not small
        $(window).resize(function () {
            if ($(window).width() >= 768) {
                $('.section-body').collapse('show');
            }
        });

        // ----------------
        // Setup WorldWind
        // ----------------
        fixes.applyLibraryFixes();
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Specifiy the location of the WorldWind resoures, i.e., the "images" folder 
        WorldWind.configuration.baseUrl = "https://unpkg.com/worldwindjs@1.6.90/build/dist/";

        // Enter your Bing Bing Maps key to use when requesting Bing Maps resources.
        // See: https://www.bingmapsportal.com/ to register for your own key and then enter it below
        WorldWind.BingMapsKey = "Ap6BL_3VPzCeoojebk2R9y_mYoMYKyPEPOzz9ZTmSzXBcEzdxFsfgJtAaeH9jOlJ";
        
        // Initialize the WorldWindow virtual globe with the specified HTML5 canvas
        var wwd = new WorldWind.WorldWindow("globe-canvas");
        fixes.applyWorldWindowFixes(wwd);
        
        // Provide an initial location to view
        wwd.navigator.lookAtLocation.latitude = config.startupLatitude;
        wwd.navigator.lookAtLocation.longitude = config.startupLongitude;
        wwd.navigator.range = config.startupAltitude;
        // Add initial background layer(s) to display during startup
        wwd.addLayer(new WorldWind.BMNGOneImageLayer());

        // ------------------
        // Setup the Explorer
        // ------------------

        // Load the Explorer and its dependencies asynchronously while the 
        // WorldWind globe is loading its background layer(s).
        require(['Explorer'], function (Explorer) {

            // Initialize the Explorer with a WorldWind virtual globe to "explore"
            var explorer = new Explorer(wwd);
            // Now that the MVVM is set up, restore the model from the previous session.
            explorer.restoreSession();

            // Add event handler to save the session when the window closes
            window.onbeforeunload = function () {
                explorer.saveSession();
                // Return null to close quietly on Chrome and FireFox.
                return null;
            };

            pace.stop();

        });
    });





