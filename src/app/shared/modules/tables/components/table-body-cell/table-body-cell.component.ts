import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TableCellTypes } from '../../model/tables.config';
import { TableColumnModel } from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';

@Component({
  selector: 'app-table-body-cell',
  templateUrl: './table-body-cell.component.html',
  styleUrls: ['./table-body-cell.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableBodyCellComponent implements OnInit {


  constructor(
    private _tables: TablesService,
    private _CDR: ChangeDetectorRef
  ) { }

  @Input() record: any;
  @Input() column: TableColumnModel;
  @Input() index: number;

  ngOnInit(): void {
  }


  public setCellClasses(classes, record?: any) {

    if (typeof classes == 'function') return classes(record);
    else if (typeof classes == 'string') return classes;
    else return '';

  }

  public setExtraInfoClasses(classes, record?: any) {
    if (typeof classes == 'function') return classes(record);
    else if (typeof classes == 'string') return classes;
    else return '';

  }


  public onAdditionDeductionClick(record) {
    this._tables.tableActions.next({ record, action: record.action })
  }

  public exposeCellValue(config: any) {
    this.column.type = 'secret';
    this.column = {
      ...this.column, type: config.typeWhenExposed, value: (record) =>
        typeof config.key == 'string' ? record[config.key] : config.key(record)
    }
    setTimeout(() => {
      this.column = { ...this.column, type: TableCellTypes.secret, value: (record) => config }
    }, 3000);

  }


  public emitEvent(record, { key, label }: { key: string, label: string }) {
    this._tables.tableActions.next({ record, action: { key, label } })
  }

  public fireToggle(data, checked, { key, label }: { key: string, label: string }) {
    const record = { ...data, checked }
    this._tables.tableActions.next({ record, action: { key, label } })
  }

  public onCheckboxChange(ev, record) {
    this._tables.tableActions.next({ record, action: { key: 'checkbox', label: ev.checked }})
  }
}
