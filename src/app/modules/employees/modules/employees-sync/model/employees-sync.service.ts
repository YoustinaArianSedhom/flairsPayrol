import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeesSyncModel } from './employees-sync.model';

@Injectable()
export class EmployeesSyncService {
    constructor(
        private _http: HttpService
    ) {}
    

    private _endpoint = 'profiles';


    public sync(): Observable<EmployeesSyncModel> {
        return this._http.post(`${this._endpoint}/sync`, {}).pipe(
            map((res: ApiResponse<EmployeesSyncModel>) => res.result)
        )
    }


    public getSyncDetails(): Observable<EmployeesSyncModel> {
        return this._http.fetch(`${this._endpoint}/GetSyncDetails`).pipe(
            map((res: ApiResponse<EmployeesSyncModel>) => res.result)
        )
    }
}
