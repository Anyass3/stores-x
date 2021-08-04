import { writable as _writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

export const writable = (value) => {
  const { subscribe, ...methods } = _writable(value);

  const get = () => {
    let value;
    subscribe((val) => {
      value = val;
    })();

    return value;
  };

  return {
    subscribe,
    ...methods,
    get,
  };
};

export const persistantStore = (browserStorage, key, value, start) => {
  try {
    const _val = JSON.parse(browserStorage.getItem(key));
    value = _val === null ? value : _val;
  } catch (error) {
    //
  }
  let { set: _set, ...rest } = writable(value, start);
  const set = (val, inBrowserStorage = true) => {
    if (inBrowserStorage) browserStorage.setItem(key, JSON.stringify(val));
    _set(val);
  };
  const update = (fn, inBrowserStorage = true) => {
    let val = rest.get();
    if (!val) {
      try {
        val = JSON.parse(browserStorage.getItem(key));
      } catch (error) {
        //
      }
    }
    set(fn(val), inBrowserStorage);
  };

  return { ...rest, set, update };
};

export const sessionPersistantStore = (_key) => {
  const key = 'sessionStore-' + _key;
  if (browser) return (value, start) => persistantStore(sessionStorage, key, value, start);
};

export const localPersistantStore = (_key) => {
  const key = 'localStore-' + _key;
  if (browser) return (value, start) => persistantStore(localStorage, key, value, start);
};
