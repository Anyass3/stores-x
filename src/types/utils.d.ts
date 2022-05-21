export function createDefaultGetters(state: any, prefix: string, stores: any): {};
export function createDefaultMutations(state: any, prefix: string, stores: any, noStore: any): {};
export function createDefaultActions(state: any, prefix: any, stores: any): {};
export function getMutations(_mutations: any, state: any): any;
export function getActions(_actions: any, actionObj: any): {
    actions: any;
    dispatch: any;
    commit: any;
};
export function getGetters(_getters: any, state: any): any;
export function Dispatcher(actions: any, action: any, ...args: any[]): Promise<any>;
