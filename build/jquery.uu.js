/* jslint vars: true, plusplus: true, devel: true */

;(function ($) {
  'use strict';

  // @todo: prevent multiple ajax calls

  $.UUJS = function (options) {

    var defaults = {
      url: 'https://dnscheck.vpn.ht/', // API url
      timeout: 3000, // Milliseconds
      retry: 3, // How many times should retry if timeout
      key: '' // Affiliate's key
    };

    var plugin = this,
        subscribeEvent,
        unsubscribeEvent,
        publishEvent,
        ip,
        cache = null,
        handlers = {};

    plugin.settings = {};

    function _getStatus(args) {
      var call;

      call = $.ajax({
        url: plugin.settings.url,
        data: args,
        dataType: "jsonp",
        cache: false,
        timeout: plugin.settings.timeout,
        tryCount: 0,
        retryLimit: plugin.settings.retry,

        beforeSend: function(xhr, opts) {
          publishEvent('onStart', []);
        },

        success: function(data) {
          /* */
          publishEvent('onSuccess', [data]);
          cache = data;
        },

        always: function() {
          /* */
        },

        error: function (xhr, status, error) {
          /* */
          publishEvent('onFail', [xhr, status, error]);
          if (status === 'timeout' && this.retryLimit > 0) {
            this.tryCount++;
            if (this.tryCount < this.retryLimit) {
              /* */
              $.ajax(this);
            }
          }
        }

      });

      return call;
    }

    function _setStatus(args, url, callback) {
      var call;

      call = $.ajax({
        url: url,
        data: args,
        async: false,
        dataType: "jsonp",

        beforeSend: function(xhr, opts) {
          publishEvent('onStart', []);
        },

        success: function(data) {
          /* */
          publishEvent('onSuccess', [data]);
          if (typeof callback === "function") {
            callback();
          }
          _getStatus(); // Refresh the cache
        },

        error: function (xhr, status, error) {
          publishEvent('onFail', [xhr, status, error]);
        }

      });

      return call;
    }

    /*
     * Subscribe an event handler
     */
    subscribeEvent = function (event, callback) {

      if (typeof(event) === 'object') {
        var res = [];
        for (var m in event) {
          if (typeof event[m] === "function") {
            res.push(m);
            subscribeEvent(m, event[m]);
          }
        }
        return;
      }

      if (!handlers[event]) {
        handlers[event] = [];
      }

      handlers[event].push(callback);

      return [event, callback];
    };

    /*
     * Unsubscribe the event handler
     */
    unsubscribeEvent = function (handler) {
      var t = handler[0],
          i = handlers[t].length - 1;

      if (handlers[t]) {
        for (i; i >= 0; i -= 1) {
          if (handlers[t][i] === handler[1]) {
            handlers[t].splice(i, 1);
          }
        }
      }
    };

    /*
     * Publish events
     */
    publishEvent = function (event, args) {
      if (handlers[event] === null) { return false; }
      $.each(handlers[event], function () {
        this.apply(plugin, args || []);
      });
      return true;
    };

    ip = function() {
      _setStatus({ updateIp: true }, plugin.settings.url);
    };

    var _init = function () {
      plugin.settings = $.extend({}, defaults, options);
    };
    _init();

    // Public methods
    return {
      subscribe : subscribeEvent,
      unsubscribe : unsubscribeEvent,
      status: _getStatus,
      ip: ip
    };
  };

})($);
