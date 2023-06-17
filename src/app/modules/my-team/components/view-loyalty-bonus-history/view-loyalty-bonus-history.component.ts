import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as MY_TEAM_MODELS from '@modules/my-team/model/my-team.models';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { Select } from '@ngxs/store';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-loyalty-bonus-history',
  templateUrl: './view-loyalty-bonus-history.component.html',
  styleUrls: ['./view-loyalty-bonus-history.component.scss']
})
export class ViewLoyaltyBonusHistoryComponent implements OnInit {
  @Select(MyTeamStateSelectors.loyaltyBonusHistoryRecords) public records$: Observable<MY_TEAM_MODELS.MyTeamLoyaltyBonusModel>;
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['transfer_month', 'duration', 'percent', 'amount', 'transferred'],
    columns: [
      {
        key: 'transfer_month',
        head: 'Transfer Month',
        value: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record?.transferMonth },
        extraInfoValue: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record?.isDeserveLoyalty ? '' : "Doesn't deserved" },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            extraInfoClasses: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => {
              let baseClass = '';
              if (!record.isDeserveLoyalty)
                baseClass = 'block text-xs text-center bg-yellow-300 text-black w-36 px-1 py-1 rounded-md bg-red-500'
              return baseClass
            }
          }
        },
        type: TableCellTypes.extraInfo
      },
      {
        key: 'duration',
        head: 'Duration',
        value: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record?.durationInMonths + ' Months' },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      {
        key: 'percent',
        head: 'Percent',
        value: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record?.percentage + '%' },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        }
      },
      {
        key: 'amount',
        head: 'Amount',
        value: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record?.amount },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          }
        },
        type: TableCellTypes.currency
      },
      {
        key: 'transferred',
        head: 'Transferred',
        value: (record: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => { return record.isTransferred ? 'Yes' : 'No' },
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel, private _tablesService: TablesService) { }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

}
