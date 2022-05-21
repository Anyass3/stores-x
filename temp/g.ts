type ExcludeFirstParameter<T extends (...args: any) => any> = T extends (
  param1,
  ...args: infer P
) => any
  ? P
  : never;

type ValueOf<T> = T[keyof T];

type GetterMethod = (...args) => any;
type MutationMethod = (...args) => void;
type ActionMethod = (...args) => Promise<any>;

// interface Store{
//     state: Record<string | number | symbol, any>;
//     getters: Record<string | number | symbol, ()=>void>;
//     mutations: Record<string | number | symbol, any>;
//     actions: Record<string | number | symbol, any>;
// }
// storeX([Store],{ getters: 'get', mutations: 'set', actions: 'set' })
// type InlineMethod<T extends Function>=T extends ()
// declare type Stores=Array<T>

type Prefix<T> = Record<'getters' | 'mutations' | 'actions', T>;

type StoreKey = 'state' | 'getters' | 'mutations' | 'actions';

type StoreValue<K> = K extends 'noStore'
  ? string[]
  : K extends 'state'
  ? any
  : K extends 'getters'
  ? GetterMethod
  : K extends 'mutations'
  ? MutationMethod
  : K extends 'actions'
  ? ActionMethod
  : never;

declare type Defaults<> =
  | boolean
  | {
      getters: boolean | Record<string, boolean>;
      mutations: boolean | Record<string, boolean>;
      actions: boolean | Record<string, boolean>;
    };

interface Store {
  defaults: Defaults;
  noStore: string[];
  state: Record<string, any>;
  getters: GetterMethod;
  mutations: MutationMethod;
  actions: ActionMethod;
}

type hi = StoreValue<'getters'>;

// declare type StoresXOptions<S,P>=(mystores: S[],prefixs: Prefix<P>)=>StoresXReturnType<typeof mystores,typeof prefixs>

// type StoresXReturnType<Stores, Prefixs>=
// declare function map<T, U>(f: (t: T) => T, ts: T[]): U[];
// sns = map((n) => n.toString(), [1, 2, 3]);
