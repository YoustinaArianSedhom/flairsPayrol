import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankInfo } from '../../model/salary-details.model';

@Component({
  selector: 'app-employee-bank-info',
  templateUrl: './employee-bank-info.component.html',
  styles: []
})
export class EmployeeBankInfoComponent {

  constructor(
    private _matDialog: MatDialog
  ) { }
  @Input() public bankInfo: BankInfo;
  @Output() public bankInfoUpdate: EventEmitter<any> = new EventEmitter();


}
