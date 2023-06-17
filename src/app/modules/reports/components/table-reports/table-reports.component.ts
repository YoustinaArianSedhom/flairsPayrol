import { Component, OnInit } from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as REPORTS_MODELS from '@modules/reports/models/reports.model';
import * as REPORTS_ACTIONS from '@modules/reports/state/reports.actions';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { ReportsState } from '@modules/reports/state/reports.state';
import { Select } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { AdditionDeductionPopupComponent } from '../addition-deduction-popup/addition-deduction-popup.component';


@Component({
  selector: 'app-table-reports',
  templateUrl: './table-reports.component.html',
  styleUrls: ['./table-reports.component.scss']
})
export class TableReportsComponent implements OnInit {

  constructor(
    private _tableService: TablesService,
    private _matDialog: MatDialog

  ) { }

  @Select(ReportsState.reports) public reports$: REPORTS_MODELS.ReportModel[];
  @ViewSelectSnapshot(ReportsState.pagination) public pagination: PaginationConfigModel;

  public readonly additionDeductionAction: TableActionModel = {
    key: 'open_addition_deduction',
    label: 'Addition-deduction'
  }



  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employee-name', 'gross-salary', 'total-addition','global_additions', 'gross-after-addition', 'total-deduction', 'total-paid-salary'],
    columns: [
      {
        key: 'employee-name',
        head: 'Employee Name',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => {
          return record.employeeName
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'gross-salary',
        head: 'Pure Gross',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => { return record.baseGrossSalary },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.currency
      },
      {
        key: 'total-addition',
        head: 'Total Addition',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => {
          return {
            value: record.monthAdditionGross,
            details: record.additions,
            type: 'Additions',
            action: this.additionDeductionAction
          }
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.additionAndDeduction

      },
      {
        key: 'global_additions',
        head: 'Global Additions',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => { return record.monthGlobalAdditionGross },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.currency

      },
      {
        key: 'gross-after-addition',
        head: 'Gross After Addition',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => { return record.actualGrossSalary },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.currency

      },
      {
        key: 'total-deduction',
        head: 'Total Deduction',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => {
          return {
            value: record.deductionsNet,
            details: record.deductions,
            type: 'Deductions',
            action: this.additionDeductionAction
          }
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.additionAndDeduction

      },
      {
        key: 'total-paid-salary',
        head: 'Total Paid Salary',
        hidden: false,
        value: (record: REPORTS_MODELS.ReportModel) => { return record.paid },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.currency

      },


    ]
  }

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }




  public openDetailsPopup(config: { details: REPORTS_MODELS.AdditionDeductionModel[], type: string }) {
    this._matDialog.open(AdditionDeductionPopupComponent, {
      data: { details: config.details, type: config.type }
    })
  }


  public mapTableAction($event) {
    if ($event.action.key === this.additionDeductionAction.key) this.openDetailsPopup({
      details: $event.record.details,
      type: $event.record.type,
    })
  }

  @Dispatch() public firePaginateReports(pagination: PaginationConfigModel) { return new REPORTS_ACTIONS.PaginateReports(pagination) }

}
