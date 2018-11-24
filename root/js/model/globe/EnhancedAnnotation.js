/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/* global define, WorldWind */

/**
 * The EnhancedAnnotation observes the Globe's sunlight member.
 *
 * @exports EnhancedAnnotation
 * @author Bruce Schubert
 */
define(['model/Constants','worldwind'],
        function (constants) {
            "use strict";
            /**
             * Constructs an annotation.
             * @alias Annotation
             * @constructor
             * @augments Renderable
             * @classdesc Represents an Annotation shape. An annotation displays a callout, a text and a leader pointing
             * the annotation's geographic position to the ground.
             * @param {Position} position The annotations's geographic position.
             * @param {AnnotationAttributes} attributes The attributes to associate with this annotation.
             * @throws {ArgumentError} If the specified position is null or undefined.
             */
            var EnhancedAnnotation = function (position, attributes) {
                // Call to the superclass.
                WorldWind.Annotation.call(this, position, attributes);
            };

            // Inherit the AtmosphereLayer methods
            EnhancedAnnotation.prototype = Object.create(WorldWind.Annotation.prototype);

      
            /* Intentionally not documented
             * Creates an ordered renderable for this shape.
             * @protected
             * @param {DrawContext} dc The current draw context.
             * @returns {OrderedRenderable} The ordered renderable. May be null, in which case an ordered renderable
             * cannot be created or should not be created at the time this method is called.
             */
            EnhancedAnnotation.prototype.makeOrderedRenderable = function (dc) {

                var w, h, s, iLeft, iRight, iTop, iBottom,
                    offset, leaderGapHeight;
                 
                //BDS - conditional size constraint - allows auto-resize when width==0
                // Wraps the text based and the width and height that were set for the annotation
                if (this.attributes.width > 0) {
                    this.label = dc.textRenderer.wrap(
                        this.label,
                        this.attributes.width, this.attributes.height);
                }
                

                // Compute the annotation's model point.
                dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                    this.altitudeMode, this.placePoint);

                this.eyeDistance = dc.eyePoint.distanceTo(this.placePoint);

                // Compute the annotation's screen point in the OpenGL coordinate system of the WorldWindow
                // by projecting its model coordinate point onto the viewport. Apply a depth offset in order
                // to cause the annotation to appear above nearby terrain.
                if (!dc.projectWithDepth(this.placePoint, this.depthOffset, WorldWind.Annotation.screenPoint)) {
                    return null;
                }

                this.labelTexture = dc.createTextTexture(this.label, this.attributes.textAttributes);

                w = this.labelTexture.imageWidth;
                h = this.labelTexture.imageHeight;
                s = this.attributes.scale;
                iLeft = this.attributes.insets.left;
                iRight = this.attributes.insets.right;
                iTop = this.attributes.insets.top;
                iBottom = this.attributes.insets.bottom;
                leaderGapHeight = this.attributes.leaderGapHeight;

                offset = this.calloutOffset.offsetForSize((w + iLeft + iRight) * s, (h + iTop + iBottom) * s);

                this.calloutTransform.setTranslation(
                    WorldWind.Annotation.screenPoint[0] - offset[0],
                    WorldWind.Annotation.screenPoint[1] + leaderGapHeight,
                    WorldWind.Annotation.screenPoint[2]);

                this.labelTransform.setTranslation(
                    WorldWind.Annotation.screenPoint[0] - offset[0] + iLeft * s,
                    WorldWind.Annotation.screenPoint[1] + leaderGapHeight + iBottom * s,
                    WorldWind.Annotation.screenPoint[2]);

                this.labelTransform.setScale(w * s, h * s, 1);

                this.labelBounds = WorldWind.WWMath.boundingRectForUnitQuad(this.labelTransform);

                // Compute dimensions of the callout taking in consideration the insets
                var width = (w + iLeft + iRight) * s;
                var height = (h + iTop + iBottom) * s;

                var leaderOffsetX = (width / 2);

                var leaderOffsetY = -leaderGapHeight;

                if (!this.attributes.drawLeader) {
                    leaderOffsetY = 0;
                }

                if (this.attributes.stateKey !== this.lastStateKey) {
                    this.calloutPoints = this.createCallout(
                        width, height,
                        leaderOffsetX, leaderOffsetY,
                        this.attributes.leaderGapWidth, this.attributes.cornerRadius);
                }

                return this;
            };
        

            return EnhancedAnnotation;
        }
);