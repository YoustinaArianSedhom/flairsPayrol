import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { LayoutService } from '@modules/layout/model/layout.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ManagerWithSubModel, PayslipModel, PayslipsFiltrationModel, PayslipsProfileModel, PayslipsSummaryModel, TeamPayslipsAggregatesResultModel } from './payslips.model';

@Injectable()
export class PayslipsService {

  constructor(
    private _http: HttpService,
    private _layout: LayoutService
  ) { }

  private _endpoint = 'Payslip';
  private _profileEndPoint = 'Profiles';



  public getMyPayslips(pagination: PaginationConfigModel): Observable<PaginationModel<PayslipModel>> {
    return this._http.fetch(`${this._endpoint}/GetMyPayslips${buildQueryString(pagination)}`).pipe(
      map((res: ApiResponse<PaginationModel<PayslipModel>>) => res.result)
    )
  }

  public getMyPayslipsSummary(): Observable<PayslipsSummaryModel> {
    return this._http.fetch(`${this._endpoint}/GetMyPayslipsSummary`).pipe(
      map((res: ApiResponse<PayslipsSummaryModel>) => res.result),
      tap((res) => this._layout.setTitle('My payslip'))
    )
  }


  public getProfilePayslips(config: PayslipsProfileModel, pagination: PaginationConfigModel): Observable<PaginationModel<PayslipModel>> {
    return this._http.fetch(`${this._endpoint}/GetProfilePayslips${buildQueryString({...config, ...pagination})}`).pipe(
      map((res: ApiResponse<PaginationModel<PayslipModel>>) => res.result)
    )
  }

  public getProfilePayslipsSummary(config: PayslipsProfileModel): Observable<PayslipsSummaryModel> {
    console.log(config);
    
    return this._http.fetch(`${this._endpoint}/GetProfilePayslipsSummary${buildQueryString(config)}`).pipe(
      map((res: ApiResponse<PayslipsSummaryModel>) => res.result),
      tap((res) => this._layout.setTitle(res.profileName + 'Payslips'))
    )
  }


  public getTeamPayslips(filtration: PayslipsFiltrationModel, pagination: PaginationConfigModel): Observable<PaginationModel<PayslipModel>> {
    return this._http.post(`${this._endpoint}/GetTeamPayslips${buildQueryString(pagination)}`, filtration).pipe(
      map((res: ApiResponse<PaginationModel<PayslipModel>>) => res.result),
      tap((res) => this._layout.setTitle('Team Payslip'))
    )
  }

  public getLastPublishedPayrollDate(): Observable<Date> {
    return this._http.fetch(`${this._endpoint}/GetLastPublishedPayrollDate`).pipe(
      map((res: ApiResponse<Date>) => res.result)
    )
  }


  public exportTeamPayslipsAsExcel(exportDate: PayslipsFiltrationModel): any {
    return this._http.post(`${this._endpoint}/ExportTeamPayslipsAsExcel`, exportDate, {responseType: 'blob'}).pipe(
      map(data =>{ return data;})
      );
  }
  public exportProfilePayslipsAsExcel(profileId: number): any {
    return this._http.post(`${this._endpoint}/ExportProfilePayslipsAsExcel`, {profileId}, {responseType: 'blob'}).pipe(
      map(data =>{ return data;})
      );
  }
  public getTeamPayslipsAggregates(filtration: PayslipsFiltrationModel): Observable<TeamPayslipsAggregatesResultModel> {
    return this._http.post(`${this._endpoint}/GetTeamPayslipsAggregates`, filtration).pipe(
      map((res: ApiResponse<TeamPayslipsAggregatesResultModel>) => res.result)
      );
  }
  public findSubsWithManagerRoles(): Observable<ManagerWithSubModel[]> {
    return this._http.fetch(`${this._profileEndPoint}/FindSubsWithManagerRoles`).pipe(
      map((res: ApiResponse<ManagerWithSubModel[]>) => res.result)
    )
  }
}
