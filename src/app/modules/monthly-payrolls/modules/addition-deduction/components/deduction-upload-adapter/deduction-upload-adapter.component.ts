import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableCellTypes, TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { Observable, of } from 'rxjs';
import { ValidateDeduction } from '../../model/addition-deduction.model';
import { AdditionDeductionService } from '../../model/addition-deduction.service';
import { UploadFilePickerAdapter } from '../addition-upload-adapter/upload.adapter';
@Component({
  selector: 'app-deduction-upload-adapter',
  templateUrl: './deduction-upload-adapter.component.html',
  styleUrls: ['./deduction-upload-adapter.component.scss']
})
export class DeductionUploadAdapterComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _additionService: AdditionDeductionService
  ) { }

  @Output() canBeImport: EventEmitter<any> = new EventEmitter();
  @Input() payrollId: number;

  public actionName = 'Deductions';
  public DropZoneIsShown = true;
  public showPreviewContainer = true;
  public addedDeductions:ValidateDeduction[];
  public validationError;
  public records$:Observable<ValidateDeduction[]>;
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
    keys: ['employee-email', 'employee-Name', 'deductions-Name','net-amount', 'error-message'],
    columns: [
      {
        key: 'employee-email',
        head: 'Employee Email',
        hidden: false,
        // type: TableCellTypes.email,
        value: (record:ValidateDeduction) => { return record.employeeOrganizationEmail },
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
        value: (record:ValidateDeduction) => { return record.employeeName},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidateDeduction) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'deductions-Name',
        head: 'Deductions Name',
        hidden: false,
        value: (record:ValidateDeduction) => { return record.deductionType },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidateDeduction) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'net-amount',
        head: 'Net Amount',
        hidden: false,
        value: (record: ValidateDeduction) => { return record.netAmount },
        type:TableCellTypes.status,
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record:ValidateDeduction) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      },
      {
        key: 'error-message',
        head: 'Error Message',
        hidden: false,
        value: (record:ValidateDeduction) => { return record.validationErrorMessages },
        type:TableCellTypes.listOfErrors,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: ValidateDeduction) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
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
    // this.validationError = error
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
    this.addedDeductions = e.uploadResponse.result;
    this.records$ = of(e.uploadResponse.result);
    let importConfig = {
      file: e.file,
      status: true,
      results: e.uploadResponse.result
    }
    this.canBeImport.emit(importConfig)
  }

  onRemoveSuccess(e: FilePreviewModel) {
    this.DropZoneIsShown = true;
    this.addedDeductions = null;
    this.validationError = null;
    this.showPreviewContainer = true;
    this.records$ = null;
    let importConfig = {
      file: e.file,
      status: false,
      results: null
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
