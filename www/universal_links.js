var exec = require('cordova/exec'),
  channel = require('cordova/channel'),

// Reference name for the plugin
PLUGIN_NAME = 'UniversalLinks',

// Plugin methods on the native side that can be called from JavaScript
pluginNativeMethod = {
  INITIALIZE: 'jsInitPlugin'
};

/**
 * Method is called when native side sends us events about application launch from the link click.
 * Received message holds information about the clicked link and the event name, that should be broadcasted.
 *
 * @param {String} msg - JSON formatted string with call arguments
 */
function nativeCallback(msg) {
  var ulEvent = new CustomEvent(msg.event, {
    'detail': msg.data
  });

  document.dispatchEvent(ulEvent);
};

/*
 * Polyfill for adding CustomEvent which may not exist on older versions of Android.
 * See https://developer.mozilla.org/fr/docs/Web/API/CustomEvent for more details.
 */
function ensureCustomEventExists() {
  // Create only if it doesn't exist
  if (window.CustomEvent) {
    return;
  }

  var CustomEvent = function(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
};

if(!window.plugins) {
  window.plugins = {};
};

if (!window.plugins.universalLink) {
  window.plugins.universalLink = {initialized: false};
};

window.plugins.universalLink.listenersReady =
  function() {
    if( !window.plugins.universalLink.initialized ) {
      console.log("universal_links plugin listeners ready");
      ensureCustomEventExists();
      exec(nativeCallback, null, PLUGIN_NAME, pluginNativeMethod.INITIALIZE, []);
      window.plugins.universalLink.initialized = true;
    }
  };




