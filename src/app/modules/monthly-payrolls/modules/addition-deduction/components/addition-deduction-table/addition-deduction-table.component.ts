import { Component, Input, OnInit } from '@angular/core';
import { OrgConfigInst } from '@core/config/organization.config';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { AdditionDeductionModel } from '../../model/addition-deduction.model';

@Component({
  selector: 'app-addition-deduction-table',
  templateUrl: './addition-deduction-table.component.html',
  styleUrls: ['./addition-deduction-table.component.scss']
})
export class AdditionDeductionTableComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,

  ) { }


  @Input() records;
  @Input() type;
  // @Input() tableConfig: TableConfigModel;

  public tableConfig: TableConfigModel = {
    actions: [{
      key: OrgConfigInst.CRUD_CONFIG.actions.update,
      label: OrgConfigInst.CRUD_CONFIG.actions.update,
      icon: {
        isSVG: true,
        name: 'edit-button',
        classes: ''
      }
    },
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.delete,
      label: OrgConfigInst.CRUD_CONFIG.actions.delete,
      icon: {
        isSVG: true,
        name: 'delete'
      }
    }
    ],
    keys: ['id', 'name', 'value', 'startMonth', 'startYear', 'endMonth', 'endYear', 'notes'],
    columns: [
      {
        key: 'id',
        head: 'id',
        hidden: false,
        sort: {
          sortField: 1,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc
        },
        value: (record: AdditionDeductionModel) => { return record.id },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'name',
        head: 'name',
        hidden: false,
        value: (record: AdditionDeductionModel) => { return record.name },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'value',
        head: 'value',
        hidden: true,
        value: (record: AdditionDeductionModel) => {
          return record.value
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'startMonth',
        head: 'start Month',
        hidden: false,
        sort: {
          sortField: 2,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc
        },
        value: (record: AdditionDeductionModel) => { return record.startMonth },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'startYear',
        head: 'start Year',
        hidden: false,
        value: (record: AdditionDeductionModel) => { return record.startYear },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'endMonth',
        head: 'end Month',
        hidden: false,
        value: (record: AdditionDeductionModel) => { return record.endMonth },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'endYear',
        head: 'end Year',
        hidden: false,
        value: (record: AdditionDeductionModel) => { return record.endYear },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'notes',
        head: 'notes',
        hidden: false,
        value: (record: AdditionDeductionModel) => { return record.notes },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.delete) this.delete(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.update(record);
  }

  public delete(record?: AdditionDeductionModel) {
    // console.log('delete record', record)
  }
  public update(record?: AdditionDeductionModel) {
    // console.log('update record', record)
  }

}
