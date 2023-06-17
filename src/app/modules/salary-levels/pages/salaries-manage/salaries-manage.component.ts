import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from '@modules/layout/model/layout.service';
import { SalariesLevelService } from '@modules/salary-levels/model/salaries-level.service';
import { GetSalaryLevels, SearchSalaryLevels } from '@modules/salary-levels/state/salary-levels.actions';
import { SalaryLevelsState } from '@modules/salary-levels/state/salary-levels.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-salaries-manage',
  templateUrl: './salaries-manage.component.html',
  styleUrls: ['./salaries-manage.component.scss']
})
export class SalariesManageComponent implements OnInit {

  constructor(
    private _store: Store,
    public salaryLevelsService: SalariesLevelService,
    private _matDialog: MatDialog,
    private _layoutService: LayoutService,
  ) { }
  @ViewSelectSnapshot(SalaryLevelsState.searchQuery) public searchQuery: string;

  public pageTitle = 'Salary Levels'

  // public filtersConfig: FiltersConfig = {
  //   filters: [], // Default values
  //   enabled: true
  // }





  ngOnInit(): void {
    this._layoutService.setTitle(this.pageTitle)
    this._store.dispatch(new GetSalaryLevels())
  }


  // public openSalaryLevelForm(salaryLevel?: SalaryLevelModel) {
  //   this._matDialog.open(SalaryLevelFormComponent, {
  //     data: {},
  //     panelClass: ['FormDialog']
  //   })
  // }


  public search(term: string) {
    this._store.dispatch(new SearchSalaryLevels(term));
  }





}
