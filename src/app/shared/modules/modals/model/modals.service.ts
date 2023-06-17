import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../components/confirmation-dialog/confirmation-dialog.component";
import { FeedbackDialogComponent } from "../components/feedback-dialog/feedback-dialog.component";
import { ConfirmationDialogDataModel, FeedbackDialogDataModel } from './modals.model';
// import { FeedbackDialogComponent } from "../components/feedback-dialog/feedback-dialog.component";
// import { InputDialogComponent } from "../components/input-dialog/input-dialog.component";
// import { RatingDialogComponent } from "../components/rating-dialog/rating-dialog.component";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ModalsService {
  constructor(public dialog: MatDialog) {}

  openConfirmationDialog(data: ConfirmationDialogDataModel, proceedCallback): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: "fh-dialog--basic",
      // disableClose: true,
      data
    });

    dialogRef.afterClosed().subscribe((buttonClicked) => {
      if (buttonClicked === "proceed") proceedCallback();
    });
  }

  openFeedbackDialog(data: FeedbackDialogDataModel, autoDismissTime?) {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      panelClass: "fh-dialog--basic",
      data
    });
    if (autoDismissTime)
      setTimeout(() => {
        dialogRef.close();
      }, autoDismissTime * 1000);
  }
  
  openSuccessDialog(content?, autoDismissTime = 2) {
    const feedback: FeedbackDialogDataModel = {
      title: "Success",
      content: content || "Done!",
      status: "success",
    };
    this.openFeedbackDialog(feedback, autoDismissTime);
  }


  openFailDialog(content?, autoDismissTime = 2) {
    const feedback: FeedbackDialogDataModel = {
      title: "Error",
      content: content || "Process failed.",
      status: "fail"
    };
    this.openFeedbackDialog(feedback, autoDismissTime);
  }

  // Input Dialog
  // openInputDialog(data: InputDialogData, proceedCallback): void {
  //   const dialogRef = this.dialog.open(InputDialogComponent, {
  //     panelClass: "fh-dialog--basic",
  //     disableClose: true,
  //     data
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     proceedCallback(result);
  //   });
  // }

  // Rating Dialog
  // openRatingDialog(data: InputDialogData, proceedCallback): void {
  //   const dialogRef = this.dialog.open(RatingDialogComponent, {
  //     panelClass: "fh-dialog-basic",
  //     disableClose: true,
  //     data
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     proceedCallback(result);
  //   });
  // }


  /**
   * Generic method to open any dialog
   */
  public openDialog(component, config: MatDialogConfig, proceedCallback?) {
    const dialogRef = this.dialog.open(component, config);
    if (proceedCallback) dialogRef.afterClosed().subscribe(result => proceedCallback(result)); 
    return dialogRef;
  }
}
