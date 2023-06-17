import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableCellTypes, TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { Observable, of } from 'rxjs';
import { ValidAddition } from '../../model/addition-deduction.model';
import { AdditionDeductionService } from '../../model/addition-deduction.service';
import { UploadFilePickerAdapter } from './upload.adapter';

@Component({
  selector: 'app-addition-uploader-adapter',
  templateUrl: './addition-upload-adapter.component.html',
  styleUrls: ['./addition-upload-adapter.component.scss']
})
export class AdditionUploadAdapterComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _additionService: AdditionDeductionService
  ) { }

  @Output() canBeImport: EventEmitter<any> = new EventEmitter();
  @Input() payrollId: number;

  public actionName = 'Additions';
  public DropZoneIsShown = true;
  public showPreviewContainer = true;
  public addedAdditions:ValidAddition[];
  public validationError;
  public records$:Observable<ValidAddition[]>;
  public adapter;
  public captions: UploaderCaptions = {
    dropzone: {
      title: "Drag and drop file here",
      or: "Only excel files are allowed",
      browse: "browse files"
    },
    cropper: {
      crop: "crop",
      cancel: "cancel"
    },
    previewCard: {
      remove: "remove",
      uploadError: "upload error"
    }
  }

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employee-email', 'employee-Name', 'additions-Name','gross-amount', 'error-message'],
    columns: [
      {
        key: 'employee-email',
        head: 'Employee Email',
        hidden: false,
        // type: TableCellTypes.email,
        value: (record:ValidAddition) => { return record.employeeOrganizationEmail },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },

          },
        }
      }, {
        key: 'employee-Name',
        head: 'Employee Name',
        hidden: false,
        value: (record:ValidAddition) => { return record.employeeName},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidAddition) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'additions-Name',
        head: 'Additions Name',
        hidden: false,
        value: (record:ValidAddition) => { return record.additionType },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidAddition) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'gross-amount',
        head: 'Gross Amount',
        hidden: false,
        value: (record: ValidAddition) => { return record.grossAmount },
        type:TableCellTypes.status,
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidAddition) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'error-message',
        head: 'Error Message',
        hidden: false,
        value: (record:ValidAddition) => { return record.validationErrorMessages },
        type:TableCellTypes.listOfErrors,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: ValidAddition) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      }
    ]
  }
  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
    this.adapter = new UploadFilePickerAdapter(this.payrollId, this._additionService, this.actionName);
  }

  uploadFail(event): void {
    this.validationError = event
    this.showPreviewContainer = false;
  }

  onUploadFail(error: HttpErrorResponse) {
    this.validationError = error
    this.showPreviewContainer = false;
  }

  onValidationError(error: ValidationError) {
    this.showPreviewContainer = false;
    if (error.error === 'EXTENSIONS') {
      this.validationError = `${error.file.name} extension is not supported.`
    }
  }

  onUploadSuccess(e: FilePreviewModel) {
    this.validationError = null
    this.DropZoneIsShown = false;
    this.addedAdditions = e.uploadResponse.result;
    this.records$ = of(e.uploadResponse.result);
    let importConfig = {
      file: e.file,
      status: true
    }
    this.canBeImport.emit(importConfig)
  }

  onRemoveSuccess(e: FilePreviewModel) {
    this.DropZoneIsShown = true;
    this.addedAdditions = null;
    this.validationError = null;
    this.showPreviewContainer = true;
    this.records$ = null;
    let importConfig = {
      file: e.file,
      status: false
    }
    this.canBeImport.emit(importConfig)
  }
  onFileAdded(dataFile:FilePreviewModel) {
    this.validationError = null;
    this.showPreviewContainer = true;
  }
  myCustomValidator(file: File): Observable<boolean> {
    if (!file.name.includes('uploader')) {
      return of(true);
    }
    return of(false);
  }
}
