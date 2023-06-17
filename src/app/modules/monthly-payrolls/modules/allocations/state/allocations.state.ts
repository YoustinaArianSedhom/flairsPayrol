import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import * as actions from './allocations.actions';
import { AllocationService } from '../model/allocations.service';
import { AppliedAllocation } from '../model/allocations.model';


export class AllocationsStateModel {
  public records!: any;
  public AllocationsSheet!: any;
  public AllocationsResponse!: any;
  public monthlyPayrollId!: any;
  public changedAllocations: number;
  public uploadedAllocations: AppliedAllocation[];

  constructor(
    
  ) {
    this.records = [];
    this.AllocationsSheet = null;
    this.AllocationsResponse = null;
    this.monthlyPayrollId = null;
    this.changedAllocations = 0;
    this.uploadedAllocations= null;
  }
}

@Injectable()
@State<AllocationsStateModel>({
  name: 'allocations',
  defaults: new AllocationsStateModel()
})
export class AllocationsState {

  constructor(
    private _allocationsService: AllocationService
  ) { }

  @Selector()
  static AllocationsSheet(state: AllocationsStateModel) {
    return state.AllocationsSheet;
  }
  @Selector()
  static AllocationsResponse(state: AllocationsStateModel) {
    return state.AllocationsResponse;
  }
  @Selector()
  static monthlyPayrollId(state: AllocationsStateModel) {
    return state.monthlyPayrollId;
  }
  @Selector()
  static changedAllocations(state: AllocationsStateModel) {
    return state.changedAllocations;
  }
  @Selector()
  static uploadedAllocations(state: AllocationsStateModel) {
    return state.uploadedAllocations;
  }


  @Action(actions.AddAllocations)
  public addAllocations(ctx: StateContext<AllocationsStateModel>, {MonthlyPayrollId, AllocationsSheet, options}: actions.AddAllocations) {
    const form = new FormData();
    form.append("AllocationsSheet", AllocationsSheet);
    ctx.patchState({
      AllocationsSheet : AllocationsSheet
    })
    return this._allocationsService.addAllocations(MonthlyPayrollId, AllocationsSheet, options)
    .pipe(
      tap((result)=>
        ctx.patchState({
          AllocationsResponse: result
        })
      )
    )
  }



  @Action(actions.ApplyAllocations)
  public applyAllocations(ctx: StateContext<AllocationsStateModel>, {MonthlyPayrollId, AllocationsSheet}: actions.ApplyAllocations){
    return this._allocationsService.applyAllocations(MonthlyPayrollId, AllocationsSheet).pipe(
      tap((result:any)=>
        ctx.patchState({
          changedAllocations: result.length
        })
      )
    )
  }
  @Action(actions.DeleteAllocations)
  public deleteAllocations(ctx: StateContext<AllocationsStateModel>, {monthlyPayrollId}: actions.DeleteAllocations){
    return this._allocationsService.deleteAllocations(monthlyPayrollId)
    .pipe(
      tap((result:any)=>
        ctx.patchState({
          changedAllocations: result
        })
      )
    )
  }

  @Action(actions.GetUploadedAllocations)
  public getUploadedAllocations(ctx: StateContext<AllocationsStateModel>, {payrollId}: actions.GetUploadedAllocations){
    return this._allocationsService.getUploadedAllocations(payrollId)
    .pipe(
      tap((result:AppliedAllocation[])=>{
        ctx.patchState({
          uploadedAllocations: result
        })
        }
      )
    )
  }

}
