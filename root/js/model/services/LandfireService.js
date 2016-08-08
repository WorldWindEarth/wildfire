/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $ */
/*
 * 
 * @param {Log} log
 * @param {WmtUtil} util
 * @param {Wmt} wmt
 * @returns {LandfireResource}
 * 
 * http://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_130/MapServer 
 * 2015.08.10 
 * {
 * "currentVersion": 10.21,
 * "serviceDescription": "",
 * "mapName": "Layers",
 * "description": "",
 * "copyrightText": "",
 * "supportsDynamicLayers": false,
 * "layers": [
 *  {
 *   "id": 0,
 *   "name": "US_VTM2010",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 1,
 *   "name": "US_130CC",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 2,
 *   "name": "US_130CH",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 3,
 *   "name": "US_130EVC",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 4,
 *   "name": "US_130EVH",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 5,
 *   "name": "US_130FBFM13",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 6,
 *   "name": "US_130FBFM40",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 7,
 *   "name": "US_DIST2011",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 8,
 *   "name": "US_DIST2012",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 9,
 *   "name": "US_VDIST2012",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 10,
 *   "name": "US_VTM2012",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 11,
 *   "name": "US_FDIST2012",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 12,
 *   "name": "US_130BPS",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 13,
 *   "name": "US_130ESP",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 14,
 *   "name": "US_130FRG",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 15,
 *   "name": "US_130MFRI",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 16,
 *   "name": "US_130PLS",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 17,
 *   "name": "US_130PMS",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 18,
 *   "name": "US_130PRS",
 *   "parentLayerId": -1,
 *   "defaultVisibility": false,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 19,
 *   "name": "US_130EVT",
 *   "parentLayerId": -1,
 *   "defaultVisibility": true,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 20,
 *   "name": "US_130CBD",
 *   "parentLayerId": -1,
 *   "defaultVisibility": true,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  },
 *  {
 *   "id": 21,
 *   "name": "US_130CBH",
 *   "parentLayerId": -1,
 *   "defaultVisibility": true,
 *   "subLayerIds": null,
 *   "minScale": 0,
 *   "maxScale": 0
 *  }
 * ],
 * "tables": [],
 * "spatialReference": {
 *  "wkid": 4326,
 *  "latestWkid": 4326
 * },
 * "singleFusedMapCache": false,
 * "initialExtent": {
 *  "xmin": -174.18743805119976,
 *  "ymin": -24.304666269002198,
 *  "xmax": -19.054383841211845,
 *  "ymax": 98.71985928560018,
 *  "spatialReference": {
 *   "wkid": 4326,
 *   "latestWkid": 4326
 *  }
 * },
 * "fullExtent": {
 *  "xmin": -127.98775263969655,
 *  "ymin": 22.765446426860603,
 *  "xmax": -65.25444546636928,
 *  "ymax": 51.64968101623376,
 *  "spatialReference": {
 *   "wkid": 4326,
 *   "latestWkid": 4326
 *  }
 * },
 * "minScale": 0,
 * "maxScale": 0,
 * "units": "esriDecimalDegrees",
 * "supportedImageFormatTypes": "PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP",
 * "documentInfo": {
 *  "Title": "",
 *  "Author": "",
 *  "Comments": "",
 *  "Subject": "",
 *  "Category": "",
 *  "AntialiasingMode": "None",
 *  "TextAntialiasingMode": "Force",
 *  "Keywords": ""
 * },
 * "capabilities": "Map,Query,Data",
 * "supportedQueryFormats": "JSON, AMF",
 * "exportTilesAllowed": false,
 * "maxRecordCount": 1000,
 * "maxImageHeight": 50000,
 * "maxImageWidth": 50000,
 * "supportedExtensions": "WMSServer"
 *}
 */
define([
    'model/util/Log',
    'model/util/Messenger',
    'model/util/WmtUtil',
    'model/Constants'],
    function (
        log,
        messenger,
        util,
        constants) {
        "use strict";
        var LandfireService = {
            /**
             * Identfies the "original 13" fuel model no at the given lat/lon.
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Function(String)} callback function(value){} receives fuel model no.
             * 
             */
            FBFM13: function (latitude, longitude, callback) {
                if (this.FBFM13LayerId === undefined) {
                    this.FBFM13LayerId = this.getLayerId('FBFM13');
                }
                if (this.FBFM13LayerId === null) {
                    throw new Error('Cannot find FBFM13 layer ID.');
                }
                this.identify(latitude, longitude, this.FBFM13LayerId, callback);
            },
            /**
             * Identfies the "standard 40" fuel model no at the given lat/lon.
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Function(String)} callback function(value){} receives fuel model no.
             */
            FBFM40: function (latitude, longitude, callback) {
                if (this.FBFM40LayerId === undefined) {
                    this.FBFM40LayerId = this.getLayerId('FBFM40');
                }
                if (this.FBFM40LayerId === null) {
                    throw new Error('Cannot find FBFM40 layer ID.');
                }
                this.identify(latitude, longitude, this.FBFM40LayerId, callback);
            },
            getLayerId: function (layerName) {
                var self = this,
                    json,
                    msg,
                    i, len, layer,
                    regExp = new RegExp(layerName);

                if (this.layers === undefined) {
                    $.ajax({
                        url: constants.LANDFIRE_REST_SERVICE,
                        data: 'f=json',
                        async: false,
                        success: function (response) {
                            json = JSON.parse(response);
                            // Create our 'layers' object
                            self.layers = json.layers;
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            msg = 'Unable to access the LANDFIRE web services. Try refreshing this page later to reattempt access.';
                            log.error('LandfireResource', 'getLayerId', msg);
                            messenger.notify(msg);
                        }
                    });
                }
                if (this.layers) {
                    for (i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        if (regExp.test(layer.name)) {
                            return layer.id;
                        }
                    }
                }
                return null;
            },
            /**
             * Identifies the LANDFIRE ArcGIS REST MapService value at the given lat/lon. 
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {String} layerId
             * @param {Function(String)} callback Callback: function(value){} receives map layer value at lat/lon.
             */
            identify: function (latitude, longitude, layerId, callback) {
                var url = constants.LANDFIRE_REST_SERVICE + '/identify',
                    query = 'geometry=' + longitude + ',' + latitude    // x,y
                    + '&geometryType=esriGeometryPoint'
                    + '&sr=4326'
                    + '&layers=all:' + layerId
                    + '&mapExtent=' + longitude + ',' + latitude + ',' + longitude + ',' + latitude
                    + '&imageDisplay=1,1,96'    // width, height, dpi
                    + '&returnGeometry=false'
                    + '&tolerance=1'
                    + '&f=json';

                console.log(url + '?' + query);

                // Example response from a fuel model layer (w/o return geometry);
                // Pixel Value contains the map layer's encoded value at the given lat/lon.
                // 
                // { "results": 
                //  [
                //   {
                //    "layerId": 7,
                //    "layerName": "US_130FBFM13",
                //    "displayFieldName": "",
                //    "attributes": {
                //     "Pixel Value": "4",
                //     "OID": "3",
                //     "FBFM13": "FBFM4",
                //     "RED": "1",
                //     "GREEN": "0.827451",
                //     "BLUE": "0.498039",
                //     "R": "255",
                //     "G": "211",
                //     "B": "127"
                //    }
                //   }
                //  ]
                // }

                $.ajax({
                    url: url,
                    data: query,
                    success: function (response) {
                        var json = JSON.parse(response),
                            value = json.results[0].attributes['Pixel Value'];

                        callback(value);
                    }
                });
            }

        };
        return LandfireService;
    }
);