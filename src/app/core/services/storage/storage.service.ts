import { Injectable, Inject /*, Output, EventEmitter */ } from '@angular/core';
import { SESSION_STORAGE, LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
// import { WINDOW_TOKEN } from '../window/window.service';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private defaultStorage = "local";
    public SESSION_STORAGE = 'session';
    public LOCAL_STORAGE = 'local';

    constructor(
        @Inject(SESSION_STORAGE) private _session: WebStorageService,
        @Inject(LOCAL_STORAGE) private _local: WebStorageService,
        // @Inject(WINDOW_TOKEN) private _window: Window
    ) {
        // this._installChangeEventEmitter();
    }


    // @Output() public storageChange: EventEmitter<StorageEvent> = new EventEmitter();


    public has(key: string, type = this.defaultStorage) {
        return this[`_${type}`].has(key);
    }

    public get(key: string, type = this.defaultStorage) {
        return this[`_${type}`].get(key);
    }

    public getProperty(key: string, propertyKey: string, type = this.defaultStorage) {
        if (this[`_${type}`].get(key)) return this[`_${type}`].get(key)[propertyKey];
    }

    public set(key: string, value: any, type = this.defaultStorage) {
        this[`_${type}`].set(key, value);
    }


    public remove(key: string, type = this.defaultStorage) {
        return this[`_${type}`].remove(key);
    }

    public clearStorage(type = this.defaultStorage) {
        return this[`_${type}`].clear();
    }

    // private _installChangeEventEmitter() {
    //     this._window.addEventListener('storage', (event: StorageEvent) => {
    //         this.storageChange.emit(event);
    //     });
    // }
}
