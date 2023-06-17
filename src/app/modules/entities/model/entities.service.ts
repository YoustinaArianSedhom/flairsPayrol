import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { from, Observable, of, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';
import { country, EntityModel, GlobalAdditionModel, GlobalDeductionModel, GlobalDeductionResponse, GlobalAdditionResponse, GlobalAdditionAndDeductionModel } from './entities.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

  constructor(
    private _http: HttpService
  ) { }

  private _endpoint = 'Entities';

  public getAllEntities(pagination: PaginationConfigModel, filters): Observable<PaginationModel<EntityModel>> {
    return this._http.post(`${this._endpoint}/GetAllEntities${buildQueryString(pagination)}`, filters).pipe(
      map(({ result }: ApiResponse<PaginationModel<EntityModel>>) => {
        result.records = result.records.map(Entities => {
          const { id, name, countryId, status,
            monthlyMaximumGrossSalaryForSocialInsurance, monthlyMinimumGrossSalaryForSocialInsurance, socialInsurancePercentage, yearlyPersonalExemption, currency } = Entities;
          return { id, name, countryId, status, monthlyMaximumGrossSalaryForSocialInsurance, monthlyMinimumGrossSalaryForSocialInsurance, socialInsurancePercentage, yearlyPersonalExemption, currency }
        })
        return result;
      })
    )
  }

  public getProfilesInEntity(pagination: PaginationConfigModel, filters): Observable<PaginationModel<any>> {
    return this._http.post(`${this._endpoint}/GetProfilesInEntity${buildQueryString(pagination)}`, filters).pipe(
      map((res: ApiResponse<PaginationModel>) => {
        return res.result;
      }
      )
    )
  }

  public getEntitySummary(id: number) {
    return this._http.fetch(`${this._endpoint}/GetEntitySummary?entityId=${id}`);
  }


  public updateGlobalDeduction(globalDeduction: GlobalDeductionModel) {
    return this._http.post(`GlobalDeductions/Edit`, globalDeduction).pipe(
      map((res: ApiResponse<GlobalDeductionResponse>) => {
        return res.result;
      })
    )
  }

  public addNewEntity(entity: EntityModel) {
    return this._http.post(`${this._endpoint}/Create`, entity).pipe(
      map((res: ApiResponse<EntityModel>) => {
        return res.result;
      })
    )
  }

  public updateEntity(entity: EntityModel): Observable<EntityModel> {
    return this._http.post(`${this._endpoint}/update`, entity).pipe(
      map((res: ApiResponse<EntityModel>) => {
        return res.result;
      })
    )
  }

  public deleteEntity(id: number) {
    return this._http.post(`${this._endpoint}/Delete?entityId=${id}`);
  }

  public getAllCountries() {
    return this._http.fetch(`Countries/GetAll`).pipe(
      map((res: ApiResponse<country[]>) => {
        return res.result;
      })
    )
  }


  public getGlobalDeductions(entityId: number) {
    return this._http.fetch(`GlobalDeductions/GetByEntityId${buildQueryString({ entityId })}`);
  }

  public addNewGlobalDeduction(globalDeduction: GlobalDeductionModel) {
    return this._http.post(`GlobalDeductions/Add`, globalDeduction).pipe(
      map((res: ApiResponse<GlobalDeductionResponse>) => {
        return res.result;
      })
    )
  }

  public deleteGlobalDeduction(globalDeductionId: number) {
    return this._http.post(`GlobalDeductions/Delete${buildQueryString({ globalDeductionId })}`, {}).pipe(
      map((res: ApiResponse<GlobalDeductionResponse>) => {
        return res.result;
      })
    )
  }

  /* _____________________ Global Additions API _____________________ */

  // Get Addition By Id 
  public getGlobalAdditions(entityId: number) {
    return this._http.fetch(`GlobalAdditions/GetByEntityId${buildQueryString({ entityId })}`);
  }

  public addNewGlobalAddition(globalAddition: GlobalAdditionModel): Observable<GlobalAdditionModel> {
    return this._http.post(`GlobalAdditions/Add`, globalAddition).pipe(
      map((res: ApiResponse<GlobalAdditionModel>) => {
        return res.result;
      })
    )
  }

  public editGlobalAddition(globalAddition: GlobalAdditionModel) {
    return this._http.post(`GlobalAdditions/Edit`, globalAddition).pipe(
      map((res: ApiResponse<GlobalAdditionModel>) => {
        return res.result;
      })
    )
  }

  public deleteGlobalAddition(globalAdditionId: number): Observable<boolean> {
    return this._http.post(`GlobalAdditions/Delete${buildQueryString({ globalAdditionId })}`, {}).pipe(
      map((res: ApiResponse<boolean>) => {
        return res.result;
      })
    )
  }


  /* _____________________ Get Global Deductions & Additions _____________________ */

  //api/GlobalAdditionDeduction/GetByEntityId

  // Get Table Addition and Deduction
  public getGlobalAdditionDeduction(entityId: number): Observable<GlobalAdditionAndDeductionModel[]> {
    return this._http.fetch(`GlobalAdditionDeduction/GetByEntityId${buildQueryString({ entityId })}`).pipe(
      map((res: ApiResponse<GlobalAdditionAndDeductionModel[]>) => res.result)
    )
  }

  // public getCountryNameById(id:number) {

  // }

}
