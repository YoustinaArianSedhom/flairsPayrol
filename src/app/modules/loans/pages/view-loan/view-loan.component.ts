import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetLoanByIDResponseModel } from '@modules/loans/model/loans.models';
import { ApplyDraftLoan, DeleteLoan, GetById } from '@modules/loans/state/loans.actions';
import { LoansState } from '@modules/loans/state/loans.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LOANS_MODEL from '@modules/loans/model/loans.models';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { SelectSnapshot, ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import {Location} from '@angular/common';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { OrgConfigInst } from '@core/config/organization.config';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';



@Component({
  selector: 'app-view-loan',
  templateUrl: './view-loan.component.html',
  styleUrls: ['./view-loan.component.scss']
})
export class ViewLoanComponent implements OnInit {

  public pageTitle = 'View Loan Details';
  public id: number;
  @Select(LoansState.loanPaymentPlan) public paymentPlan$: Observable<LOANS_MODEL.PaymentPlanModel>;
  @ViewSelectSnapshot(LoansState.loanPaymentPlan) public paymentPlan: LOANS_MODEL.PaymentPlanModel;
  @SelectSnapshot(LoansState.loan) public loanData$: GetLoanByIDResponseModel;
  @Select(LoansState.applyDraftLoan) public applyDraftLoan$: Observable<GetLoanByIDResponseModel>;
  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  constructor(
    private _route: ActivatedRoute, 
    private _location: Location, 
    private _snackbarService:SnackBarsService,
    private _store: Store,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this._route.params.subscribe(data =>{
      this.id = data.id;
      if(this.id){
        this.GetById();
      }
    });
  }


  @Dispatch() private GetById() {
    return new GetById(this.id);
  }
  
  @Dispatch() private _fireApplyDraftLoanAction(id) {
    return new ApplyDraftLoan(id);
  }

  public proceedLoan() {
    this._store.dispatch(new ApplyDraftLoan(this.id)).subscribe((data)=>{
      if(data){
        this._snackbarService.openSuccessSnackbar({message: 'The loan has been saved and will be proceeded on all payrolls.'});
        this.GetById();
      }
    });
  }

  public navigateBack(){
    this._location.back();
  }

  public deleteLoan() {
    this._store.dispatch(new DeleteLoan(this.id.toString()))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of('')
        })
      )
      .subscribe(()=>{
        if(!this.backendError){
          this._router.navigate(['/loan-management']);
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${this.loanData$.employeeName
            }" Loan`)
          });
        } else {
          this._snackbarService.openFailureSnackbar({
            message: `${this.backendError.errorMessage}`,
          })
        }
      })
  }

}
