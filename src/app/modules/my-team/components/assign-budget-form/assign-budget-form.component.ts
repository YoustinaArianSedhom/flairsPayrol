import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamMemberModel } from '@modules/my-team/model/my-team.models';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as MY_TEAM_MODELS from '@modules/my-team/model/my-team.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { AssignTeamBudget, GetMyTeamMembers } from '@modules/my-team/state/my-team.actions';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';


@Component({
  selector: 'app-assign-budget-form',
  templateUrl: './assign-budget-form.component.html',
  styleUrls: ['./assign-budget-form.component.scss']
})
export class AssignBudgetFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TeamMemberModel,
    private _dialogRef: MatDialogRef<AssignBudgetFormComponent>,
    private _store: Store,
    private _snackbar: SnackBarsService
  ) { }

  @Select(MyTeamStateSelectors.profileAssignedTeamBudget) public profileAssignedTeamBudget$: Observable<MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel>;
  public itemDetails: MY_TEAM_MODELS.ItemsDetail[];
  public errorValidation = false;
  public totalBudget= 0;
  @Dispatch() private _fireGetMyTeamMembers() { return new GetMyTeamMembers()}
  ngOnInit(): void {
    this.profileAssignedTeamBudget$.subscribe(res => {
      if (res) {
        this.itemDetails = res.itemsDetails.map(item => { this.totalBudget += item.budgetItemLimit; return { ...item, limit: item.budgetItemLimit } })
      }
    })
  }

  public onValueChange(ev:HTMLInputElement, record: MY_TEAM_MODELS.ItemsDetail) {
    this.errorValidation = false;
    this.totalBudget = 0;
    
    this.itemDetails.forEach(item => {
      if (item.budgetItemTypeId === record.budgetItemTypeId) item.limit = +ev.value ? +ev.value : 0
    })
    this.itemDetails.map(item => {
      if (item.limit < 0 || ev.value.includes('-')) {
        this.errorValidation = true
      }
      this.totalBudget += item.limit
    })

    this._validateAndCalculate();
  }

  private _validateAndCalculate() {
    this.errorValidation = false;
    this.totalBudget = 0;
    this.itemDetails.map(item => {
      if (item.limit < 0) {
        this.errorValidation = true
      }
      this.totalBudget += item.limit
    })
  }

  public submit() {
    let body:MY_TEAM_MODELS.AssignTeamBudgetFormBodyModel = {
      profileId: this.data.profileId,
      budgetItemsLimits: this.itemDetails.map(item=>{
        return {
          budgetItemTypeId: item.budgetItemTypeId,
          limit: item.limit,
        }
      })
    }

    this._store.dispatch(new AssignTeamBudget(body)).subscribe(()=>{
      this._snackbar.openSuccessSnackbar({
        message: `Budget has assigned to ${this.data.profileName}`,
        duration: 5
      })
      this._fireGetMyTeamMembers();
      this._dialogRef.close();
    },(err:ErrorEvent)=>{
      this._snackbar.openFailureSnackbar({
        message: `${err.error.errorMessage}`,
        duration: 5
      })
    })
    
  }

}
