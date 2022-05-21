declare function _default(mystores: any, prefix?: {}): {
    state: any;
    g: (getter: any, ...args: any[]) => any;
    commit: (mutation: any, ...args: any[]) => any;
    dispatch: (action: any, ...args: any[]) => Promise<any>;
    mutations: any;
    actions: any;
    getters: any;
};
export default _default;
