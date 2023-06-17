import { HttpEvent, HttpEventType } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { FilePickerAdapter, UploadResponse, UploadStatus, FilePreviewModel } from "ngx-awesome-uploader";
import { AdditionDeductionService } from '../../model/addition-deduction.service';
export class UploadFilePickerAdapter extends FilePickerAdapter {
  constructor(
    private _monthlyPayrollId: number,
    private _additionService: AdditionDeductionService,
    private actionName: string,
  ) {
    super();
  }
  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    if (this.actionName === 'Additions') {
      return this._additionService.validateAdditionExcelFile(this._monthlyPayrollId, fileItem.file, { reportProgress: true, observe: 'response' }).pipe(
        map((res: HttpEvent<any>) => {

          if (res?.type === HttpEventType.Response) {
            const responseFromBackend = res.body;
            return {
              body: responseFromBackend,
              status: UploadStatus.UPLOADED
            };
          } else if (res?.type === HttpEventType.UploadProgress) {
            /** Compute and show the % done: */
            const uploadProgress = +Math.round((100 * res.loaded) / res.total);
            return {
              status: UploadStatus.IN_PROGRESS,
              progress: uploadProgress
            };
          }
        }),
        catchError(er => {
          return of({ status: UploadStatus.ERROR, body: er.error.errorMessage });
        })
      );
    } else if (this.actionName === 'Deductions') {
      return this._additionService.validateDeductionsExcelFile(this._monthlyPayrollId, fileItem.file, { reportProgress: true, observe: 'response' }).pipe(
        map((res: HttpEvent<any>) => {

          if (res?.type === HttpEventType.Response) {
            const responseFromBackend = res.body;
            return {
              body: responseFromBackend,
              status: UploadStatus.UPLOADED
            };
          } else if (res?.type === HttpEventType.UploadProgress) {
            /** Compute and show the % done: */
            const uploadProgress = +Math.round((100 * res.loaded) / res.total);
            return {
              status: UploadStatus.IN_PROGRESS,
              progress: uploadProgress
            };
          }
        }),
        catchError(er => {
          return of({ status: UploadStatus.ERROR, body: er.error.errorMessage });
        })
      );
    }
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    return of('')
  }
}

