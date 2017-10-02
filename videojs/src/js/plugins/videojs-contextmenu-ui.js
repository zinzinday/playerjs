/**
 * videojs-contextmenu-ui
 * @version 4.0.0
 * @copyright 2017 Brightcove, Inc.
 * @license Apache-2.0
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
	typeof define === 'function' && define.amd ? define(['video.js'], factory) :
	(global.videojsContextmenuUi = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

videojs = 'default' in videojs ? videojs['default'] : videojs;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var empty = {};


var empty$1 = (Object.freeze || Object)({
	'default': empty
});

var minDoc = ( empty$1 && empty ) || empty$1;

var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
    typeof window !== 'undefined' ? window : {};


var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

var document_1 = doccy;

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof commonjsGlobal !== "undefined") {
    win = commonjsGlobal;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

var window_1 = win;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
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
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var MenuItem = videojs.getComponent('MenuItem');

var ContextMenuItem = function (_MenuItem) {
  inherits(ContextMenuItem, _MenuItem);

  function ContextMenuItem() {
    classCallCheck(this, ContextMenuItem);
    return possibleConstructorReturn(this, _MenuItem.apply(this, arguments));
  }

  ContextMenuItem.prototype.handleClick = function handleClick(e) {
    var _this2 = this;

    _MenuItem.prototype.handleClick.call(this);
    this.options_.listener();

    // Close the containing menu after the call stack clears.
    window_1.setTimeout(function () {
      _this2.player().contextmenuUI.menu.dispose();
    }, 1);
  };

  return ContextMenuItem;
}(MenuItem);

var Menu = videojs.getComponent('Menu');
// support VJS5 & VJS6 at the same time
var dom = videojs.dom || videojs;

var ContextMenu = function (_Menu) {
  inherits(ContextMenu, _Menu);

  function ContextMenu(player, options) {
    classCallCheck(this, ContextMenu);

    // Each menu component has its own `dispose` method that can be
    // safely bound and unbound to events while maintaining its context.
    var _this = possibleConstructorReturn(this, _Menu.call(this, player, options));

    _this.dispose = videojs.bind(_this, _this.dispose);

    options.content.forEach(function (c) {
      var fn = function fn() {};

      if (typeof c.listener === 'function') {
        fn = c.listener;
      } else if (typeof c.href === 'string') {
        fn = function fn() {
          return window_1.open(c.href);
        };
      }

      _this.addItem(new ContextMenuItem(player, {
        label: c.label,
        listener: videojs.bind(player, fn)
      }));
    });
    return _this;
  }

  ContextMenu.prototype.createEl = function createEl() {
    var el = _Menu.prototype.createEl.call(this);

    dom.addClass(el, 'vjs-contextmenu-ui-menu');
    el.style.left = this.options_.position.left + 'px';
    el.style.top = this.options_.position.top + 'px';

    return el;
  };

  return ContextMenu;
}(Menu);

// For now, these are copy-pasted from video.js until they are exposed.

/**
 * Offset Left
 * getBoundingClientRect technique from
 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @function findElPosition
 * @param {Element} el Element from which to get offset
 * @return {Object}
 */
function findElPosition(el) {
  var box = void 0;

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect();
  }

  if (!box) {
    return {
      left: 0,
      top: 0
    };
  }

  var docEl = document_1.documentElement;
  var body = document_1.body;

  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var scrollLeft = window_1.pageXOffset || body.scrollLeft;
  var left = box.left + scrollLeft - clientLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var scrollTop = window_1.pageYOffset || body.scrollTop;
  var top = box.top + scrollTop - clientTop;

  // Android sometimes returns slightly off decimal values, so need to round
  return {
    left: Math.round(left),
    top: Math.round(top)
  };
}

/**
 * Get pointer position in element
 * Returns an object with x and y coordinates.
 * The base on the coordinates are the bottom left of the element.
 *
 * @function getPointerPosition
 * @param {Element} el Element on which to get the pointer position on
 * @param {Event} event Event object
 * @return {Object}
 *         This object will have x and y coordinates corresponding to the
 *         mouse position
 */
function getPointerPosition(el, event) {
  var position = {};
  var box = findElPosition(el);
  var boxW = el.offsetWidth;
  var boxH = el.offsetHeight;
  var boxY = box.top;
  var boxX = box.left;
  var pageY = event.pageY;
  var pageX = event.pageX;

  if (event.changedTouches) {
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
  }

  position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
  position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

  return position;
}

// support VJS5 & VJS6 at the same time
var registerPlugin = videojs.registerPlugin || videojs.plugin;

/**
 * Whether or not the player has an active context menu.
 *
 * @param  {Player} player
 * @return {Boolean}
 */
function hasMenu(player) {
  return player.hasOwnProperty('contextmenuUI') && player.contextmenuUI.hasOwnProperty('menu') && player.contextmenuUI.menu.el();
}

/**
 * Calculates the position of a menu based on the pointer position and player
 * size.
 *
 * @param  {Object} pointerPosition
 * @param  {Object} playerSize
 * @return {Object}
 */
function findMenuPosition(pointerPosition, playerSize) {
  return {
    left: Math.round(playerSize.width * pointerPosition.x),
    top: Math.round(playerSize.height - playerSize.height * pointerPosition.y)
  };
}

/**
 * Handles vjs-contextmenu events.
 *
 * @param  {Event} e
 */
function onVjsContextMenu(e) {
  var _this = this;

  // If this event happens while the custom menu is open, close it and do
  // nothing else. This will cause native contextmenu events to be intercepted
  // once again; so, the next time a contextmenu event is encountered, we'll
  // open the custom menu.
  if (hasMenu(this)) {
    this.contextmenuUI.menu.dispose();
    return;
  }

  // Stop canceling the native contextmenu event until further notice.
  this.contextmenu.options.cancel = false;

  // Calculate the positioning of the menu based on the player size and
  // triggering event.
  var pointerPosition = getPointerPosition(this.el(), e);
  var playerSize = this.el().getBoundingClientRect();
  var menuPosition = findMenuPosition(pointerPosition, playerSize);

  e.preventDefault();

  var menu = this.contextmenuUI.menu = new ContextMenu(this, {
    content: this.contextmenuUI.content,
    position: menuPosition
  });

  // This is for backward compatibility. We no longer have the `closeMenu`
  // function, but removing it would necessitate a major version bump.
  this.contextmenuUI.closeMenu = function () {
    videojs.warn('player.contextmenuUI.closeMenu() is deprecated, please use player.contextmenuUI.menu.dispose() instead!');
    menu.dispose();
  };

  menu.on('dispose', function () {
    // Begin canceling contextmenu events again, so subsequent events will
    // cause the custom menu to be displayed again.
    _this.contextmenu.options.cancel = true;
    videojs.off(document_1, ['click', 'tap'], menu.dispose);
    _this.removeChild(menu);
    delete _this.contextmenuUI.menu;
  });

  this.addChild(menu);
  videojs.on(document_1, ['click', 'tap'], menu.dispose);
}

/**
 * Creates a menu for videojs-contextmenu abstract event(s).
 *
 * @function contextmenuUI
 * @param    {Object} options
 * @param    {Array}  options.content
 *           An array of objects which populate a content list within the menu.
 */
function contextmenuUI(options) {
  var _this2 = this;

  if (!Array.isArray(options.content)) {
    throw new Error('"content" required');
  }

  // If we have already invoked the plugin, teardown before setting up again.
  if (hasMenu(this)) {
    this.contextmenuUI.menu.dispose();
    this.off('vjs-contextmenu', this.contextmenuUI.onVjsContextMenu);

    // Deleting the player-specific contextmenuUI plugin function/namespace will
    // restore the original plugin function, so it can be called again.
    delete this.contextmenuUI;
  }

  // If we are not already providing "vjs-contextmenu" events, do so.
  this.contextmenu();

  // Wrap the plugin function with an player instance-specific function. This
  // allows us to attach the menu to it without affecting other players on
  // the page.
  var cmui = this.contextmenuUI = function () {
    contextmenuUI.apply(this, arguments);
  };

  cmui.onVjsContextMenu = videojs.bind(this, onVjsContextMenu);
  cmui.content = options.content;
  cmui.VERSION = '__VERSION__';

  this.on('vjs-contextmenu', cmui.onVjsContextMenu);
  this.ready(function () {
    return _this2.addClass('vjs-contextmenu-ui');
  });
}

registerPlugin('contextmenuUI', contextmenuUI);
contextmenuUI.VERSION = '__VERSION__';

return contextmenuUI;

})));
