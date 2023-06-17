import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { Observable, of } from 'rxjs';
import { AllocationService } from '../../model/allocations.service';
import { UploadFilePickerAdapter } from '../upload-adapter/upload.adapter';
export interface addedAllocations {
  organizationEmail: string,
  name: string,
  days: number
}
@Component({
  selector: 'app-upload-adapter',
  templateUrl: './upload-adapter.component.html',
  styleUrls: ['./upload-adapter.component.scss']
})

export class UploadAdapterComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _allocationService: AllocationService
  ) { }

  @Output() canBeImport: EventEmitter<any> = new EventEmitter();
  @Input() payrollId: number;

  private myFiles: FilePreviewModel[] = [];
  public DropZoneIsShown = true;
  public showPreviewContainer = true;
  public addedAllocations: addedAllocations[];
  public validationError;
  public records$;
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
    actions: [
    ],
    keys: ['organizationEmail', 'name', 'days'],
    columns: [
      {
        key: 'organizationEmail',
        head: 'Organization Email',
        hidden: false,
        type: TableCellTypes.status,
        value: (record) => { return record.organizationEmail },
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
        key: 'name',
        head: 'name',
        hidden: false,
        type: TableCellTypes.status,
        value: (record) => { return record.name },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      }, {
        key: 'days',
        head: 'days',
        hidden: false,
        type: TableCellTypes.status,
        value: (record) => {
          return record.days
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record) => { return (record.isValid) ? 'text-teal' : 'text-red-500' },
          }
        }
      }
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
    this.adapter = new UploadFilePickerAdapter(this.payrollId, this._allocationService);
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
    this.addedAllocations = e.uploadResponse.result;
    this.records$ = of(e.uploadResponse.result)
    let importConfig = {
      file: e.file,
      status: true
    }
    this.canBeImport.emit(importConfig)
  }

  onRemoveSuccess(e: FilePreviewModel) {
    this.DropZoneIsShown = true;
    this.addedAllocations = null;
    this.validationError = null;
    this.showPreviewContainer = true;
    this.records$ = null;
    let importConfig = {
      file: e.file,
      status: false
    }
    this.canBeImport.emit(importConfig)

    console.log(e);
  }
  onFileAdded(file: FilePreviewModel) {
    this.validationError = null;
    this.showPreviewContainer = true;
    this.myFiles.push(file);
  }
  myCustomValidator(file: File): Observable<boolean> {
    if (!file.name.includes('uploader')) {
      return of(true);
    }
    return of(false);
  }

}

