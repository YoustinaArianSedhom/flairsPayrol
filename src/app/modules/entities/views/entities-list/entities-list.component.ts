import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityFormComponent } from '@modules/entities/components/entity-form/entity-form.component';
import { GetAllCountries, GetAllEntities, SearchEntities } from '@modules/entities/state/entities.actions';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-entities-list',
  templateUrl: './entities-list.component.html',
  styleUrls: ['./entities-list.component.scss']
})
export class EntitiesListComponent implements OnInit {

  constructor(
    private _store: Store,
    private _matDialog: MatDialog,
    private _layoutService: LayoutService
  ) { }
  public pageTitle = 'Entities'
  
  @ViewSelectSnapshot(EntitiesState.searchQuery) public searchQuery: string;


  ngOnInit(): void {
    this._layoutService.setTitle(this.pageTitle)
    this._AdditionDeductionDispatch();
  }

    //! dispatching state actions to get selected values from store
    private _AdditionDeductionDispatch(){
      this._store.dispatch(new GetAllEntities())
      this._store.dispatch(new GetAllCountries());
    }

  public addNewEntity() {
    this._matDialog.open(EntityFormComponent, {
      data: {},
      panelClass: ['entityFormDialog', 'FormDialog']
    })
  }

  public search(term: string) {
    this._store.dispatch(new SearchEntities(term));
  }


}
