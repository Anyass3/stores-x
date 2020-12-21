"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StoresX = factory());
})(void 0, function () {
  'use strict';

  function noop() {}

  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
  }

  var subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */

  function writable(value) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    var stop;
    var subscribers = [];

    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;

        if (stop) {
          // store is ready
          var run_queue = !subscriber_queue.length;

          for (var i = 0; i < subscribers.length; i += 1) {
            var s = subscribers[i];
            s[1]();
            subscriber_queue.push(s, value);
          }

          if (run_queue) {
            for (var _i = 0; _i < subscriber_queue.length; _i += 2) {
              subscriber_queue[_i][0](subscriber_queue[_i + 1]);
            }

            subscriber_queue.length = 0;
          }
        }
      }
    }

    function update(fn) {
      set(fn(value));
    }

    function subscribe(run) {
      var invalidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var subscriber = [run, invalidate];
      subscribers.push(subscriber);

      if (subscribers.length === 1) {
        stop = start(set) || noop;
      }

      run(value);
      return function () {
        var index = subscribers.indexOf(subscriber);

        if (index !== -1) {
          subscribers.splice(index, 1);
        }

        if (subscribers.length === 0) {
          stop();
          stop = null;
        }
      };
    }

    return {
      set: set,
      update: update,
      subscribe: subscribe
    };
  }

  var getMutations = function getMutations(obj, state) {
    var _obj_;

    var _loop = function _loop(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function (arg) {
        return obj[item](state, arg);
      }));
    };

    for (var item in obj) {
      _loop(item);
    }

    return _obj_;
  };

  var getActions = function getActions(obj, actionObj) {
    var _obj_;

    var _loop2 = function _loop2(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function (arg) {
        return obj[item](actionObj, arg);
      }));
    };

    for (var item in obj) {
      _loop2(item);
    }

    return _obj_;
  };

  var getGetters = function getGetters(obj, state) {
    var _obj_;

    var _loop3 = function _loop3(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function () {
        return obj[item](state);
      }));
    };

    for (var item in obj) {
      _loop3(item);
    }

    return _obj_;
  };

  var index = function index(mystores) {
    var stores = function stores(value) {
      return mystores.reduce(function (st, store) {
        return Object.assign({}, st, store[value]);
      }, {});
    };

    var storeState = stores("state");

    for (var item in storeState) {
      storeState[item] = writable(storeState[item]);
    }

    var store = writable(storeState);

    var _store_;

    store.subscribe(function (value) {
      _store_ = value;
    })();
    var mutations = getMutations(stores("mutations"), _store_),
        actions = getActions(stores("actions"), {
      dispatch: function dispatch(action) {
        (actions[action] || mutations[action])();
      },
      commit: function commit(mutation, val) {
        mutations[mutation](val);
      }
    });
    return {
      subscribe: store.subscribe,
      set: store.set,
      update: store.update,
      mutations: mutations,
      actions: actions,
      getters: getGetters(stores("getters"), _store_)
    };
  };

  return index;
});
