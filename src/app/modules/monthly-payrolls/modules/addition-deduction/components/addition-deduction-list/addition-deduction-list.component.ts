import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-addition-deduction-list',
  templateUrl: './addition-deduction-list.component.html',
  styleUrls: ['./addition-deduction-list.component.scss']
})
export class AdditionDeductionListComponent {

  constructor() { }
  @Input() public records;
  @Input() public type;
  @Input() public isEditable: string;
  @Output() public additionDeductionDelete: EventEmitter<any> = new EventEmitter();
  @Output() public additionDeductionUpdate: EventEmitter<any> = new EventEmitter();


  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  public monthName(month) {
    return this.monthNames[month]
  }

  public deleteRecords(record) {
    this.additionDeductionDelete.emit(record)
  }

  public updateRecord(record) {
    this.additionDeductionUpdate.emit(record)
  }

}
