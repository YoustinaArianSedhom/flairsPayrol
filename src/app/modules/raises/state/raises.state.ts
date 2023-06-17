import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { RaisesService } from './../model/raises.service';
import { RaisesFilterationModel, RaisesModel } from './../model/raises';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from 'rxjs/operators';
import { PaginationModel } from '@core/http/apis.model';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as RAISES_ACTION from './raises.action';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class RaisesStateModel {
  public raises: RaisesModel[];
  public filter: RaisesFilterationModel
  public raisesPagination: PaginationConfigModel;


  constructor() {
    this.raises = []
    this.filter = {
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    }
    this.raisesPagination = {
      pageNumber: 0,
      pageSize: 10
    }
  }
}

@Injectable()
@State<RaisesStateModel>({
  name: 'Raises',
  defaults: new RaisesStateModel(),
})

export class RaisesState {

  constructor(private _raisesService: RaisesService) { }

  @Selector() static raises(state: RaisesStateModel): RaisesModel[] {
    return state.raises;
  }

  @Selector() static filter(state: RaisesStateModel): RaisesFilterationModel {
    return state.filter
  }

  @Selector() static raisesPagination(state: RaisesStateModel): PaginationConfigModel {
    return state.raisesPagination;
  }

  @Action(RAISES_ACTION.GetMyRaisesRequest)
  public getMyRaisesRequest({ getState, patchState }: StateContext<RaisesStateModel>) {
    const { raisesPagination: { pageNumber, pageSize }, filter } = getState();
    return this._raisesService.getRaiseRequests({ pageNumber, pageSize }, filter).pipe(
      tap(({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<RaisesModel>) => patchState({
        raises: records,
        raisesPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(RAISES_ACTION.ExportRaisesDataToExcel)
  public ExportRaisesDataToExcel({ getState }: StateContext<RaisesStateModel>) {
     const { filter } = getState();
     return this._raisesService.exportRaiseRequestReport(filter).pipe(
        tap((res: Blob) => {
           downloadFile(res, 'Raises-Data', res.type)
        })
     )
  }

  @Action(RAISES_ACTION.FilterMyRaises)
  public FilterMyRaises({ dispatch, patchState }: StateContext<RaisesStateModel>, { filteration }: RAISES_ACTION.FilterMyRaises) {
    patchState({
      filter: filteration, raisesPagination: {
        pageNumber: 0,
        pageSize: 10
      }
    });
    dispatch(new RAISES_ACTION.GetMyRaisesRequest())
  }

  @Action(RAISES_ACTION.PaginateMyRaises)
  public PaginateMyRaises({ dispatch, patchState }: StateContext<RaisesStateModel>, { pagination }: RAISES_ACTION.PaginateMyRaises) {
    patchState({ raisesPagination: pagination });
    dispatch(new RAISES_ACTION.GetMyRaisesRequest())
  }

  @Action(RAISES_ACTION.ResetFilterRaises)
  public ClearFilterRaises({ patchState, dispatch }: StateContext<RaisesStateModel>) {
    patchState({
      filter: {
          month: new Date().getMonth(),
          year: new Date().getFullYear()
      },
      raisesPagination: {
        pageNumber: 0,
        pageSize: 10
      }
    })
    dispatch(new RAISES_ACTION.GetMyRaisesRequest())
  }
}