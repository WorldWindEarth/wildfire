/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/*global define, WorldWind, $ */

/**
 * The USFS Topo overlay.
 * 
 * See: https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_FSTopo_01/MapServer
 * 
 * @returns {UsfsTopoMapLayer}
 */
define([
    'jquery',
    'worldwind'],
    function () {
    "use strict";
    /**
     * Constructs a USFS Topo map overlay layter.
     * @constructor
     * @augments Layer
     */
    var UsfsTopoMapLayer = function () {
        WorldWind.Layer.call(this, "USFS Topo");
        
        // Web Map Tiling Service information from
        var serviceAddress = "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_FSTopo_01/MapServer/WMTS/1.0.0/WMTSCapabilities.xml";
        var layerIdentifier = "EDW_EDW_FSTopo_01";
        var self = this;

        // Called asynchronously to parse and create the WMTS layer
        var createLayer = function (xmlDom) {
            // Create a WmtsCapabilities object from the XML DOM
            var wmtsCapabilities = new WorldWind.WmtsCapabilities(xmlDom);
            // Retrieve a WmtsLayerCapabilities object by the desired layer name
            var wmtsLayerCapabilities = wmtsCapabilities.getLayer(layerIdentifier);
            // Form a configuration object from the WmtsLayerCapabilities object
            var wmtsConfig = WorldWind.WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
            // Create the WMTS Layer from the configuration object
            self.wmtsLayer = new WorldWind.WmtsLayer(wmtsConfig);
        };

        // Called if an error occurs during WMTS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);
    };
    UsfsTopoMapLayer.prototype = Object.create(WorldWind.Layer.prototype);
 
    /**
     * Refreshes the data associated with this layer. The behavior of this function varies with the layer
     * type. For image layers, it causes the images to be re-retrieved from their origin.
     */
    UsfsTopoMapLayer.prototype.refresh = function () {
       return this.wmtsLayer.refresh(dc);
    };

    /**
     * Subclass method called to display this layer. Subclasses should implement this method rather than the
     * [render]{@link Layer#render} method, which determines enable, pick and active altitude status and does not
     * call this doRender method if the layer should not be displayed.
     * @param {DrawContext} dc The current draw context.
     * @protected
     */
    UsfsTopoMapLayer.prototype.doRender = function (dc) {
       return this.wmtsLayer.doRender(dc);
    };

    /**
     * Indicates whether this layer is within the current view. Subclasses may override this method and
     * when called determine whether the layer contents are visible in the current view frustum. The default
     * implementation always returns true.
     * @param {DrawContext} dc The current draw context.
     * @returns {boolean} true If this layer is within the current view, otherwise false.
     * @protected
     */
    UsfsTopoMapLayer.prototype.isLayerInView = function (dc) {
        return this.wmtsLayer.isLayerInView(dc);
    };

    return UsfsTopoMapLayer;
});