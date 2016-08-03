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
 */
define([
    'wmt/util/Log',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        log,
        util,
        wmt) {
        "use strict";
        var GeoMacResource = {
            /**
             * Identfies all current fires. Queries the GeoMAC geomac_fires large fire points layer (1).
             * 
             * @param {Function(Object[])} callback Receives query result "features" array.
             * 
             * Example result; see the features[] object:
             *{
             * "displayFieldName": "incidentname",
             * "fieldAliases": {
             *  "objectid": "OBJECTID",
             *  "latitude": "latitude",
             *  "longitude": "longitude",
             *  "acres": "acres",
             *  "gacc": "gacc",
             *  "hotlink": "hotlink",
             *  "load_date": "load_date",
             *  "state": "state",
             *  "status": "status",
             *  "firecause": "firecause",
             *  "reportdatetime": "reportdatetime",
             *  "percentcontained": "percentcontained",
             *  "uniquefireidentifier": "uniquefireidentifier",
             *  "firediscoverydatetime": "firediscoverydatetime",
             *  "complexparentirwinid": "complexparentirwinid",
             *  "pooresponsibleunit": "pooresponsibleunit",
             *  "incidentname": "incidentname",
             *  "iscomplex": "iscomplex",
             *  "irwinid": "irwinid"
             * },
             * "geometryType": "esriGeometryPoint",
             * "spatialReference": {
             *  "wkid": 4326,
             *  "latestWkid": 4326
             * },
             * "fields": [
             *  {
             *   "name": "objectid",
             *   "type": "esriFieldTypeOID",
             *   "alias": "OBJECTID"
             *  },
             *  {
             *   "name": "latitude",
             *   "type": "esriFieldTypeDouble",
             *   "alias": "latitude"
             *  },
             *  {
             *   "name": "longitude",
             *   "type": "esriFieldTypeDouble",
             *   "alias": "longitude"
             *  },
             *  {
             *   "name": "acres",
             *   "type": "esriFieldTypeDouble",
             *   "alias": "acres"
             *  },
             *  {
             *   "name": "gacc",
             *   "type": "esriFieldTypeString",
             *   "alias": "gacc",
             *   "length": 4
             *  },
             *  {
             *   "name": "hotlink",
             *   "type": "esriFieldTypeString",
             *   "alias": "hotlink",
             *   "length": 60
             *  },
             *  {
             *   "name": "load_date",
             *   "type": "esriFieldTypeString",
             *   "alias": "load_date",
             *   "length": 18
             *  },
             *  {
             *   "name": "state",
             *   "type": "esriFieldTypeString",
             *   "alias": "state",
             *   "length": 2
             *  },
             *  {
             *   "name": "status",
             *   "type": "esriFieldTypeString",
             *   "alias": "status",
             *   "length": 1
             *  },
             *  {
             *   "name": "firecause",
             *   "type": "esriFieldTypeString",
             *   "alias": "firecause",
             *   "length": 15
             *  },
             *  {
             *   "name": "reportdatetime",
             *   "type": "esriFieldTypeDate",
             *   "alias": "reportdatetime",
             *   "length": 36
             *  },
             *  {
             *   "name": "percentcontained",
             *   "type": "esriFieldTypeSmallInteger",
             *   "alias": "percentcontained"
             *  },
             *  {
             *   "name": "uniquefireidentifier",
             *   "type": "esriFieldTypeString",
             *   "alias": "uniquefireidentifier",
             *   "length": 22
             *  },
             *  {
             *   "name": "firediscoverydatetime",
             *   "type": "esriFieldTypeDate",
             *   "alias": "firediscoverydatetime",
             *   "length": 36
             *  },
             *  {
             *   "name": "complexparentirwinid",
             *   "type": "esriFieldTypeGUID",
             *   "alias": "complexparentirwinid",
             *   "length": 38
             *  },
             *  {
             *   "name": "pooresponsibleunit",
             *   "type": "esriFieldTypeString",
             *   "alias": "pooresponsibleunit",
             *   "length": 6
             *  },
             *  {
             *   "name": "incidentname",
             *   "type": "esriFieldTypeString",
             *   "alias": "incidentname",
             *   "length": 50
             *  },
             *  {
             *   "name": "iscomplex",
             *   "type": "esriFieldTypeString",
             *   "alias": "iscomplex",
             *   "length": 5
             *  },
             *  {
             *   "name": "irwinid",
             *   "type": "esriFieldTypeGUID",
             *   "alias": "irwinid",
             *   "length": 38
             *  }
             * ],
             * "features": [
             *  {
             *   "attributes": {
             *    "objectid": 1,
             *    "latitude": 65.58417,
             *    "longitude": -152.18583000000001,
             *    "acres": 9494.2000000000007,
             *    "gacc": "AKCC",
             *    "hotlink": "http://www.nifc.gov/fireInfo/nfn.htm",
             *    "load_date": "08\\01\\2015:0905",
             *    "state": "AK",
             *    "status": "U",
             *    "firecause": "Natural",
             *    "reportdatetime": 1437883200000,
             *    "percentcontained": 0,
             *    "uniquefireidentifier": "2015-AKTAD-000347",
             *    "firediscoverydatetime": 1434762367000,
             *    "complexparentirwinid": null,
             *    "pooresponsibleunit": "AKTAD",
             *    "incidentname": "Banddana Creek",
             *    "iscomplex": "false",
             *    "irwinid": "{DF258F6C-4B18-478F-A661-9D278F480072}"
             *   },
             *   "geometry": {
             *    "x": -152.18585668497468,
             *    "y": 65.584170947943491
             *   }
             *  }
             * ]
             *}               
             */
            activeFires: function (includeGeometry, callback) {
                this.query("1=1", '1', includeGeometry, callback);
            },
            /**
             * 
             * @param {type} callback
             * @returns {undefined}
             * 
             * {
             *"displayFieldName": "fire_name",
             *"fieldAliases": {
             * "objectid": "OBJECTID",
             * "acres": "acres",
             * "agency": "agency",
             * "time_": "time_",
             * "comments": "comments",
             * "year_": "year_",
             * "active": "active",
             * "unit_id": "unit_id",
             * "fire_name": "fire_name",
             * "fire_num": "fire_num",
             * "date_": "date_",
             * "fire": "fire",
             * "load_date": "load_date",
             * "inciweb_id": "inciweb_id",
             * "type": "type",
             * "st_area(shape)": "st_area(shape)",
             * "st_length(shape)": "st_length(shape)",
             * "inc_num": "inc_num"
             *},
             *"geometryType": "esriGeometryPolygon",
             *"spatialReference": {
             * "wkid": 4326,
             * "latestWkid": 4326
             *},
             *"fields": [
             * {
             *  "name": "objectid",
             *  "type": "esriFieldTypeOID",
             *  "alias": "OBJECTID"
             * },
             * {
             *  "name": "acres",
             *  "type": "esriFieldTypeDouble",
             *  "alias": "acres"
             * },
             * {
             *  "name": "agency",
             *  "type": "esriFieldTypeString",
             *  "alias": "agency",
             *  "length": 15
             * },
             * {
             *  "name": "time_",
             *  "type": "esriFieldTypeString",
             *  "alias": "time_",
             *  "length": 4
             * },
             * {
             *  "name": "comments",
             *  "type": "esriFieldTypeString",
             *  "alias": "comments",
             *  "length": 254
             * },
             * {
             *  "name": "year_",
             *  "type": "esriFieldTypeString",
             *  "alias": "year_",
             *  "length": 4
             * },
             * {
             *  "name": "active",
             *  "type": "esriFieldTypeString",
             *  "alias": "active",
             *  "length": 1
             * },
             * {
             *  "name": "unit_id",
             *  "type": "esriFieldTypeString",
             *  "alias": "unit_id",
             *  "length": 7
             * },
             * {
             *  "name": "fire_name",
             *  "type": "esriFieldTypeString",
             *  "alias": "fire_name",
             *  "length": 50
             * },
             * {
             *  "name": "fire_num",
             *  "type": "esriFieldTypeString",
             *  "alias": "fire_num",
             *  "length": 8
             * },
             * {
             *  "name": "date_",
             *  "type": "esriFieldTypeDate",
             *  "alias": "date_",
             *  "length": 36
             * },
             * {
             *  "name": "fire",
             *  "type": "esriFieldTypeString",
             *  "alias": "fire",
             *  "length": 50
             * },
             * {
             *  "name": "load_date",
             *  "type": "esriFieldTypeDate",
             *  "alias": "load_date",
             *  "length": 36
             * },
             * {
             *  "name": "inciweb_id",
             *  "type": "esriFieldTypeString",
             *  "alias": "inciweb_id",
             *  "length": 10
             * },
             * {
             *  "name": "type",
             *  "type": "esriFieldTypeString",
             *  "alias": "type",
             *  "length": 15
             * },
             * {
             *  "name": "st_area(shape)",
             *  "type": "esriFieldTypeDouble",
             *  "alias": "st_area(shape)"
             * },
             * {
             *  "name": "st_length(shape)",
             *  "type": "esriFieldTypeDouble",
             *  "alias": "st_length(shape)"
             * },
             * {
             *  "name": "inc_num",
             *  "type": "esriFieldTypeString",
             *  "alias": "inc_num",
             *  "length": 25
             * }
             *],
             *"features": [
             * {
             *  "attributes": {
             *   "objectid": 57395,
             *   "acres": 10872.98,
             *   "agency": "BLM",
             *   "time_": "0315",
             *   "comments": "IR heat perimeter ; No entry in FireCode",
             *   "year_": "2015",
             *   "active": "Y",
             *   "unit_id": "AK-TAD",
             *   "fire_name": "Lloyd 2",
             *   "fire_num": " ",
             *   "date_": 1436313600000,
             *   "fire": " ",
             *   "load_date": 1436313600000,
             *   "inciweb_id": " ",
             *   "type": null,
             *   "st_area(shape)": 0.0082388807979651875,
             *   "st_length(shape)": 1.409912496810692,
             *   "inc_num": "AK-TAD"
             *  },
             *  "geometry": {
             *   "rings": [
             *      [
             *          [-144.26760583828229,65.716984862311776],
             *          [-144.26881460813263,65.713976212270808],
             *          ...
             *          [-144.26725918614713,65.717954487317471],
             *          [-144.26760583828229,65.716984862311776]
             *      ]
             *  ]
             * }
             *}
             */
            activeFirePerimeters: function (includeGeometry, callback) {
                this.query("1=1", '2', includeGeometry, callback);
            },
            getActiveFireFeature: function (featureId, callback) {
                this.getFeature('1', featureId, callback);
            },
            getActivePerimeterFeature: function (featureId, callback) {
                this.getFeature('2', featureId, callback);
            },
            /**
             * Gets the feature from the MapServer REST service.
             * @param {String} layerId
             * @param {String} objectId
             * @param {Function} callback
             */
            getFeature: function(layerId, objectId, callback) {
                var url = wmt.GEOMAC_REST_SERVICE + '/' + layerId + '/' +objectId,
                    query = 'f=json';

                console.log(url + '?' + query);

                $.ajax({
                    url: url,
                    data: query,
                    success: function (response) {
                        var json = JSON.parse(response);
                        callback(json.feature);
                    }
                });
            },
            /**
             * Queries features the GeoMAX ArcGIS MapService . 
             * @param {String} whereCriteria
             * @param {String} layerId
             * @param {Boolean} includeGeometry
             * @param {Function(Object[])} callback Receives query results "features" array.
             */
            query: function (whereCriteria, layerId, includeGeometry, callback) {
                var url = wmt.GEOMAC_REST_SERVICE + '/' + layerId + '/query',
                    query = 'where=' + (whereCriteria || '1=1')
                    + '&text='
                    + '&objectIds='
                    + '&time='
                    + '&geometry='
                    + '&geometryType=esriGeometryEnvelope'
                    + '&inSR=&spatialRel=esriSpatialRelIntersects'
                    + '&relationParam=&outFields=*'
                    + '&returnGeometry=' + (includeGeometry ? 'true' : 'false')
                    + '&maxAllowableOffset='
                    + '&geometryPrecision='
                    + '&outSR=4326'
                    + '&returnIdsOnly=false'
                    + '&returnCountOnly=false'
                    + '&orderByFields='
                    + '&groupByFieldsForStatistics='
                    + '&outStatistics='
                    + '&returnZ=false'
                    + '&returnM=false'
                    + '&gdbVersion='
                    + '&returnDistinctValues=false'
                    + '&f=json';

                console.log(url + '?' + query);

                $.ajax({
                    url: url,
                    data: query,
                    success: function (response) {
                        // 
                        var json = JSON.parse(response);

                        callback(json.features);
                    }
                });
            },
            /**
             * Identifies features the GeoMAX ArcGIS MapService within the the given envelope. 
             * @param {Number} minLat
             * @param {Number} minLon
             * @param {String} layerId
             * @param {Function(String)} callback Callback: function(value){} receives map layer value at lat/lon.
             */
            identifyEnvelope: function (minLat, minLon, maxLat, maxLon, layerId, callback) {
                var url = wmt.LANDFIRE_REST_SERVICE + '/identify',
                    query = 'geometry=' + minLon + ',' + minLat + ',' + maxLon + ',' + maxLat    // x,y
                    + '&geometryType=esriGeometryEnvelope'
                    + '&sr=4326'
                    + '&layers=all:' + layerId
                    + '&mapExtent=' + minLon + ',' + minLat + ',' + minLon + ',' + minLat
                    + '&imageDisplay=1,1,96'    // width, height, dpi
                    + '&returnGeometry=true'
                    + '&tolerance=1'
                    + '&f=json';

                console.log(url + '?' + query);

                $.ajax({
                    url: url,
                    data: query,
                    success: function (response) {
                        var json = JSON.parse(response);

                        callback(json);
                    }
                });
            }

        };
        return GeoMacResource;
    }
);