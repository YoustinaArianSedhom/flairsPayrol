import { Component, OnInit } from '@angular/core';
import { GetProfilesHRData, PaginateProfilesHRData } from '@modules/hr-data/state/hr-data.actions';
import { HRDataState } from '@modules/hr-data/state/hr-data.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs/internal/Observable';
import { HRDataModel } from '../../models/hr-data.models';
import { TableConfigModel } from '../../../../shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';

@Component({
  selector: 'app-table-hr-data',
  templateUrl: './table-hr-data.component.html',
  styleUrls: ['./table-hr-data.component.scss']
})
export class TableHrDataComponent implements OnInit {

  @Select(HRDataState.HRProfilesData) public records$: Observable<HRDataModel[]>
  @ViewSelectSnapshot(HRDataState.pagination) public pagination!: PaginationConfigModel;


  constructor(private _tableService: TablesService) { }
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['name', 'mail', 'hr_code', 'department_name', 'department_code', 'national_id', 'employment_date', 'manager_name','manager_email'],
    columns: [
      {
        key: 'name',
        head: 'Name',
        value: (record: HRDataModel) => { return record.name },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'mail',
        head: 'Email',
        hidden: false,
        value: (record: HRDataModel) => {
          return record.organizationEmail;
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
        type:TableCellTypes.email
      },
      {
        key: 'national_id',
        head: 'National Id',
        value: (record: HRDataModel) => { return record.nationalId },
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
        key: 'employment_date',
        head: 'Employment Date',
        hidden: false,
        value: (record: HRDataModel) => { return record.flairstechJoinDate },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'manager_name',
        head: 'Manager Name',
        value: (record: HRDataModel) => { return record.managerName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'manager_email',
        head: 'Manager Email',
        hidden: false,
        value: (record: HRDataModel) => {
          return record.managerEmail;
        },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'px-3'
          },
        },
        type:TableCellTypes.email
      },
      {
        key: 'hr_code',
        head: 'HR Code',
        value: (record: HRDataModel) => { return record.hrCode },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          },
        },
      },
      {
        key: 'department_name',
        head: 'Department Name',
        value: (record: HRDataModel) => { return record.departmentName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'department_code',
        head: 'Department Code',
        value: (record: HRDataModel) => { return record.departmentCode },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
    ]
  }
  ngOnInit(): void {
    this._fireGetProfilesHRData();
    this._tableService.setupConfig(this.tableConfig);
  }



  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateProfilesHRData({ pageNumber, pageSize });
  }

  @Dispatch() private _fireGetProfilesHRData() {
    return new GetProfilesHRData();
  }

}
