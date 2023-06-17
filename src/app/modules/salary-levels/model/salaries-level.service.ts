import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SalaryLevelFormComponent } from '../components/salary-level-form/salary-level-form.component';
import { SalaryLevelModel } from './salaries-level.model';

@Injectable({
  providedIn: 'root'
})
export class SalariesLevelService {

  constructor(
    private _http: HttpService,
    private _matDialog: MatDialog
  ) { }

  private _endpoint = 'SalaryLevels';

  public get(pagination: PaginationConfigModel, config): Observable<PaginationModel<SalaryLevelModel>> {
    // return this._http.fetch(this._endpoint)
    return this._http.post(`${this._endpoint}/GetSalaryLevels${buildQueryString(pagination)}`, config).pipe(
      map(({ result }: ApiResponse<PaginationModel<SalaryLevelModel>>) => {
        result.records = result.records.map(salaryLevel => {
          const { name, from, to, description, id } = salaryLevel;
          return { name, from, to, description, id }
        })
        return result;
      })

    )

  }


  public create(record: SalaryLevelModel): Observable<SalaryLevelModel> {
    return this._http.post(`${this._endpoint}/CreateSalaryLevel`, record).pipe(
      map((res: ApiResponse<SalaryLevelModel>) => {
        return res.result;
      })
    )
  }


  public update(record: SalaryLevelModel): Observable<SalaryLevelModel> {
    return this._http.post(`${this._endpoint}/UpdateSalaryLevel`, record).pipe(
      map((res: ApiResponse<SalaryLevelModel>) => {
        return res.result;
      })
    )
  }


  public remove(id: number) {
    return this._http.post(`${this._endpoint}/DeleteSalaryLevel${buildQueryString({ id })}`);
  }







  /**
   * @param salaryLevel - salary level record to be edited
   */
  public openSalaryLevelForm(salaryLevel?: SalaryLevelModel) {
    this._matDialog.open(SalaryLevelFormComponent, {
      data: salaryLevel || {},
    })
  }

}
