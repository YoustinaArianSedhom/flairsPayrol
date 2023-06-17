import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { OrgConfigInst } from '@core/config/organization.config';
import { Observable } from 'rxjs';
import { TableActionModel, TableColumnModel, TableConfigModel } from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit {

  constructor(
    private _tablesService: TablesService
  ) { }

  @Input() public classes: any;
  @Input() public records$: Observable<any>;
  @Input() public config: TableConfigModel;
  @Output() public actionTaken: EventEmitter<{
    action: TableActionModel,
    record: any
  }> = new EventEmitter();

  @Output() public sortChange: EventEmitter<{
    sortField: number;
    sortType: number;
  }> = new EventEmitter();
  @Output() public checkboxChange: EventEmitter<boolean> = new EventEmitter();
  @Input() public check:boolean = false

  ngOnInit(): void {

    this._tablesService.tableConfigChange.subscribe((config: TableConfigModel) => {
      this.config = {...this.config};
    })

    this._tablesService.tableActionsChange.subscribe((actions: TableActionModel[]) => {
      this.config = {...this.config, actions}
    })

    this._tablesService.tableColumnsChange.subscribe((columns: string[]) => {
      this.config = {...this.config, keys: columns}
    })

    this._tablesService.tableActions.subscribe((action: {record: any; action: TableActionModel}) => {
      this.actionTaken.emit(action);
    })
  }


  public getColumn(key: string) {
    return this.config.columns.find(column => column.key == key);
  }


  public get columnsWithoutActions() {
    return this.config.keys.filter(column => column != 'actions'
)
  }


 


  public onSortChange($event: Sort) {
    const sortField = this.config.columns.find(column => column.key == $event.active).sort.sortField;
    this.sortChange.emit({
      sortField,
      sortType: OrgConfigInst.CRUD_CONFIG.sort[$event.direction]
    })
  }

  public onCheckboxChange(event) {
    this.checkboxChange.emit(event.checked)
  }


}
