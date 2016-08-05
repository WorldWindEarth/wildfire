/* 
 * Copyright (c) 2015, 2016 Bruce Schubert.
 * The MIT License.
 */

/*global define, $, WorldWind */

/**
 * 
 * @param {type} constants
 * @param {type} ww
 * @returns {WildlandFireSymbol}
 * 
 * @author Bruce Schubert
 */
define([
    'model/Constants',
    'worldwind'],
    function (
        constants,
        ww) {
        "use strict";

        /**
         * Constructs a point or (multi)polygon renderable to represent a fire.
         * @param {WildlandFire} fire The fire to render.
         * @constructor
         */
        var WildlandFireSymbol = function (fire) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Maintain a reference to the weather object this symbol represents
            this.fire = fire;
            this.shapes = [];

            var marker,
                i, numRings, ring,
                j, numPoints, perimeter,
                shape, shapeAttributes, shapeHighlightAttributes,
                point, pointAttributes, pointHightlightAttributes;

     

            // Create the symbol components
            if (fire.geometryType === constants.GEOMETRY_POINT) {
                // Create and set the attributes for fire point location
                pointAttributes = new WorldWind.PlacemarkAttributes(null);
                pointAttributes.imageSource = constants.IMAGE_PATH + 'ics/Fire_Location24.png';
                pointAttributes.depthTest = true;
                pointAttributes.imageScale = 1.5;
                pointAttributes.imageOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 0.0);
                pointAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
                pointAttributes.labelAttributes.color = WorldWind.Color.WHITE;
                pointAttributes.labelAttributes.depthTest = true;
                pointAttributes.drawLeaderLine = true;
                pointAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
                pointAttributes.leaderLineAttributes.outlineWidth = 2;

                pointHightlightAttributes = new WorldWind.PlacemarkAttributes(pointAttributes);
                pointHightlightAttributes.imageScale = pointAttributes.imageScale * 1.2;
                point = new WorldWind.Position(fire.geometry.y, fire.geometry.x, 0);
                marker = new WorldWind.Placemark(point, false, pointAttributes);
                marker.highlightAttributes = pointHightlightAttributes;
                marker.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                marker.label = fire.name;
                marker.attributes.labelAttributes.color = WorldWind.Color.YELLOW;
                marker.pickDelegate = fire;
                this.shapes.push(marker);

            } else if (fire.geometryType === constants.GEOMETRY_POLYGON) {
                // Create and set attributes for fire perimeter polygons
                shapeAttributes = new WorldWind.ShapeAttributes(null);
                shapeAttributes.outlineColor = WorldWind.Color.RED;
                shapeAttributes.interiorColor = new WorldWind.Color(0, 0, 0, 0.5);
                shapeHighlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
                shapeHighlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
                // Polygons are rendered as SurfacePolygons
                for (i = 0, numRings = fire.geometry.rings.length; i < numRings; i++) {
                    ring = fire.geometry.rings[i];
                    perimeter = [];
                    for (j = 0, numPoints = ring.length; j < numPoints; j++) {
                        perimeter.push(new WorldWind.Location(ring[j][1], ring[j][0]));
                    }
                    shape = new WorldWind.SurfacePolygon(perimeter, shapeAttributes);
                    shape.highlightAttributes = shapeHighlightAttributes;

                    this.shapes.push(shape);
                }
            }

        };
        // Inherit Renderable functions.
        WildlandFireSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this WildlandFireSymbol. 
         * @param {DrawContext} dc The current draw context.
         */
        WildlandFireSymbol.prototype.render = function (dc) {
            if (!this.enabled) {
                return;
            }
            // Preempt SurfaceShapeTile processing if the shape is not in view.
            if (this.fire.extents && !this.fire.extents.overlaps(dc.terrain.sector)) {
                return;
            }
            
            for (var i = 0, max = this.shapes.length; i < max; i++) {
                this.shapes[i].highlighted = this.highlighted;
                this.shapes[i].render(dc);
            }
        };

        return WildlandFireSymbol;
    }
);
