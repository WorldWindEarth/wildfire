/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $ */

define([
    'wmt/util/Log',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        Log,
        WmtUtil,
        Wmt) {
        "use strict";
        var TerrainResource = {
            makeTuple: function (aspect, slope, elevation) {
                return JSON.parse('{' +
                    '"aspect":{"type":"aspect:deg","value":"' + aspect + '","unit":"deg"},' +
                    '"slope":{"type":"slope:deg","value":"' + slope + '","unit":"deg"},' +
                    '"elevation":{"type":"elevation:m","value":"' + elevation + '","unit":"m"}' +
                    '}');
            },
            /**
             * Creates a terrain tuple that is compatible with the SurfaceFireResource.
             *
             * @param {Number} aspect The direction the terrain slope is facing in degrees; 0 is north, 180 is south.
             * @param {Number} slope The steepness of the slope in degrees; 0 is flat, 90 is straight up.
             * @param {Number} elevation The elevation of the terrain in meters.
             * @param {Function(JSON)} callback Receives a simple terrain tuple. Example:
             * JSON Example:
             * {
             *      "aspect":{"type":"aspect:deg","value":"0.0","unit":"deg"},
             *      "slope":{"type":"slope:deg","value":"0.0","unit":"deg"},
             *      "elevation":{"type":"elevation:m","value":"0.0","unit":"m"}
             * }
             */
            terrainTuple: function (aspect, slope, elevation, callback) {
                // TODO: assert the input values
                var url = WmtUtil.currentDomain() + Wmt.TERRAIN_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&aspect=" + aspect
                    + "&slope=" + slope
                    + "&elevation=" + elevation;
                console.log(url + '?' + query);
                $.get(url, query, callback);
            }
        };
        return TerrainResource;
    }
);