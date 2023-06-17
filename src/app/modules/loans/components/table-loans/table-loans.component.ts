import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { loansModel, LoanStatusModel } from '@modules/loans/model/loans.models';
import { DeleteLoan, getAllLoans, PaginateLoans } from '@modules/loans/state/loans.actions';
import { LoansState } from '@modules/loans/state/loans.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { ConfirmationDialogDataModel } from '@shared/modules/modals/model/modals.model';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-table-loans',
  templateUrl: './table-loans.component.html',
  styleUrls: ['./table-loans.component.scss'],
})
export class TableLoansComponent implements OnInit {
  constructor(
    private _tablesService: TablesService,
    private _store: Store,
    private _router: Router,
    private _dialog: ModalsService,
    private _snackbarService: SnackBarsService,
  ) {}

  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  @Select(LoansState.loans) public records$: Observable<loansModel[]>;
  @ViewSelectSnapshot(LoansState.pagination)
  public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(LoansState.loanDtatus) public statuses: LoanStatusModel[];


  public tableConfig: TableConfigModel = {
    actions: [{
      key: OrgConfigInst.CRUD_CONFIG.actions.update,
      label: 'Edit',
      icon: {
        isSVG: true,
        name: 'edit-button',
        classes: ''
      },
      hideCondition : (record) => record.status !== 0 && record.status !== 1 && record.status !== 2 && record.status !== 3,
    },{
      key: OrgConfigInst.CRUD_CONFIG.actions.delete,
      label: OrgConfigInst.CRUD_CONFIG.actions.delete,
      icon: {
        isSVG: true,
        name: 'delete'
      },
      hideCondition : (record) => !(record.status === 0 || record.status === 1),
    },
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.fetch,
      label: 'View Details',
      icon: {
        isSVG: true,
        name: 'view'
      }
    },
  ],
    keys: [
      'name',
      'email',
      'loan_amount',
      'repaid_percentage',
      'paid_months',
      'start_date',
      'end_date',
      'status',
      'actions'
    ],
    columns: [
      {
        key: 'name',
        head: 'Employee Name',
        value: (record: loansModel) => {
          return record.employeeName;
        },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },

      {
        key: 'email',
        head: 'Employee Email',
        value: (record: loansModel) => {
          return record.employeeOrganizationEmail;
        },
        view: {
          width: 100,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email,
      },

      {
        key: 'loan_amount',
        head: 'Loan Amount',
        value: (record: loansModel) => {
          return record.grossAmount;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.currency,
      },

      {
        key: 'repaid_percentage',
        head: 'Repaid Percentage',
        value: (record: loansModel) => {
          return record.repaidAmountPercentage +'%';
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'paid_months',
        head: 'Paid Months',
        value: (record: loansModel) => {
          return record.numberOfPaidInstallments.toString();
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },

      {
        key: 'start_date',
        head: 'Start Date',
        value: (record: loansModel) => {
          return record.startDate;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.dateMonthYear,
      },

      {
        key: 'end_date',
        head: 'End Date',
        value: (record: loansModel) => {
          return record.endDate;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.dateMonthYear,
      },

      {
        key: 'status',
        head: 'Status',
        value: (record: loansModel) => {
          return this.statuses[record.status].name;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.status,
      },
    ],
  };

  ngOnInit(): void {
    this._fireGetLoansAction();
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.delete) this.deleteLoan(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this._router.navigate([`loan-management/edit/${record.id}`]);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.fetch) this._router.navigate([`loan-management/view/${record.id}`]);
  }

  public deleteLoan(loan: loansModel) {
    this.backendError = null;
    const data: ConfirmationDialogDataModel = {
      title: "Delete Loan",
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${loan.employeeName} loan`),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      class: "danger",
    };

    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new DeleteLoan(loan.id))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of('')
        })
      )
      .subscribe((result)=>{
        if(!this.backendError){
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${loan.employeeName}" Loan`),
            duration: 5,
            showCloseBtn: false
          })
        } else {
          this._snackbarService.openFailureSnackbar({
            message: `${this.backendError.errorMessage}`,
            duration: 5
          })
        }
      })
    });
  }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateLoans({ pageNumber, pageSize });
  }

  @Dispatch() private _fireGetLoansAction() {
    return new getAllLoans();
  }
}
