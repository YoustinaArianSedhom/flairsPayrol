import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GlobalAdditionFormComponent } from '@modules/entities/components/global-addition-form/global-addition-form.component';
import { GlobalDeductionFormComponent } from '@modules/entities/components/global-deduction-form/global-deduction-form.component';
import { GlobalAdditionAndDeductionModel } from '@modules/entities/model/entities.model';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetGlobalAdditionDeduction } from '../../state/entities.actions';

@Component({
  selector: 'app-entity-config',
  templateUrl: './entity-config.component.html',
  styleUrls: ['./entity-config.component.scss']
})
export class EntityConfigComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _store: Store,
    private _matDialog: MatDialog,
    private _layoutService: LayoutService
  ) { }
  public id: string;
  public pageTitle = 'Entity Configuration';
  public showForm = false;
  public isUpdate = false;

  @Select(EntitiesState.globalAdditionAndDeduction) public globalAdditionAndDeduction$: Observable<GlobalAdditionAndDeductionModel[]>;
  ngOnInit(): void {
    this.id = this._route.snapshot.params.id;
    if (this.id) {
      this._store.dispatch(new GetGlobalAdditionDeduction(parseInt(this.id)));
      this.globalAdditionAndDeduction$.subscribe((globalAdditionsAndDeductions:GlobalAdditionAndDeductionModel[])=>{
        if(globalAdditionsAndDeductions.length){
          this._layoutService.setTitle('Entity Configuration');
          this.pageTitle = `${globalAdditionsAndDeductions[0].entityName} Configuration`

        }
      })
    }
  }

  public addNewGlobalDeduction() {
    const globalDeductionsDate = {
      entityId: parseInt(this.id, 10),
      value: null,
      name: null
    }
    this._matDialog.open(GlobalDeductionFormComponent, {
      data: globalDeductionsDate || {},
      panelClass: ['FormDialog']
    })
  }

  public addNewGlobalAddition() {
    const globalAdditionData = {
      entityId: +this.id,
      value: null,
      name: null
    }

    this._matDialog.open(GlobalAdditionFormComponent, {
      data: globalAdditionData || {},
      panelClass: ['FormDialog']
    })
  }


}
