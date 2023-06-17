import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { ProfilesLevelsStatusesEnum } from '@modules/profiles-levels/model/profiles-levels.config';
import { ProfileLevelSummary } from '@modules/profiles-levels/model/profiles-levels.model';
import { PaginateProfilesLevelsSummaries } from '@modules/profiles-levels/state/profiles-levels.actions';
import { ProfilesLevelsState } from '@modules/profiles-levels/state/profiles-levels.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel, TableLinkCellModel, tableTakenActionModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import { UpdatePersonalInfoComponent } from '../update-personal-info/update-personal-info.component';

@Component({
  selector: 'app-table-profiles-levels',
  templateUrl: './table-profiles-levels.component.html',
  styles: [
  ]
})
export class TableProfilesLevelsComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    // private _modalsService: ModalsService,
    private _matDialog: MatDialog,
    // private _router: Router,
    private _store: Store,
    private _snackbarService: SnackBarsService,
  ) { }
  @Select(ProfilesLevelsState.records) public records$!: Observable<ProfileLevelSummary[]>;
  @Select(ProfilesLevelsState.pagination) public pagination$!: Observable<PaginationConfigModel>;


  public tableConfig: TableConfigModel = {
    actions: [
    //   {
    //   key: OrgConfigInst.CRUD_CONFIG.actions.update,
    //   label: OrgConfigInst.CRUD_CONFIG.actions.update + ' Level',
    //   icon: {
    //     name: 'edit-button',
    //     isSVG: true
    //   }
    // }, 
    
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.create,
      label: OrgConfigInst.CRUD_CONFIG.actions.update + ' personal info',
      icon: {
        name: 'edit-button',
        isSVG: true
      }
    }
    ],
    keys: ['name', 'salary_level', 'level_status', 'national_id', 'profile_type', 'hr_code', 'manager_name', 'title', 'medical_insurance_number', 'social_insurance_number', 'employee_status', 'actions'],
    columns: [
      // name
      {
        key: 'name',
        head: 'Profile Name',
        hidden: false,
        value: (record: ProfileLevelSummary): TableLinkCellModel => { return {link: `/employees/view/${record.id}`, title: record.name} },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.link
      }, 
      // national_id
      {
        key: 'national_id',
        head: 'National ID',
        value: (record: ProfileLevelSummary) => { return record.nationalId },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      }, 
      // profile_type
      {
        key: 'profile_type',
        head: 'Profile Type',
        hidden: false,
        value: (record: ProfileLevelSummary) => { return record.employeeType },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      }, 
      // hr_code
      {
        key: 'hr_code',
        head: 'HR code',
        value: (record: ProfileLevelSummary) => { return record.hrCode },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
          }
        }
      }, 
      // manager_name
      {
        key: 'manager_name',
        head: 'Manager Name',
        value: (record: ProfileLevelSummary) => { return record.managerName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
      },
      // title
      {
        head: 'Title',
        key: 'title',
        value(record: ProfileLevelSummary) { return record.title},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      // medical_insurance_number
      {
        key: 'medical_insurance_number',
        head: 'Medical Insurance Number',
        value(record: ProfileLevelSummary) {return record.medicalInsuranceNumber},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      },
      // social_insurance_number
      {
        key: 'social_insurance_number',
        head: 'Social insurance number',
        value(record: ProfileLevelSummary) { return record.socialInsuranceNumber},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      },
      // salary_level
      {
        key: 'salary_level',
        head: 'Salary Level',
        value(record: ProfileLevelSummary) { return record.salaryLevelName},
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      },
      // level_status
      {
        key: 'level_status',
        head: 'Level status',
        value(record: ProfileLevelSummary) { return record.levelStatusName},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: ProfileLevelSummary) => {
              if (record.levelStatusId === ProfilesLevelsStatusesEnum.InRange) return 'text-teal';
              else if (record.levelStatusId === ProfilesLevelsStatusesEnum.Underpaid) return 'text-red-500';
              else if (record.levelStatusId === ProfilesLevelsStatusesEnum.Overpaid) return 'text-yellow-600';
              else if (record.levelStatusId === ProfilesLevelsStatusesEnum.Unspecified) return 'text-gray-500';
            }
          }
        },
        type: TableCellTypes.status
      },
      // employee_status
      {
        key: 'employee_status',
        head: 'Employee Status',
        value(record: ProfileLevelSummary) { return record.status},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: ProfileLevelSummary) => {
              if (record.status === 'Active') return 'text-teal';
              return 'text-red-500'
            }
          }
        },
        type: TableCellTypes.status
      },
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }


  public mapTableActions({action, record}: tableTakenActionModel) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.create) this.openUpdatePersonalInfoPopup(record);
    // else if (action.key == OrgConfigInst.CRUD_CONFIG.actions.update) this.openUpdateProfileLevelPopup(record);
  }


  // public openUpdateProfileLevelPopup({id: profileId, salaryLevelId}: ProfileLevelSummary) {
  //   this._matDialog.open(UpdateProfileLevelComponent, {
  //     data: {profileId, salaryLevelId, entityId: this._store.selectSnapshot(ProfilesLevelsState.filtration).entityId}
  //   })
  // }

  public openUpdatePersonalInfoPopup(record: ProfileLevelSummary) {
    this._matDialog.open(UpdatePersonalInfoComponent, {
      data: record
    })
  }



  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateProfilesLevelsSummaries({ pageNumber, pageSize });
  }
}
