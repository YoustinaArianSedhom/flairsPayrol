import { Component, OnInit } from '@angular/core';
import { OrgConfigInst } from '@core/config/organization.config';
import { monthlyPayrollStatuses, MonthlyPayrollStatusesEnum } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { MonthlyPayrollModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { ExportOnePercentDeductionReport, PaginateMonthlyPayrolls } from '@modules/monthly-payrolls/state/monthly-payrolls.actions';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-monthly-payrolls',
  templateUrl: './table-monthly-payrolls.component.html',
  styleUrls: ['./table-monthly-payrolls.component.scss']
})
export class TableMonthlyPayrollsComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };



  @ViewSelectSnapshot(MonthlyPayrollsState.records) public records: MonthlyPayrollModel[];
  @Select(MonthlyPayrollsState.records) public records$: Observable<MonthlyPayrollModel[]>;
  @ViewSelectSnapshot(MonthlyPayrollsState.pagination) public pagination!: PaginationConfigModel;


  public tableConfig: TableConfigModel = {
    actionsLabel: 'Reports',
    actions: [{
      key: OrgConfigInst.CRUD_CONFIG.actions.fetch,
      label: 'Detailed Report',
      icon: { name: 'excel', isSVG: true },
    }],
    keys: ['name', 'created_by', 'creation_date', 'published_date', 'published_by', 'state','incoming', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'Monthly payroll name',
        value: (record: MonthlyPayrollModel) => { return { title: record.name, link: `/monthly-payrolls/view/${record.id}` } },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.link
      }, {
        key: 'created_by',
        head: 'Created by',
        value: (record: MonthlyPayrollModel) => {
          return {
            title: record.createdBy.name,
            link: `/employees/view/${record.createdBy.id}`
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.link
      }, {
        key: 'creation_date',
        head: 'created date',
        hidden: false,
        value: (record: MonthlyPayrollModel) => { return record.createdDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      }, {
        key: 'published_date',
        head: 'Publish date',
        value: (record: MonthlyPayrollModel) => { return record.publishedDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.date
      }, {
        key: 'published_by',
        head: 'Published by',
        hidden: false,
        value: (record: MonthlyPayrollModel) => {
          return {
            title: record.publishedBy?.name,
            link: `/employees/view/${record.publishedBy?.id}`
          }
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.link
      }, {
        key: 'state',
        head: 'Status',
        value(record: MonthlyPayrollModel) { return monthlyPayrollStatuses[record.status] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MonthlyPayrollModel) => { return (record.status === MonthlyPayrollStatusesEnum.published) ? 'text-red-500' : 'text-teal' }
          }
        },
        type: TableCellTypes.status
      },{
        key: 'incoming',
        head: 'Updates',
        value(record: MonthlyPayrollModel) { return record.payrollModificationsCount > 0 ? `Incoming (${record.payrollModificationsCount})` : record.payrollModificationsCount  },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MonthlyPayrollModel) => { return (record.payrollModificationsCount > 0) ? 'text-teal' : '' }
          }
        },
        type: TableCellTypes.status
      },
       {
        key: 'reports',
        head: 'Reports',
        value(record: MonthlyPayrollModel) { return monthlyPayrollStatuses[record.status] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }
    ]
  }


  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.fetch) this.exportOnePercentDeductionReport(record.id, record.name)
  }

  public exportOnePercentDeductionReport(payrollId: number, MonthlyPayrollName: string) {
    this._exportOnePercentDeductionReport(payrollId, MonthlyPayrollName);
  }

  @Dispatch() private _exportOnePercentDeductionReport(payrollId: number, MonthlyPayrollName: string) {
    return new ExportOnePercentDeductionReport(payrollId, MonthlyPayrollName)
  }




  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateMonthlyPayrolls({ pageNumber, pageSize });
  }

}
