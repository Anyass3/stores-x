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
   * Creates a `Readable` store that allows reading by subscription.
   * @param value initial value
   * @param {StartStopNotifier}start start and stop notifications for subscriptions
   */

  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
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

  var getName = function getName(prefix, str) {
    return prefix + str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  var Getters = function Getters(state) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
    var stores = arguments.length > 2 ? arguments[2] : undefined;
    var obj = {};

    var _loop = function _loop(item) {
      if (checkDefault(stores, item, 'getters')) obj[getName(prefix, item)] = function () {
        return state[item];
      };
    };

    for (var item in state) {
      _loop(item);
    }

    return obj;
  };

  var Mutations = function Mutations(state) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'set';
    var stores = arguments.length > 2 ? arguments[2] : undefined;
    var obj = {};

    var _loop2 = function _loop2(item) {
      if (checkDefault(stores, item, 'mutations')) obj[getName(prefix, item)] = function (val) {
        return state[item]['set'](val);
      };
    };

    for (var item in state) {
      _loop2(item);
    }

    return obj;
  };

  var Actions = function Actions(mutations, prefix) {
    var obj = {};

    var _loop3 = function _loop3(item) {
      obj[prefix ? getName(prefix, item) : item] = function (_ref, val) {
        var commit = _ref.commit;
        return commit(item, val);
      };
    };

    for (var item in mutations) {
      _loop3(item);
    }

    return obj;
  };

  var getMutations = function getMutations(obj, state) {
    var _obj_;

    var _loop4 = function _loop4(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return obj[item].apply(obj, [state].concat(args));
      }));
    };

    for (var item in obj) {
      _loop4(item);
    }

    return _obj_;
  };

  var getActions = function getActions(obj, actionObj) {
    var _obj_;

    var _loop5 = function _loop5(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return obj[item].apply(obj, [actionObj].concat(args));
      }));
    };

    for (var item in obj) {
      _loop5(item);
    }

    return {
      actions: _obj_,
      dispatch: actionObj['dispatch'],
      commit: actionObj['commit']
    };
  };

  var getGetters = function getGetters(obj, state) {
    var _obj_;

    var _loop6 = function _loop6(item) {
      _obj_ = Object.assign({}, _obj_, _defineProperty({}, item, function () {
        return obj[item](state);
      }));
    };

    for (var item in obj) {
      _loop6(item);
    }

    return _obj_;
  };

  var checkDefault = function checkDefault(stores, state, type) {
    var item = stores.find(function (item) {
      return Object.keys(item.state).includes(state);
    });
    var config = item ? item.defaults !== undefined ? item.defaults : true : true;
    return typeof config === 'boolean' ? config : _typeof(config) === 'object' ? _typeof(config[state]) === 'object' ? config[state][type] !== undefined ? config[state][type] : true : config[state] !== undefined ? config[state] : true : true;
  };

  var Dispatcher = function Dispatcher(actions, action) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    return new Promise(function (resolve, reject) {
      try {
        typeof action === 'function' ? action.apply(void 0, args) : actions[action].apply(actions, args);
        resolve('OK');
      } catch (err) {
        reject(err);
      }
    });
  };

  var index = function index(mystores) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var stores = function stores(value) {
      return mystores.reduce(function (st, store) {
        return Object.assign({}, st, store[value]);
      }, {});
    };

    var storeState = stores('state');

    for (var item in storeState) {
      storeState[item] = writable(storeState[item]);
    }

    var store = readable(storeState);

    var _store_;

    store.subscribe(function (value) {
      _store_ = value;
    })();
    var mutations = Object.assign({}, Mutations(_store_, prefix.mutation, mystores), getMutations(stores('mutations'), _store_));

    var _getActions = getActions(Object.assign({}, Actions(mutations, prefix.action), stores('actions')), {
      dispatch: function dispatch(action) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        return Dispatcher.apply(void 0, [actions, action].concat(args));
      },
      commit: function commit(mutation) {
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        return mutations[mutation].apply(mutations, args);
      },
      state: _store_
    }),
        actions = _getActions.actions,
        commit = _getActions.commit,
        dispatch = _getActions.dispatch;

    return {
      state: _store_,
      subscribe: store.subscribe,
      mutations: mutations,
      actions: actions,
      getters: Object.assign({}, Getters(_store_, prefix.getter, mystores), getGetters(stores('getters'), _store_)),
      dispatch: dispatch,
      commit: commit
    };
  };

  return index;
});
