import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { entitySummary } from '@modules/entities/model/entities.model';
import { GetEntitySummary, GetProfilesInEntity, SearchEntitiesProfiles } from '@modules/entities/state/entities.actions';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {Location} from '@angular/common';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss']
})
export class EntityDetailsComponent implements OnInit {

  constructor(
    private _route : ActivatedRoute,
    private _store : Store,
    private _layoutService: LayoutService,
    private _location: Location
  ) { }
  
  public id: string;
  public isView = null;
  public entity: entitySummary;
  public searchQuery = '';

  // @Select(EntitiesState.countries) public set entitySummary(entity){
  //   if (entity) {
  //     this.entity = entity;
  //     console.log('entity', this.entity)
  //   } 
  // }

  @Select(EntitiesState.entitySummary) public entitySummary$: Observable<entitySummary>;
  ngOnInit(): void {
    
    this.isView = this._route.snapshot.data.page === 'view';
    this.id = this._route.snapshot.params.id;
    if(this.id) {
      this._store.dispatch(new GetEntitySummary(parseInt(this.id, 10)))
      this.entitySummary$.subscribe(res=>{
        this.entity = res;
        this._layoutService.setTitle(this.entity.entityName)
      })
      
    }
  }

  public search(term: string) {
    this.searchQuery = term;
    this._store.dispatch(new SearchEntitiesProfiles(term));
  }

  public navigateBack(){
    this._location.back();
  }

}
