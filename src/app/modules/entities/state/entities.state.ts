import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ApiResponse } from '@shared/models/api-response';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import  cloneDeep from 'lodash/cloneDeep';
import { tap } from 'rxjs/operators';
import { country, EntityModel, entitySummary, GlobalAdditionAndDeductionModel, GlobalAdditionModel, GlobalDeductionModel, GlobalDeductionResponse } from '../model/entities.model';
import { EntitiesService } from '../model/entities.service';
import { AddNewEntity, DeleteEntity, GetAllCountries, GetAllEntities, GetCountryNameById, GetEntitySummary, GetProfilesInEntity, PaginateEntities, PaginateEntityProfiles, SearchEntities, UpdateEntity, SearchEntitiesProfiles, GetGlobalDeductions, AddNewGlobalDeduction, UpdateGlobalDeduction, DeleteGlobalDeduction, GetGlobalAdditionDeduction, AddNewGlobalAddition, UpdateGlobalAddition, DeleteGlobalAddition } from './entities.actions';


export class EntitiesStateModel {
  public records!: any;
  public countries!: country[];
  public entitySummary: entitySummary;
  public entityProfiles: any[];
  public globalDeductions: GlobalDeductionResponse[];
  public globalAdditionDeductions: GlobalAdditionAndDeductionModel[];
  public filters!: {};
  public pagination!: PaginationConfigModel;
  public profilesPagination!: PaginationConfigModel;
  public searchQuery: string;
  public profilesSearchQuery: string;
  public sort: {
    sortField: number;
    sortType: number;
  }
}
@State<EntitiesStateModel>({
  name: 'entities',
  defaults: {
    records: [],
    countries: [],
    entitySummary:{},
    entityProfiles: [],
    globalDeductions: [],
    
    filters: {},
    pagination: {
      totalPages: 0,
      recordsTotalCount: 0
    },
    profilesPagination: {
      totalPages: 0,
      recordsTotalCount: 0
    },
    searchQuery: '',
    profilesSearchQuery: '',
    sort: {
      sortField: 1,
      sortType: 1
    },
    globalAdditionDeductions: []
  }
})
@Injectable()
export class EntitiesState {

  constructor(
    private _entitiesService: EntitiesService
  ) { }

  @Selector()
  static pagination(state: EntitiesStateModel): PaginationConfigModel {
    return { ...state.pagination };
  }
  @Selector()
  static profilesPagination(state: EntitiesStateModel): PaginationConfigModel {
    return { ...state.profilesPagination };
  }

  @Selector()
  static records(state: EntitiesStateModel): EntityModel[] {
    return cloneDeep(state.records);
  }
  @Selector()
  static countries(state: EntitiesStateModel): country[] {
    return state.countries;
  }
  @Selector()
  static entitySummary(state: EntitiesStateModel) {
    return state.entitySummary;
  }
  @Selector()
  static globalDeductions(state: EntitiesStateModel) : GlobalDeductionResponse[] {
    return state.globalDeductions;
  }
  @Selector()
  static entityProfiles(state: EntitiesStateModel) {
    return state.entityProfiles;
  }
  @Selector()
  static searchQuery(state: EntitiesStateModel) {
    return state.searchQuery;
  }

  @Selector()
  static profilesSearchQuery(state: EntitiesStateModel) {
    return state.profilesSearchQuery;
  }

  @Selector()
  static globalAdditionAndDeduction(state: EntitiesStateModel) { return state.globalAdditionDeductions }

  @Action(GetAllEntities)
  public getAllEntities(ctx: StateContext<EntitiesStateModel>){
    const {pagination, searchQuery, sort} = ctx.getState()
    return this._entitiesService.getAllEntities( 
      {pageNumber: pagination.pageNumber, pageSize: pagination.pageSize},
      {searchQuery, ...sort}).pipe(
        tap(({records, pageSize, pageNumber, recordsTotalCount, totalPages}: PaginationModel<EntityModel>) => {
        ctx.patchState({
          records,
          pagination: {...ctx.getState().pagination, pageSize, pageNumber, recordsTotalCount, totalPages }
        });
      })
    )
  }

  @Action(GetProfilesInEntity)
  public getProfilesInEntity(ctx: StateContext<EntitiesStateModel>){
    const {profilesPagination, profilesSearchQuery, entitySummary} = ctx.getState()
    return this._entitiesService.getProfilesInEntity(
      {pageNumber: profilesPagination.pageNumber, pageSize: profilesPagination.pageSize}, {searchQuery: profilesSearchQuery, ...entitySummary}).pipe(
        tap(({records, pageSize, pageNumber, recordsTotalCount, totalPages}: PaginationModel<EntityModel>) => {
        ctx.patchState({
          entityProfiles : records,
          profilesPagination: {...ctx.getState().profilesPagination, pageSize, pageNumber, recordsTotalCount, totalPages }
        });
      })
    )
  }

  @Action(PaginateEntities)
  public paginateEntities(ctx: StateContext<EntitiesStateModel>, {config}: PaginateEntities) {
    ctx.patchState({pagination: {...ctx.getState().pagination, ...config}})
    ctx.dispatch(new GetAllEntities())
  }




  @Action(PaginateEntityProfiles)
  public paginateEntitiesProfiles(ctx: StateContext<EntitiesStateModel>, {config}: PaginateEntityProfiles) {
    ctx.patchState({profilesPagination: {...ctx.getState().profilesPagination, ...config}})
    ctx.dispatch(new GetProfilesInEntity())
  }

  @Action(GetEntitySummary)
  public getEntitySummary(ctx:StateContext<EntitiesStateModel>, {id}: GetEntitySummary){
    return this._entitiesService.getEntitySummary(id).pipe(
      tap((summary: ApiResponse<entitySummary>)=>{
        ctx.patchState(
          {
            entitySummary: summary.result
          }
        );
        ctx.dispatch(new GetProfilesInEntity())
      })
    )
  }


  
  @Action(AddNewEntity)
  public addNewEntity(ctx: StateContext<EntitiesStateModel>, {entity}: AddNewEntity){
    return this._entitiesService.addNewEntity(entity).pipe(
      tap((returnedRecord: EntityModel) => 
        ctx.setState(
          /**
           * @todo  insertItem should be replaced with append method.
           */
          patch({ records: insertItem<EntityModel>(returnedRecord, ctx.getState().records.length) })
        )
      )
    )
  }

  @Action(UpdateEntity)
  public updateEntity(ctx: StateContext<EntitiesStateModel>, { entity }: UpdateEntity) {
    return this._entitiesService.updateEntity(entity).pipe(
      tap((returnedRecord: EntityModel) => 
        ctx.setState(patch({records: updateItem<EntityModel>(entity => entity.id === returnedRecord.id, returnedRecord)}))
      )
    )
  }


  @Action(DeleteEntity)
  public deleteEntity(ctx: StateContext<EntitiesStateModel>, { id }: DeleteEntity) {
    return this._entitiesService.deleteEntity(id).pipe(
      tap(() => ctx.setState(patch({ records: removeItem<EntityModel>(entity => entity.id === id) })))
    )
  }


  
  @Action(GetAllCountries)
  public getAllCountries(ctx: StateContext<EntitiesStateModel>){
    return this._entitiesService.getAllCountries().pipe(
      tap((result)=>
        ctx.patchState({
          countries: result
        })
      )
    )
  }

  @Action(GetCountryNameById)
  public getCountryNameById(ctx: StateContext<EntitiesStateModel>, {id}: GetCountryNameById){
    return ctx.getState().countries.map((country)=>{
      country[id] === id
    })
  }

  @Action(SearchEntities)
  public searchEntities(ctx: StateContext<EntitiesStateModel>, {term}: SearchEntities) {
    ctx.patchState({
      searchQuery: term,
      pagination: {...ctx.getState().pagination, pageNumber: 0}
    })
    ctx.dispatch(new GetAllEntities())
  }


  
@Action(SearchEntitiesProfiles)
public searchEntitiesProfiles(ctx: StateContext<EntitiesStateModel>, {term}: SearchEntitiesProfiles) {
  ctx.patchState({
    profilesSearchQuery: term
  })
  ctx.dispatch(new GetProfilesInEntity())
}


//! Global Deduction to be separated

@Action(GetGlobalDeductions)
public getGlobalDeductions(ctx:StateContext<EntitiesStateModel>, {entityId}: GetGlobalDeductions){
  return this._entitiesService.getGlobalDeductions(entityId).pipe(
    tap((globalDeductions: ApiResponse<GlobalDeductionResponse[]>)=>{
      ctx.patchState(
        {
          globalDeductions : globalDeductions.result
        }
      );
    })
  )
}

@Action(AddNewGlobalDeduction)
  public addNewGlobalDeduction(ctx: StateContext<EntitiesStateModel>, { globalDeduction }: AddNewGlobalDeduction) {
    return this._entitiesService.addNewGlobalDeduction(globalDeduction).pipe(
      tap((returnedRecord: GlobalDeductionResponse) => {
        // ctx.setState(
        //   /**
        //    * @todo //! insertItem should be replaced with append method.
        //    */
        //   patch({ globalDeductions: insertItem<GlobalDeductionResponse>(returnedRecord, ctx.getState().records.length) })

        // );
        ctx.dispatch(new GetGlobalAdditionDeduction(returnedRecord.entityId))
      }
      )
    )
  }

  @Action(UpdateGlobalDeduction)
  public updateGlobalDeduction(ctx: StateContext<EntitiesStateModel>, { globalDeduction }: UpdateGlobalDeduction) {
    return this._entitiesService.updateGlobalDeduction(globalDeduction).pipe(
      tap((returnedRecord: GlobalDeductionResponse) => {
        ctx.dispatch(new GetGlobalAdditionDeduction(returnedRecord.entityId));
        // ctx.setState(patch({ globalAdditionDeductions: updateItem<any>(globalDeduction => globalDeduction.id === returnedRecord.id, returnedRecord) }))
      }
      )
    )
  }

  @Action(DeleteGlobalDeduction)
  public deleteGlobalDeduction(ctx: StateContext<EntitiesStateModel>, { globalDeductionId }: DeleteGlobalDeduction) {
    return this._entitiesService.deleteGlobalDeduction(globalDeductionId).pipe(
      tap(() => {
        ctx.setState(patch({ globalAdditionDeductions: removeItem<GlobalAdditionAndDeductionModel>(globalDeduction => globalDeduction.id === globalDeductionId) }))
      })
    )
  }

  /* ____________________________ Additions reducers ____________________________ */

  @Action(GetGlobalAdditionDeduction)
  public GetGlobalAdditionDeduction(ctx: StateContext<EntitiesStateModel>, { entityId }: GetGlobalAdditionDeduction) {
    return this._entitiesService.getGlobalAdditionDeduction(entityId).pipe(
      tap((globalAdditionDeductions: GlobalAdditionAndDeductionModel[]) => {
        ctx.patchState({
          globalAdditionDeductions
        })
      })
    )

  }

  @Action(AddNewGlobalAddition)
  public AddNewGlobalAddition(ctx: StateContext<EntitiesStateModel>, { globalAddition }: AddNewGlobalAddition) {
    return this._entitiesService.addNewGlobalAddition(globalAddition).pipe(
      tap((result: GlobalAdditionModel) => {
        ctx.dispatch(new GetGlobalAdditionDeduction(result.entityId))
      })
    )
  }

  @Action(UpdateGlobalAddition)
  public UpdateGlobalAddition(ctx: StateContext<EntitiesStateModel>, { globalAddition }: UpdateGlobalAddition) {
    return this._entitiesService.editGlobalAddition(globalAddition).pipe(
      tap((result: GlobalAdditionModel) => {
        ctx.dispatch(new GetGlobalAdditionDeduction(result.entityId))
      })
    )
  }

  @Action(DeleteGlobalAddition)
  public DeleteGlobalAddition(ctx: StateContext<EntitiesStateModel>, { globalAdditionId }: DeleteGlobalAddition) {
    return this._entitiesService.deleteGlobalAddition(globalAdditionId).pipe(
      tap(() => {
        ctx.setState(patch({ globalAdditionDeductions: removeItem<GlobalAdditionAndDeductionModel>(globalAddition => globalAddition.id === globalAdditionId) }))
      })
    )
  }
}
