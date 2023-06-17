import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { Observable } from 'rxjs';
import { BudgetItemsDetail } from '@modules/my-team/model/my-team.models';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';

@Component({
  selector: 'app-table-current-budget',
  templateUrl: './table-current-budget.component.html',
  styleUrls: ['./table-current-budget.component.scss']
})
export class TableCurrentBudgetComponent implements OnInit {
  @Select(MyTeamStateSelectors.currentBudgetRecords) public records$: Observable<BudgetItemsDetail[]>;
  @ViewSelectSnapshot(AuthorizationState.isPayrollManager) public isPayrollManager: boolean;
  public tableConfig:TableConfigModel = {
    actions: [],
    keys: ['budget_details','consumed_budget', 'remaining', 'limit_assigned'],
    columns: [
      {
        key:'budget_details',
        head:'Budget Name',
        value: (record: BudgetItemsDetail) => { return record.budgetItemTypeName},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-black '
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      {
        key:'consumed_budget',
        head:'Consumed Budget',
        value: (record: BudgetItemsDetail) => { return record.budgetItemSpentAmount ? record.budgetItemSpentAmount : '0'},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-black '
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      {
        key:'remaining',
        head:'Remaining',
        value: (record: BudgetItemsDetail) => { return record.budgetItemRemainingAmount ? record.budgetItemRemainingAmount : '0'},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record:BudgetItemsDetail) => { return (record.budgetItemRemainingAmount >= record.budgetItemLimit) ?
               'text-green-500' :
               record.budgetItemRemainingAmount <= 0 ?
                'text-red-500' :
                'text-yellow-500'
              },
          }
        },
      },
      {
        key:'limit_assigned',
        head:'Limit Assigned',
        value: (record: BudgetItemsDetail) => { return record.budgetItemLimit ? record.budgetItemLimit : '0'},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          }
        },
      },
    ]
  }
  constructor(private _tablesService: TablesService) { }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }



}
