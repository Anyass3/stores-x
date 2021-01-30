import { writable } from 'svelte/store';

export const Writable = (value) => {
  const { subscribe, ...methods } = writable(value);

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
