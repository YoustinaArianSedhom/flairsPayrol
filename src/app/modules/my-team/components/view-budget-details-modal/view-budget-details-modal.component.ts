import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetItemsDetail, CurrentBudgetModel, TeamMemberModel } from '@modules/my-team/model/my-team.models';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-budget-details-modal',
  templateUrl: './view-budget-details-modal.component.html',
  styleUrls: ['./view-budget-details-modal.component.scss']
})
export class ViewBudgetDetailsModalComponent implements OnInit {
  @ViewSelectSnapshot(MyTeamStateSelectors.managerCurrentBudget) public managerCurrentBudget: CurrentBudgetModel;
  @Select(MyTeamStateSelectors.managerCurrentBudgetRecords) public records$: Observable<BudgetItemsDetail[]>;
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['budget_details','consumed_budget', 'remaining', 'limit_assigned'],
    columns: [
      {
        key: 'budget_details',
        head: 'Budget Name',
        value: (record: BudgetItemsDetail) => { return record.budgetItemTypeName },
        view: {
          width: 25,
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
          width: 25,
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
        key: 'remaining',
        head: 'Remaining',
        value: (record: BudgetItemsDetail) => { return record.budgetItemRemainingAmount ? record.budgetItemRemainingAmount : '0' },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: BudgetItemsDetail) => {
              return (record.budgetItemRemainingAmount >= record.budgetItemLimit) ?
                'text-green-500' :
                record.budgetItemRemainingAmount <= 0 ?
                  'text-red-500' :
                  'text-yellow-500'
            },
          }
        },
      },
      {
        key: 'limit_assigned',
        head: 'Limit Assigned',
        value: (record: BudgetItemsDetail) => { return record.budgetItemLimit ? record.budgetItemLimit : '0' },
        view: {
          width: 25,
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: TeamMemberModel, private _tablesService: TablesService) { }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

}
