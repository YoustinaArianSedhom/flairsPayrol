import { HttpEvent, HttpEventType } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { FilePickerAdapter, UploadResponse, UploadStatus, FilePreviewModel } from "ngx-awesome-uploader";
import { AllocationService } from "../../model/allocations.service";
export class UploadFilePickerAdapter extends FilePickerAdapter {
  constructor(
    private _monthlyPayrollId: number,
    private _allocationService: AllocationService,
    ) {
    super();
  }
  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {      
  return this._allocationService.addAllocations(this._monthlyPayrollId, fileItem.file, { reportProgress: true, observe:'response' }).pipe(
      map((res: HttpEvent<any>) => {
        console.log('res service',res)
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          console.log('backend',responseFromBackend)
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress
          };
        }
      }),
      catchError(er => {
        console.log(er.error.errorMessage);
        return of({ status: UploadStatus.ERROR, body: er.error.errorMessage });
      })
    );
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    return of('')
  }
}
  
