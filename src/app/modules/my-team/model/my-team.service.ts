import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as MY_TEAM_END_BOINTS from './my-team.config';
import * as MY_TEAM_MODELS from './my-team.models'

@Injectable({
  providedIn: 'root',
})
export class MyTeamService {
  constructor(private _http: HttpService) { }

  public getMyTeamMembers(
    pagination: PaginationConfigModel,
    filtration: MY_TEAM_MODELS.TeamFiltrationModel
  ): Observable<PaginationModel<MY_TEAM_MODELS.TeamMemberModel>> {
    return this._http
      .post(
        `${MY_TEAM_END_BOINTS.MY_TEAM_ENDPOINTS_BASE}/GetMyTeam${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map((res: ApiResponse<PaginationModel<MY_TEAM_MODELS.TeamMemberModel>>) => res.result)
      );
  }

  public getMyTeamDetails(): Observable<MY_TEAM_MODELS.TeamDetails> {
    return this._http
      .fetch(`${MY_TEAM_END_BOINTS.MY_TEAM_ENDPOINTS_BASE}/GetMyTeamDetails`)
      .pipe(map((res: ApiResponse<MY_TEAM_MODELS.TeamDetails>) => res.result));
  }

  public updateMyTeamDetails(
    teamDetails: MY_TEAM_MODELS.TeamDetails
  ): Observable<MY_TEAM_MODELS.TeamDetails> {
    return this._http
      .post(`${MY_TEAM_END_BOINTS.MY_TEAM_ENDPOINTS_BASE}/UpdateMyTeamDetails`, teamDetails)
      .pipe(map((res: ApiResponse<MY_TEAM_MODELS.TeamDetails>) => res.result));
  }
  public getMyCurrentMonthlyTeamBudget(): Observable<MY_TEAM_MODELS.CurrentBudgetModel> {
    return this._http.fetch(`${MY_TEAM_END_BOINTS.TEAM_BUDGET_ENDPOINT_BASE}/GetMyCurrentMonthlyTeamBudget`).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.CurrentBudgetModel>) => res.result)
    )
  }
  public getCurrentMonthlyTeamBudgetByProfileId(profileId: number): Observable<MY_TEAM_MODELS.CurrentBudgetModel> {
    return this._http.post(`${MY_TEAM_END_BOINTS.TEAM_BUDGET_ENDPOINT_BASE}/GetCurrentMonthlyTeamBudgetByProfileId${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.CurrentBudgetModel>) => res.result)
    )
  }
  public getProfileAssignedTeamBudget(profileId: number): Observable<MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel> {
    return this._http.post(`${MY_TEAM_END_BOINTS.TEAM_BUDGET_ENDPOINT_BASE}/GetProfileAssignedTeamBudget${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel>) => res.result)
    )
  }
  public assignTeamBudget(body: MY_TEAM_MODELS.AssignTeamBudgetFormBodyModel): Observable<MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel> {
    return this._http.post(`${MY_TEAM_END_BOINTS.TEAM_BUDGET_ENDPOINT_BASE}/AssignTeamBudget`, body).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel>) => res.result)
    )
  }

  public getLoyaltyHistoryForSubEmployee(profileId: number): Observable<MY_TEAM_MODELS.MyTeamLoyaltyBonusModel> {
    return this._http.post(`${MY_TEAM_END_BOINTS.PAYROLL_LOYALTY_BONUS_ENDPOINT_BASE}/GetLoyaltyHistoryForSubEmployee${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.MyTeamLoyaltyBonusModel>) => res.result)
    )
  }

  public exportMyTeam(filtration: MY_TEAM_MODELS.TeamFiltrationModel) {
    return this._http.post(`${MY_TEAM_END_BOINTS.MY_TEAM_ENDPOINTS_BASE}/ExportMyTeam`,{...filtration},{observe: "body",
    responseType: 'blob'})
  }
}
