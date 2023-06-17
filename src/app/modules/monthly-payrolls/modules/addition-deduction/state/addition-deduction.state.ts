import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AdditionDeductionModel, AdditionDeductionRecordsModel, AppliedAddition, AppliedDeductionModel } from '../model/addition-deduction.model';
import { AdditionDeductionService } from '../model/addition-deduction.service';
import * as actions from './addition-deduction.actions';


export class AdditionDeductionStateModel {

  public records!: AdditionDeductionRecordsModel;
  public additionTypes!: {id:number, name:string}[];
  public deductionTypes!: {id:number, name:string}[];
  public uploadedAdditions:AdditionDeductionModel[];
  public additionsSheet!: any;
  public additionsResponse: AppliedAddition[];
  public uploadedDeduction:AdditionDeductionModel[];
  public applyDeductions: AppliedDeductionModel[];
  public deletedAdditions: number
  public deletedDeductions: number

  public changedAdditions: number;
  constructor() {
    this.records = {};
    this.additionTypes = [];
    this.deductionTypes = [];
    this.changedAdditions = 0;
    this.uploadedAdditions = [];
    this.additionsSheet = null
    this.additionsResponse = [];
    this.uploadedDeduction = [];
    this.applyDeductions = [];
    this.deletedAdditions = null
    this.deletedDeductions = null
  }
}

@Injectable()
@State<AdditionDeductionStateModel>({
  name: 'additionDeduction',
  defaults: new AdditionDeductionStateModel()
})
export class AdditionDeductionState {

  constructor(private _additionDeductionService: AdditionDeductionService) { }


  @Selector()
  static records(state: AdditionDeductionStateModel): AdditionDeductionRecordsModel {
    return state.records;
  }
  @Selector()
  static additions(state: AdditionDeductionStateModel): AdditionDeductionModel[] {
    return state.records.additions;
  }
  @Selector()
  static deductions(state: AdditionDeductionStateModel): AdditionDeductionModel[] {
    return state.records.deductions;
  }

  @Selector()
  static additionTypes(state: AdditionDeductionStateModel): {id: number, name:string}[] {
    return state.additionTypes;
  }
  @Selector()
  static deductionTypes(state: AdditionDeductionStateModel): {id: number, name:string}[] {
    return state.deductionTypes;
  }

  @Selector()
  static changedAdditions(state: AdditionDeductionStateModel) {
    return state.changedAdditions;
  }

  @Selector()
  static uploadedAdditions(state: AdditionDeductionStateModel):AdditionDeductionModel[] {
    return state.uploadedAdditions;
  }

  @Selector()
  static AdditionsResponse(state: AdditionDeductionStateModel): AppliedAddition[] {
    return state.additionsResponse;
  }

  @Selector()
  static uploadedDeduction(state: AdditionDeductionStateModel): AdditionDeductionModel[] {
    return state.uploadedDeduction;
  }

  @Selector()
  static applyDeductions(state: AdditionDeductionStateModel): AppliedDeductionModel[] {
    return state.applyDeductions;
  }

  @Selector()
  static deletedAdditions(state: AdditionDeductionStateModel):number
   {
    return state.deletedAdditions;
  }

  @Selector()
  static deletedDeductions(state: AdditionDeductionStateModel):number
   {
    return state.deletedDeductions;
  }

  @Action(actions.AdditionDeductionDispatch)
  public additionDeductionDispatch(ctx:StateContext<AdditionDeductionStateModel>, {config}: actions.AdditionDeductionDispatch){
    ctx.dispatch(new actions.GetAdditionTypes())
    ctx.dispatch(new actions.GetDeductionTypes())
    console.log('config', config)
    if(config.PayrollMonth && config.PayrollYear) {
      ctx.dispatch(new actions.GetAllSalaryModifications(config))
    } else {
      console.log('this is dispatching', config)
      ctx.dispatch(new actions.GetAllSalaryModificationsForProfile(config))
    }
  }

  @Action(actions.GetAdditionTypes)
  public getAdditionTypes(ctx: StateContext<AdditionDeductionStateModel>){
    return this._additionDeductionService.getAdditionTypes().pipe(
      tap((result)=>
        ctx.patchState({
          additionTypes: result
        })
      )
    )
  }

  @Action(actions.GetDeductionTypes)
  public getDeductionTypes(ctx: StateContext<AdditionDeductionStateModel>){
    return this._additionDeductionService.getDeductionTypes().pipe(
      tap((result)=>
        ctx.patchState({
          deductionTypes: result
        })
      )
    )
  }


  @Action(actions.GetAllSalaryModificationsForProfile)
  public getAllSalaryModificationsForProfile(ctx: StateContext<AdditionDeductionStateModel>, {config}: actions.GetAllSalaryModificationsForProfile){
    return this._additionDeductionService.getAllSalaryModificationsForProfile(config.profileId, config.entityId).pipe(
      tap((result)=>
        ctx.patchState({
          records: result
        })
      )
    )
  }
  @Action(actions.GetAllSalaryModifications)
  public getAllSalaryModifications(ctx: StateContext<AdditionDeductionStateModel>, {config}: actions.GetAllSalaryModifications){
    return this._additionDeductionService.getAllSalaryModifications(config.profileId, config.entityId, config.PayrollMonth, config.PayrollYear).pipe(
      tap((result)=>
        ctx.patchState({
          records: result
        })
      )
    )
  }

  @Action(actions.AddAdditionForProfile)
  public addAdditionForProfile(ctx: StateContext<AdditionDeductionStateModel>, {addition}: actions.AddAdditionForProfile){
    return this._additionDeductionService.addAdditionForProfile(addition).pipe(
      tap((result)=>
        console.log('AddAdditionForProfile has been added', result)
      )
    )
  }

  @Action(actions.AddDeductionForProfile)
  public addDeductionForProfile(ctx: StateContext<AdditionDeductionStateModel>, {deduction}: actions.AddDeductionForProfile){
    return this._additionDeductionService.addDeductionForProfile(deduction).pipe(
      tap((result)=>
        console.log('AddDeductionForProfile has been added', result)
      )
    )
  }

  @Action(actions.EditAdditionForProfile)
  public editAdditionForProfile(ctx: StateContext<AdditionDeductionStateModel>, {addition}: actions.EditAdditionForProfile){
    return this._additionDeductionService.editAdditionForProfile(addition).pipe(
      tap((result)=>
        console.log('AddDeductionForProfile has been updated', result)
      )
    )
  }

  @Action(actions.EditDeductionForProfile)
  public editDeductionForProfile(ctx: StateContext<AdditionDeductionStateModel>, {deduction}: actions.EditDeductionForProfile){
    return this._additionDeductionService.editDeductionForProfile(deduction).pipe(
      tap((result)=>
        console.log('AddDeductionForProfile has been updated', result)
      )
    )
  }

  @Action(actions.DeleteAdditionFromProfile)
  public deleteAdditionFromProfile(ctx: StateContext<AdditionDeductionStateModel>, {id}: actions.DeleteAdditionFromProfile){
    return this._additionDeductionService.deleteAdditionFromProfile(id).pipe(
      tap((result)=>
        console.log('AddDeductionForProfile has been deleted', result)
      )
    )
  }

  @Action(actions.DeleteDeductionFromProfile)
  public deleteDeductionFromProfile(ctx: StateContext<AdditionDeductionStateModel>, {id}: actions.DeleteDeductionFromProfile){
    return this._additionDeductionService.deleteDeductionFromProfile(id).pipe(
      tap((result)=>
        console.log('AddDeductionForProfile has been deleted', result)
      )
    )
  }

  @Action(actions.ApplyAdditions)
  public ApplyAdditions(ctx: StateContext<AdditionDeductionStateModel>, {MonthlyPayrollId, File}: actions.ApplyAdditions){
    return this._additionDeductionService.applyAdditionsFromExcel(MonthlyPayrollId, File).pipe(
      tap((result:AppliedAddition[])=>{
        console.log('from state',result);

        ctx.patchState({
          additionsResponse:result
        })
      }
      )
    )
  }



  @Action(actions.GetUploadedAdditions)
  public UploadedAdditions(ctx: StateContext<AdditionDeductionStateModel>, {MonthlyPayrollId}: actions.GetUploadedAdditions){
    return this._additionDeductionService.getUploadedAdditions(MonthlyPayrollId)
    .pipe(
      tap((result:AdditionDeductionModel[])=>{
        ctx.patchState({
          uploadedAdditions: result
        })
        }
      )
    )
  }

  @Action(actions.DeleteAdditions)
  public deleteAdditions(ctx: StateContext<AdditionDeductionStateModel>, {monthlyPayrollId}: actions.DeleteAdditions) {
    return this._additionDeductionService.deleteAdditions(monthlyPayrollId)
    .pipe(
      tap((result:number)=>{
        ctx.patchState({
          deletedAdditions: result
        })
      }
      )
    )
  }

  @Action(actions.GetUploadedDeductions)
  public GetUploadedDeductions(ctx: StateContext<AdditionDeductionStateModel>, {MonthlyPayrollId}: actions.GetUploadedDeductions){
    return this._additionDeductionService.getUploadedDeductions(MonthlyPayrollId)
    .pipe(
      tap((result:AdditionDeductionModel[])=>{
        ctx.patchState({
          uploadedDeduction: result
        })
        }
      )
    )
  }

  @Action(actions.ApplyDeductionsFromExcel)
  public ApplyDeductionsFromExcel(ctx: StateContext<AdditionDeductionStateModel>, {MonthlyPayrollId, File}: actions.ApplyAdditions){
    return this._additionDeductionService.applyDeductionsFromExcel(MonthlyPayrollId, File).pipe(
      tap((result:AppliedDeductionModel[])=>{
        console.log('from state',result);

        ctx.patchState({
          applyDeductions:result
        })
      }
      )
    )
  }

  @Action(actions.DeleteDeduction)
  public DeleteDeduction(ctx: StateContext<AdditionDeductionStateModel>, {monthlyPayrollId}: actions.DeleteDeduction) {
    return this._additionDeductionService.deleteDeductions(monthlyPayrollId)
    .pipe(
      tap((result:number)=>{
        ctx.patchState({
          deletedDeductions: result
        })
      }
      )
    )
  }

}
