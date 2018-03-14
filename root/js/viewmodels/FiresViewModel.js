/*
 * The MIT License - http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2016 Bruce Schubert.
 */

/*global WorldWind*/

/**
 * Fires output module,
 * 
 * @param {type} ko
 * @param {type} $
 * @param {type} jqueryui
 * @param {type} fancytree
 * @param {type} constants
 * @returns {FiresViewModel}
 */
define(['knockout', 'jquery', 'jqueryui', 'jquery-fancytree', 'model/Constants', 'model/util/Log'],
    function (ko, $, jqueryui, fancytree, constants, log) {
        "use strict";
        /**
         * The view model for the Fires tab.
         * 
         * @param {Globe} globe
         * @param {WildlandFireManager} wildfireManager
         * @param {FireLookoutManager} fireLookoutManager
         * @constructor
         */
        function FiresViewModel(globe, wildfireManager, fireLookoutManager, viewFragment, appendToId) {
            var self = this,
                fire, i, len, lastState, state, $treeElement, tree, fireNode, stateNode, rootNode,
                parent;

            if (!viewFragment) {
                throw log.error("FiresViewModel", "constructor", "invalid viewFragment param");
            }
            if (!appendToId) {
                throw log.error("FiresViewModel", "constructor", "invalid appendToId param");
            }
            this.wildfires = wildfireManager.fires; // observableArray
            this.fireLookouts = fireLookoutManager.lookouts; // observableArray
            

            // Load the view html into the specified DOM element
            var domNodes = $.parseHTML(viewFragment);
            $("#" + appendToId).append(domNodes);
            this.view = domNodes[0];

            // Binds the view to this view model.
            ko.applyBindings(this, this.view);

            //
            // TODO: Move this to a WildlandFiresViewModal, like markers
            //
            

            var glyph_opts = {
                map: {
                    doc: "glyphicon glyphicon-fire",
                    docOpen: "glyphicon glyphicon-file",
                    checkbox: "glyphicon glyphicon-unchecked",
                    checkboxSelected: "glyphicon glyphicon-check",
                    checkboxUnknown: "glyphicon glyphicon-share",
                    dragHelper: "glyphicon glyphicon-play",
                    dropMarker: "glyphicon glyphicon-arrow-right",
                    error: "glyphicon glyphicon-warning-sign",
                    expanderClosed: "glyphicon glyphicon-menu-right",
                    expanderLazy: "glyphicon glyphicon-menu-right", // glyphicon-plus-sign
                    expanderOpen: "glyphicon glyphicon-menu-down", // glyphicon-collapse-down
                    folder: "glyphicon glyphicon-folder-close",
                    folderOpen: "glyphicon glyphicon-folder-open",
                    loading: "glyphicon glyphicon-refresh glyphicon-spin"
                }
            };

            // Populate the JQuery.fancytree source data with wildfires.
            // The wildfires array should be sorted by state.
            $treeElement = $("#wildland-fire-tree");
            if (!$treeElement) {
                throw new Error(
                    log.error("FiresViewModel", "constructor", "missingElement: #wildland-fire-tree"));
            }
            $treeElement.fancytree({
                source: [],
                checkbox: false,
                extensions: ["glyph", "wide"],
                glyph: glyph_opts,
                selectMode: 2,
                toggleEffect: {
                    effect: "drop",
                    options: {direction: "left"},
                    duration: 400},
                wide: {
                    iconWidth: "1em", // Adjust this if @fancy-icon-width != "16px"
                    iconSpacing: "0.5em", // Adjust this if @fancy-icon-spacing != "3px"
                    levelOfs: "1.5em"     // Adjust this if ul padding != "16px"
                },
                icon: function (event, data) {
                    // if( data.node.isFolder() ) {
                    //   return "glyphicon glyphicon-book";
                    // }
                },
                activate: function (event, data) {
                    var node = data.node;
                    // acces node attributes
                    $("#echoActive").text(node.title);
                    if (!$.isEmptyObject(node.data)) {
                        self.gotoWildfire(node.data);
                    }
                }
            });

            // Subscribe to "arrayChange" events ...
            // documented here: http://blog.stevensanderson.com/2013/10/08/knockout-3-0-release-candidate-available/
            this.wildfires.subscribe(function (changes) {
                tree = $treeElement.fancytree("getTree");
                rootNode = $treeElement.fancytree("getRootNode");
                changes.forEach(function (change) {
                    if (change.status === 'added' && change.moved === undefined) {
                        fire = change.value;
                        stateNode = tree.getNodeByKey(fire.state);
                        if (stateNode === null) {
                            stateNode = rootNode.addChildren({
                                title: fire.state,
                                key: fire.state,
                                children: [],
                                folder: true
                            });
                        }
                        fireNode = stateNode.addChildren({
                            title: fire.name,
                            key: fire.id,
                            data: fire
                        });
                    } else if (change.status === 'deleted' && change.moved === undefined) {

                    }
                });
                rootNode.sortChildren(null, true);
            }, null, "arrayChange"); // Subscribe to "arrayChange" events ...

            /** "Goto" function centers the globe on a selected wildfire */
            this.gotoWildfire = function (wildfire) {
                var deferred = $.Deferred();
                if (wildfire.geometry) {
                    globe.goto(wildfire.latitude, wildfire.longitude);
                    globe.selectController.doSelect(wildfire);
                } else {
                    // Load the geometry
                    wildfire.loadDeferredGeometry(deferred);
                    $.when(deferred).done(function (self) {
                        globe.goto(wildfire.latitude, wildfire.longitude);
                        globe.selectController.doSelect(wildfire);
                    });
                }
            };
            /** "Goto" function centers the globe on a selected fireLookout */
            this.gotoFireLookout = function (fireLookout) {
                globe.goto(fireLookout.latitude(), fireLookout.longitude());
                globe.selectController.doSelect(fireLookout);
            };
            /** "Edit" function invokes a modal dialog to edit the fireLookout attributes */
            this.editFireLookout = function (fireLookout) {
                if (fireLookout.isOpenable) {
                    fireLookout.open();
                }
            };
            /** "Remove" function removes a fireLookout from the globe */
            this.removeFireLookout = function (fireLookout) {
                if (fireLookout.isRemovable) {
                    fireLookout.remove();
                }
            };
        }

        return  FiresViewModel;
    }
);