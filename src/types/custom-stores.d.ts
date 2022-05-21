export function writable(value: any): {
    get: () => undefined;
    set(value: any): void;
    update(updater: (value: any) => any): void;
    subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
export function persistantStore(browserStorage: any, key: any, value: any, start: any): {
    set: (val: any, inBrowserStorage?: boolean) => void;
    update: (fn: any, inBrowserStorage?: boolean) => void;
    get: () => undefined;
    subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
export function sessionPersistantStore(_key: any): (value: any, start: any) => {
    set: (val: any, inBrowserStorage?: boolean) => void;
    update: (fn: any, inBrowserStorage?: boolean) => void;
    get: () => undefined;
    subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
export function localPersistantStore(_key: any): (value: any, start: any) => {
    set: (val: any, inBrowserStorage?: boolean) => void;
    update: (fn: any, inBrowserStorage?: boolean) => void;
    get: () => undefined;
    subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
