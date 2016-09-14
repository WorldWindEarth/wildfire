/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */


/*global define */

/**
 * The LandfireLayer renders LANDFIRE fuel models.
 * @exports LandfireLayer
 * 
 * @returns {LandfireFbfm13Layer}
 * 
 * See: http://landfire.gov/data_access.php
 * 
 * WMS Capabilities:
 * http://landfire.cr.usgs.gov/arcgis/services/Landfire/US_130/MapServer/WMSServer?service=wms&request=GetCapabilities&version=1.3.0
 * 
 */

define([
    'worldwind'],
    function (
        ww) {
        "use strict";
        /**
         * Constructs a LANDFIRE FBFM13 layer.
         * @alias LandfireLayer
         * @constructor
         * @augments WmsLayer
         *  <FormatSuffix>.png</FormatSuffix>
         *  <NumLevels count="12" numEmpty="0"/>
         *  <Sector>
         *      <SouthWest>
         *          <LatLon latitude="22.6952681387" longitude="-128.0067177405" units="degrees"/>
         *      </SouthWest>
         *      <NorthEast>
         *          <LatLon latitude="51.6768794844" longitude="-65.2077897436" units="degrees"/>
         *      </NorthEast>
         *  </Sector>
         *  <TileOrigin>
         *  <LatLon latitude="-90.0" longitude="-180.0" units="degrees"/>
         *  </TileOrigin>
         *  <TileSize>
         *      <Dimension height="512" width="512"/>
         *  </TileSize>
         *  <LevelZeroTileDelta>
         *      <LatLon latitude="36.0" longitude="36.0" units="degrees"/>
         *  </LevelZeroTileDelta>
         *  <ImageFormat>image/png</ImageFormat>
         *  <UseTransparentTextures>true</UseTransparentTextures>
         */
        var LandfireFbfm13Layer = function () {
            var //capabilities = WorldWind.WmsCapabilities(wmt.IMAGE_PATH + '../globe/LANDFIRE.FBFM40.xml'),
                //config = WorldWind.WmsLayer.formLayerConfiguration(capabilities),
                cfg = {
                    title: "Fuel Models (13)",
                    version: "1.3.0",
                    service: "http://landfire.cr.usgs.gov/arcgis/services/Landfire/US_130/MapServer/WMSServer?",
                    layerNames: "US_130FBFM13",
                    sector: new WorldWind.Sector(22.6952681387, 51.6768794844, -128.0067177405, -65.2077897436),
                    levelZeroDelta: new WorldWind.Location(36, 36),
                    numLevels: 12,
                    format: "image/png",
                    size: 512,
                    coordinateSystem: "EPSG:4326", // optional
                    styleNames: "" // (optional): {String} A comma separated list of the styles to include in this layer.</li>
                };
                
            WorldWind.WmsLayer.call(this, cfg);
            
            // Make this layer translucent
            this.opacity = 0.5;

        };

        LandfireFbfm13Layer.prototype = Object.create(WorldWind.WmsLayer.prototype);

        return LandfireFbfm13Layer;
    }
);