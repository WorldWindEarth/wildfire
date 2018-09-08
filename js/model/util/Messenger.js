/* 
 * Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     - Neither the name of Bruce Schubert,  nor the names of its 
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global define, $ */

/**
 * The Messenger module is responsible for user notifications.
 * @module {util/Messenger}
 * @author Bruce Schubert
 */
define(['jquery', 'jquery-growl'],
    function ($) {
        "use strict";
        /**
         * @constructor
         * @exports Messenger
         */
        var Messenger = {

            /**
             * Displays popup message for a few seconds.
             * @param {String} style "info", "warn" or "error".
             * @param {String} title Message summary.
             * @param {String} message Message detail.
             * @param {Number} duration Time to show message in milliseconds.
             */
            growl: function (style, title, message, duration) {
                var priority = style === "error" ? "danger" : style || "primary";
                $.growl({
                    displayTimeout: duration || 5000,
                    title: title,
                    message: message,
                    priority: priority});
            },
            /**
             * Displays popup message for a few seconds.
             * @param {String} message Message detail.
             * @param {String} title Optional. Message summary. Default is "FYI"
             * @param {Number} duration Optional. Time to show message in milliseconds.
             */
            infoGrowl: function (message, title, duration) {
                this.growl("info", title || "FYI", message, duration);
            },
            /**
             * Displays popup message for a few seconds.
             * @param {String} message Message detail.
             * @param {String} title Optional. Message summary. Default is "Warning"
             * @param {Number} duration Optional. Time to show message in milliseconds.
             */
            warningGrowl: function (message, title, duration) {
                this.growl("warning", title || "Warning", message, duration);
            },
            /**
             * Displays popup message for a few seconds.
             * @param {String} message Message detail.
             * @param {String} title Optional. Message summary. Default is "Error"
             * @param {Number} duration Optional. Time to show message in milliseconds.
             */
            errorGrowl: function (message, title, duration) {
                this.growl("danger", title || "Error", message, duration);
            },
            /**
             * 
             * @param {String} message
             */
            notify: function (message, title) {
                this.growl("primary", title, message, 0);
            }
        };
        return Messenger;
    }
);