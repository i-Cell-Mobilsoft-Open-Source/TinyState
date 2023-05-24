import 'reflect-metadata';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { get as _get, set as _set } from 'lodash-es';

/**
 * Decorate class to be state handler and store
 */
export function TinyHandler<T>(persist: boolean | Storage = false, type?: new () => T) {
  return (stateHandler: Function) => {
    if (persist === true) throw Error('`persist` must be a `Storage`');
    if (typeof persist !== 'boolean' && !(persist instanceof Storage)) throw Error('`persist` must be a `Storage`');
    Reflect.defineMetadata('tiny-state:handler', { persist, type: typeof type }, stateHandler);
    const tiny = TinyStateService.getInstance();
    tiny.addStateHandler(stateHandler);
  };
}

/**
 * Decorate function to be a state selector
 * @param path the path inside the state
 */
export function TinySelector(path?: string) {
  return (target: Object, key: string | symbol) => {
    Reflect.defineMetadata('tiny-state:selector', { path }, target, key);
    Reflect.defineMetadata('tiny-state:selector', { path, parent: target }, target[key]);
  };
}

/**
 * Here is the magic!
 * Decorate property to select from state.
 * The property will be a `BehaviourSubject`
 * @param fn function decorated to be a `@TinySelector`
 */
export function TinySelect(fn: Function) {
  return (target: Object, key: string | symbol) => {
    Reflect.defineMetadata('tiny-state:select', true, target, key);

    const selectorMeta = Reflect.getOwnMetadata('tiny-state:selector', fn);
    const stateHandler = selectorMeta.parent;
    const selectorPath = selectorMeta.path;
    const handlerType = Reflect.getMetadata('tiny-state:handler', stateHandler.prototype.constructor);
    console.log(handlerType);
    const handlerName = stateHandler.prototype.constructor.name;
    const tiny = TinyStateService.getInstance();
    let storedSelector: (target) => void;

    // check if we alread have a selector to use
    if (tiny.hasSelector(stateHandler, `${handlerName}.${fn.name}`)) {
      storedSelector = tiny.getSelector(stateHandler, `${handlerName}.${fn.name}`);
    } else {
      storedSelector = (target) => {
        const stateHandler = selectorMeta.parent;
        let subject: BehaviorSubject<any>;

        // check if we already have a subject to populate, if not create and store
        subject = tiny.getSelectorSubject(stateHandler, `${handlerName}.${fn.name}`);
        if (!subject) {
          subject = new BehaviorSubject<any>(null);
          tiny.storeSelectorSubject(stateHandler, `${handlerName}.${fn.name}`, subject);
        }

        // replace the original field with a property
        Object.defineProperty(target, key, {
          // returns the `BehaviorSubject`
          get() {
            const tiny = TinyStateService.getInstance();
            const stateHandler = selectorMeta.parent;
            if (!tiny.checkStateHandler(stateHandler)) {
              tiny.initState(stateHandler);
            }
            const state = selectorPath ? _get(tiny.getState(stateHandler), selectorPath) : tiny.getState(stateHandler);
            const result = fn(state);
            subject.next(result);
            return subject;
          },

          // set new value
          set(value) {
            const tiny = TinyStateService.getInstance();
            const stateHandler = selectorMeta.parent;
            let state = tiny.getState(stateHandler);
            if (state === null) {
              state = {};
            }
            if (selectorPath) {
              _set(state, selectorPath, value);
            } else {
              state = value;
            }
            tiny.persist(stateHandler, state);
            subject.next(value);
          },
          enumerable: true,
          configurable: true,
        });
      };

      // soting selector
      tiny.storeSelector(stateHandler, `${handlerName}.${fn.name}`, storedSelector);
    }
    storedSelector(target);
  };
}

@Injectable()
export class TinyStateService {
  private static instance: TinyStateService;
  private storage: Map<string | symbol, Map<string | symbol, any>> = new Map();

  constructor() {}

  private getHandlerName(stateHandler: any) {
    return stateHandler.prototype.constructor.name;
  }

  public getState(stateHandler: any) {
    const stateMap = this.getStoreMap(stateHandler);
    return stateMap.get('state');
  }

  public getStoreMap(stateHandler: any) {
    const stateHandlerName = this.getHandlerName(stateHandler);
    const storeMap = this.storage.get(stateHandlerName);
    return storeMap;
  }

  private setStoreMap(stateHandler: any, storeMap: Map<string | symbol, any>) {
    const handlerName = this.getHandlerName(stateHandler);
    this.storage.set(handlerName, storeMap);
  }

  public createStore(identifier: string | symbol, value: any) {
    this.setStoreMap(identifier, value);
  }

  public storeSelector(stateHandler: any, identifier: string | symbol, value: any) {
    const storeMap: Map<string | symbol, any> = this.getStoreMap(stateHandler);
    storeMap.set(identifier, value);
  }

  public storeSelectorSubject(stateHandler: any, identifier: string | symbol, subject: any) {
    const storeMap: Map<string | symbol, any> = this.getStoreMap(stateHandler);
    storeMap.set(`${identifier as string}:subject`, subject);
  }

  public getSelectorSubject(stateHandler: any, identifier: string | symbol) {
    const storeMap: Map<string | symbol, any> = this.getStoreMap(stateHandler);
    return storeMap.get(`${identifier as string}:subject`);
  }

  public getSelector(stateHandler: any, identifier: string | symbol) {
    const storeMap: Map<string | symbol, any> = this.getStoreMap(stateHandler);
    return storeMap.get(identifier);
  }

  public hasSelector(stateHandler: any, identifier: string | symbol) {
    const storeMap: Map<string | symbol, any> = this.getStoreMap(stateHandler);
    return storeMap.has(identifier);
  }

  public initState(stateHandler: any) {
    const stateHandlerName = this.getHandlerName(stateHandler);
    const storeMap = new Map();
    storeMap.set('state', new stateHandler().initialState);
    this.createStore(stateHandler, storeMap);
  }

  public checkStateHandler(stateHandler: any): boolean {
    try {
      const stateHandlerName = this.getHandlerName(stateHandler);
      if (!!!Reflect.getMetadata('tiny-state:handler', stateHandler)) {
        throw new Error('Not a TinyStateHandler');
      }
      if (Array.from(this.storage.keys()).includes(stateHandlerName)) {
        throw new Error('TinyStateHandler already in use');
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  public addStateHandler(stateHandler: any) {
    if (!this.checkStateHandler(stateHandler)) {
      this.initState(stateHandler);
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new TinyStateService();
    }
    return this.instance;
  }

  public getInstance() {
    return TinyStateService.getInstance();
  }

  public persist(stateHandler: any, state: any) {
    const handlerMeta = Reflect.getMetadata('tiny-state:handler', stateHandler);
    const handlerName = this.getHandlerName(stateHandler);
    const stateMap = this.getStoreMap(stateHandler);
    stateMap.set('state', state);
    if (handlerMeta.persist) {
      (handlerMeta.persist as Storage).setItem(`${handlerName}:state`, JSON.stringify(state));
    }
  }
}
