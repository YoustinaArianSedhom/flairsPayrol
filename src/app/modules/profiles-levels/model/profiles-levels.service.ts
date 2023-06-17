import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileLevelSummary, ProfilesLevelsSummariesFiltrationModel, updateEmployeePersonalInfoConfigModel, UpdateProfileLevelConfigModel } from './profiles-levels.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesLevelsService {

  constructor(
    private _http: HttpService
  ) {}

  private _endpoint = 'HumanResources';



  public getProfilesLevelsSummaries(pagination: PaginationConfigModel, filtration: ProfilesLevelsSummariesFiltrationModel): Observable<PaginationModel<ProfileLevelSummary>> {
    return this._http.post(`${this._endpoint}/GetProfileLevelSummaries${buildQueryString(pagination)}`, filtration).pipe(
      map((res: ApiResponse<PaginationModel<ProfileLevelSummary>>) => res.result)
    )
  }

  public updateProfileLevel(config: UpdateProfileLevelConfigModel): Observable<ProfileLevelSummary> {
    return this._http.post(`${this._endpoint}/UpdateProfileLevel`, config).pipe(
      map((res: ApiResponse<ProfileLevelSummary>) => res.result)
    )
  }


  public UpdatePersonalInfo(config: updateEmployeePersonalInfoConfigModel): Observable<ProfileLevelSummary> {
    return this._http.post(`${this._endpoint}/UpdatePersonalInfo`, config).pipe(
      map((res: ApiResponse<ProfileLevelSummary>) => res.result)
    )
  }
}
