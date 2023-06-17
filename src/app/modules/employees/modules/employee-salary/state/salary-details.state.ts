import { Injectable } from '@angular/core';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { SalaryDetailsService } from '../model/salary-details.service';
import * as SALARY_DETAILS_Models from '@modules/employees/modules/employee-salary/model/salary-details.model';
import * as SALARY_DETAILS_ACTIONS from '@modules/employees/modules/employee-salary/state/salary-details.actions';

export class SalaryDetailsStateModel {
  public personalInfo: SALARY_DETAILS_Models.EmployeePersonalInfo;
  public bankInfo: SALARY_DETAILS_Models.BankInfo;
  public payrollInfo: SALARY_DETAILS_Models.PayrollInfo;
  public entityInfo: SALARY_DETAILS_Models.JoinedEntityModel[];
  public entitiesHistory: SALARY_DETAILS_Models.JoinedEntityModel[];
  public suspensionReasons: SALARY_DETAILS_Models.SuspensionReasonsModel[];
  public suspensionDetails: SALARY_DETAILS_Models.SuspensionDetailsModel


}

@Injectable()
@State<SalaryDetailsStateModel>({
  name: 'salaryDetails',
})
export class SalaryDetailsState {

  constructor(
    private _salaryDetailsService: SalaryDetailsService
  ) { }




  @Selector()
  static personalInfo(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.EmployeePersonalInfo {
    return state.personalInfo;
  }
  @Selector()
  static bankInfo(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.BankInfo {
    return state.bankInfo;
  }
  @Selector()
  static payrollInfo(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.PayrollInfo {
    return state.payrollInfo;
  }
  @Selector()
  static entityInfo(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.JoinedEntityModel[] {
    return state.entityInfo;
  }
  @Selector()
  static entitiesHistory(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.JoinedEntityModel[] {
    return state.entitiesHistory;
  }
  @Selector()
  static suspensionReasons(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.SuspensionReasonsModel[] {
    return state.suspensionReasons;
  }

  @Selector()
  static suspensionDetails(state: SalaryDetailsStateModel): SALARY_DETAILS_Models.SuspensionDetailsModel {
    return state.suspensionDetails
  }

  @Action(SALARY_DETAILS_ACTIONS.GetPersonalInfo)
  public getPersonalInfo(ctx: StateContext<SalaryDetailsStateModel>, { id }: SALARY_DETAILS_ACTIONS.GetPersonalInfo) {
    return this._salaryDetailsService.getPersonalInfo(id).pipe(
      tap((personalInfo: SALARY_DETAILS_Models.EmployeePersonalInfo) => ctx.patchState({
        personalInfo
      }))
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.GetBankInfo)
  public getBankInfo(ctx: StateContext<SalaryDetailsStateModel>, { id }: SALARY_DETAILS_ACTIONS.GetBankInfo) {
    return this._salaryDetailsService.getBankInfo(id).pipe(
      tap((bankInfo: SALARY_DETAILS_Models.BankInfo) => ctx.patchState({
        bankInfo
      }))
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.GetPayrollInfo)
  public getPayrollInfo(ctx: StateContext<SalaryDetailsStateModel>, { id }: SALARY_DETAILS_ACTIONS.GetPayrollInfo) {
    return this._salaryDetailsService.getPayrollInfo(id).pipe(
      // catchError(err => {
      //   console.log('error', err)
      //   ctx.patchState({payrollInfo: null})
      //   return of('')
      // }),
      tap((payrollInfo: SALARY_DETAILS_Models.PayrollInfo) => {
        if (payrollInfo) { ctx.patchState({ payrollInfo: payrollInfo.result }) }
        else ctx.patchState({ payrollInfo: null })
      }
      )
    )
  }


  @Action(SALARY_DETAILS_ACTIONS.GetEntitiesInfo)
  public getEntitiesInfo(ctx: StateContext<SalaryDetailsStateModel>, { id }: SALARY_DETAILS_ACTIONS.GetEntitiesInfo) {
    return this._salaryDetailsService.getEntitiesInfo(id).pipe(
      // catchError(err => {
      //   console.log('GetEntitiesInfo error ', err)
      //   ctx.patchState({entityInfo: null})
      //   return of('')
      // }),
      // switchMap((res) => res.status === 204 ? of([]) : of(res)),
      tap((joinedEntities: any) => {
        if (joinedEntities) { ctx.patchState({ entityInfo: joinedEntities.result }) }
        else ctx.patchState({ entityInfo: null })
      })
    )
  }


  @Action(SALARY_DETAILS_ACTIONS.GetEntitiesHistory)
  public GetEntitiesHistory(ctx: StateContext<SalaryDetailsStateModel>, { id }: SALARY_DETAILS_ACTIONS.GetEntitiesHistory) {
    return this._salaryDetailsService.getEntitiesHistory(id).pipe(
      // catchError(err => {
      //   console.log('GetEntitiesInfo error ', err)
      //   ctx.patchState({entityInfo: null})
      //   return of('')
      // }),
      // switchMap((res) => res.status === 204 ? of([]) : of(res)),
      tap((joinedEntitiesHistory: any) => {
        if (joinedEntitiesHistory) { ctx.patchState({ entitiesHistory: joinedEntitiesHistory.result }) }
        else ctx.patchState({ entitiesHistory: null })
      })
    )
  }


  @Action(SALARY_DETAILS_ACTIONS.UpdateEmployeeBankDetails)
  public updateEmployeeBandDetails(ctx: StateContext<SalaryDetailsStateModel>, { bankDetails }: SALARY_DETAILS_ACTIONS.UpdateEmployeeBankDetails) {
    return this._salaryDetailsService.updateEmployeeBankDetails(bankDetails).pipe(
      tap((returnedBankInfo: EmployeeModel) => ctx.patchState({
        // bankInfo: {
        //   bankAccountName: employee.bankAccountName, 
        //   bankName: employee.bankName, 
        //   bankAccountNumber: employee.bankAccountNumber},
        bankInfo: { ...ctx.getState().bankInfo, ...returnedBankInfo }
      }))
    )
  }


  @Action(SALARY_DETAILS_ACTIONS.UpdateEmployeePersonalInfo)
  public updateEmployeePersonalInfo(ctx: StateContext<SalaryDetailsStateModel>, { personalInfo }: SALARY_DETAILS_ACTIONS.UpdateEmployeePersonalInfo) {
    return this._salaryDetailsService.updateEmployeePersonalInfo(personalInfo).pipe(
      tap((returnedPersonalInfo: SALARY_DETAILS_Models.EmployeePersonalInfo) => ctx.patchState({
        personalInfo: { ...ctx.getState().personalInfo, ...returnedPersonalInfo }
      }))
    )
  }



  @Action(SALARY_DETAILS_ACTIONS.JoinEntity)
  public joinEntity(ctx: StateContext<SalaryDetailsStateModel>, { entity }: SALARY_DETAILS_ACTIONS.JoinEntity) {
    return this._salaryDetailsService.joinEntity(entity).pipe(
      tap((entityInfo: SALARY_DETAILS_Models.JoinedEntityModel) => {
        ctx.patchState({ entityInfo: [entityInfo] })
        ctx.dispatch(new SALARY_DETAILS_ACTIONS.GetPayrollInfo(entity.profileId))
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.UpdateJoinedEntityInfo)
  public updateJoinedEntityInfo(ctx: StateContext<SalaryDetailsStateModel>, { entity }: SALARY_DETAILS_ACTIONS.UpdateJoinedEntityInfo) {
    return this._salaryDetailsService.updateEntity(entity).pipe(
      tap((entityInfo: SALARY_DETAILS_Models.JoinedEntityModel) => {
        ctx.patchState({ entityInfo: [entityInfo] })
        ctx.dispatch(new SALARY_DETAILS_ACTIONS.GetPayrollInfo(entity.profileId))
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.LeaveEntity)
  public leaveEntity(ctx: StateContext<SalaryDetailsStateModel>, { config }: SALARY_DETAILS_ACTIONS.LeaveEntity) {
    return this._salaryDetailsService.leaveEntity(config).pipe(
      tap(() => {
        ctx.dispatch(new SALARY_DETAILS_ACTIONS.GetEntitiesInfo(config.profileId))
        ctx.dispatch(new SALARY_DETAILS_ACTIONS.GetEntitiesHistory(config.profileId))
      }),
      tap(() => {
        ctx.patchState({
          payrollInfo: null
        })
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.SuspendSalary)
  public suspendSalary(ctx: StateContext<SalaryDetailsStateModel>, {suspendSalary}: SALARY_DETAILS_ACTIONS.SuspendSalary){
    return this._salaryDetailsService.suspendSalary(suspendSalary).pipe(
      tap((res) => {
        return res
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.GetSalarySuspensionReasons)
  public setSalarySuspensionReasons({patchState}: StateContext<SalaryDetailsStateModel>){
    return this._salaryDetailsService.getSalarySuspensionReasons().pipe(
      tap((suspensionReasons) => {
        patchState({
          suspensionReasons
        })
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.GetSuspensionDetails)
  public getSuspensionDetails({patchState}: StateContext<SalaryDetailsStateModel>, {personalInfoId}: SALARY_DETAILS_ACTIONS.GetSuspensionDetails) {
    return this._salaryDetailsService.getSuspensionDetails(personalInfoId).pipe(
      tap((suspensionDetails) => {
        patchState({
          suspensionDetails
        })
      })
    )
  }

  @Action(SALARY_DETAILS_ACTIONS.UnSuspendSalary)
  public unSuspendSalary(ctx: StateContext<SalaryDetailsStateModel>, {unSuspendSalary}: SALARY_DETAILS_ACTIONS.UnSuspendSalary){
    return this._salaryDetailsService.unSuspendSalary(unSuspendSalary).pipe(
      tap((res) => {
        return res
      })
    )
  }
  
}
