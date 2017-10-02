/*!
 * @name videojs-upnext
 * @version 2.2.0
 * @author Fernando Godino <fernando@varsityviews.com>
 * @license Apache-2.0
 */
(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.videojsUpnext = f()
    }
})(function () {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {exports: {}};
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }

        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function (require, module, exports) {
            (function (global) {
                'use strict';

                var _createClass = function () {
                    function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ("value" in descriptor) descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }

                    return function (Constructor, protoProps, staticProps) {
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                    };
                }();

                var _get = function get(object, property, receiver) {
                    if (object === null) object = Function.prototype;
                    var desc = Object.getOwnPropertyDescriptor(object, property);
                    if (desc === undefined) {
                        var parent = Object.getPrototypeOf(object);
                        if (parent === null) {
                            return undefined;
                        } else {
                            return get(parent, property, receiver);
                        }
                    } else if ("value" in desc) {
                        return desc.value;
                    } else {
                        var getter = desc.get;
                        if (getter === undefined) {
                            return undefined;
                        }
                        return getter.call(receiver);
                    }
                };

                var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                    return typeof obj;
                } : function (obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };

                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError("Cannot call a class as a function");
                    }
                }

                function _possibleConstructorReturn(self, call) {
                    if (!self) {
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }
                    return call && (typeof call === "object" || typeof call === "function") ? call : self;
                }

                function _inherits(subClass, superClass) {
                    if (typeof superClass !== "function" && superClass !== null) {
                        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                    }
                    subClass.prototype = Object.create(superClass && superClass.prototype, {
                        constructor: {
                            value: subClass,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
                }

                Object.defineProperty(exports, '__esModule', {value: true});

                function _interopDefault(ex) {
                    return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
                }

                var videojs = _interopDefault((typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null));

                var defaults = {};

// Cross-compatibility for Video.js 5 and 6.
                var registerPlugin = videojs.registerPlugin || videojs.plugin;

// const dom = videojs.dom || videojs;

                function getMainTemplate(options) {
                    return '<div class="vjs-upnext-top"><span class="vjs-upnext-headtext">' + options.headText + '</span><div class="vjs-upnext-title"></div></div><div class="vjs-upnext-autoplay-icon"><svg height="100%" version="1.1" viewbox="0 0 98 98" width="100%"><circle class="vjs-upnext-svg-autoplay-circle" cx="49" cy="49" fill="#000" fill-opacity="0.8" r="48"></circle><circle class="vjs-upnext-svg-autoplay-ring" cx="-49" cy="49" fill-opacity="0" r="46.5" stroke="#FFFFFF" stroke-width="4" transform="rotate(-90)"></circle><polygon class="vjs-upnext-svg-autoplay-triangle" fill="#fff" points="32,27 72,49 32,71"></polygon></svg></div><span class="vjs-upnext-bottom"><span class="vjs-upnext-cancel"><button class="vjs-upnext-cancel-button" tabindex="0" aria-label="Cancel autoplay">' + options.cancelText + '</button></span></span>';
                }

                var Component = videojs.getComponent('Component');

                /**
                 * EndCard Component
                 */

                var EndCard = function (_Component) {
                    _inherits(EndCard, _Component);

                    function EndCard(player, options) {
                        _classCallCheck(this, EndCard);

                        var _this = _possibleConstructorReturn(this, (EndCard.__proto__ || Object.getPrototypeOf(EndCard)).call(this, player, options));

                        _this.getTitle = _this.options_.getTitle;
                        _this.next = _this.options_.next;

                        _this.upNextEvents = new videojs.EventTarget();

                        _this.dashOffsetTotal = 586;
                        _this.dashOffsetStart = 293;
                        _this.interval = 50;
                        _this.chunkSize = (_this.dashOffsetTotal - _this.dashOffsetStart) / (_this.options_.timeout / _this.interval);

                        player.on('ended', function (event) {
                            player.addClass('vjs-upnext--showing');
                            _this.showCard(function (canceled) {
                                player.removeClass('vjs-upnext--showing');
                                _this.container.style.display = 'none';
                                if (!canceled) {
                                    _this.next();
                                }
                            });
                        });

                        player.on('playing', function () {
                            this.upNextEvents.trigger('playing');
                        }.bind(_this));
                        return _this;
                    }

                    _createClass(EndCard, [{
                        key: 'createEl',
                        value: function createEl() {

                            var container = _get(EndCard.prototype.__proto__ || Object.getPrototypeOf(EndCard.prototype), 'createEl', this).call(this, 'div', {
                                className: 'vjs-upnext-content',
                                innerHTML: getMainTemplate(this.options_)
                            });

                            this.container = container;
                            container.style.display = 'none';

                            this.autoplayRing = container.getElementsByClassName('vjs-upnext-svg-autoplay-ring')[0];
                            this.title = container.getElementsByClassName('vjs-upnext-title')[0];
                            this.cancelButton = container.getElementsByClassName('vjs-upnext-cancel-button')[0];
                            this.nextButton = container.getElementsByClassName('vjs-upnext-autoplay-icon')[0];

                            this.cancelButton.onclick = function () {
                                this.upNextEvents.trigger('cancel');
                            }.bind(this);

                            this.nextButton.onclick = function () {
                                this.upNextEvents.trigger('next');
                            }.bind(this);

                            return container;
                        }
                    }, {
                        key: 'showCard',
                        value: function showCard(cb) {

                            var timeout = void 0;
                            var start = void 0;
                            var now = void 0;
                            var newOffset = void 0;

                            this.autoplayRing.setAttribute('stroke-dasharray', this.dashOffsetStart);
                            this.autoplayRing.setAttribute('stroke-dashoffset', -this.dashOffsetStart);

                            this.title.innerHTML = this.getTitle();

                            this.upNextEvents.one('cancel', function () {
                                clearTimeout(timeout);
                                cb(true);
                            });

                            this.upNextEvents.one('playing', function () {
                                clearTimeout(timeout);
                                cb(true);
                            });

                            this.upNextEvents.one('next', function () {
                                clearTimeout(timeout);
                                cb(false);
                            });

                            var update = function update() {
                                now = this.options_.timeout - (new Date().getTime() - start);

                                if (now <= 0) {
                                    clearTimeout(timeout);
                                    cb(false);
                                } else {
                                    newOffset = Math.max(-this.dashOffsetTotal, this.autoplayRing.getAttribute('stroke-dashoffset') - this.chunkSize);
                                    this.autoplayRing.setAttribute('stroke-dashoffset', newOffset);
                                    timeout = setTimeout(update.bind(this), this.interval);
                                }
                            };

                            this.container.style.display = 'block';
                            start = new Date().getTime();
                            timeout = setTimeout(update.bind(this), this.interval);
                        }
                    }]);

                    return EndCard;
                }(Component);

                videojs.registerComponent('EndCard', EndCard);

                /**
                 * Function to invoke when the player is ready.
                 *
                 * This is a great place for your plugin to initialize itself. When this
                 * function is called, the player will have its DOM and child components
                 * in place.
                 *
                 * @function onPlayerReady
                 * @param    {Player} player
                 *           A Video.js player.
                 * @param    {Object} [options={}]
                 *           An object of options left to the plugin author to define.
                 */
                var onPlayerReady = function onPlayerReady(player, options) {
                    player.addClass('vjs-upnext');
                };

                /**
                 * A video.js plugin.
                 *
                 * In the plugin function, the value of `this` is a video.js `Player`
                 * instance. You cannot rely on the player being in a "ready" state here,
                 * depending on how the plugin is invoked. This may or may not be important
                 * to you; if not, remove the wait for "ready"!
                 *
                 * @function upnext
                 * @param    {Object} [options={}]
                 *           An object of options left to the plugin author to define.
                 */
                var upnext = function upnext(options) {
                    var _this2 = this;

                    this.ready(function () {
                        onPlayerReady(_this2, videojs.mergeOptions(defaults, options));
                    });

                    var opts = options || {};
                    var settings = {
                        next: opts.next,
                        getTitle: opts.getTitle,
                        timeout: opts.timeout || 5000,
                        cancelText: opts.cancelText || 'Cancel',
                        headText: opts.headText || 'Up Next'
                    };

                    this.addChild('endCard', settings);
                };

// Register the plugin with video.js.
                registerPlugin('upnext', upnext);

// Include the version number.
                upnext.VERSION = '2.2.0';

                exports.EndCard = EndCard;
                exports['default'] = upnext;

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {}]
    }, {}, [1])(1)
});
