import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeePersonalInfo } from '../../model/salary-details.model';

@Component({
  selector: 'app-employee-personal-info',
  templateUrl: 'employee-personal-info.component.html',
  styles: [
  ]
})
export class EmployeePersonalInfoComponent {


  constructor() { }

  @Input() public personalInfo: EmployeePersonalInfo;
  @Output() public personalInfoUpdate: EventEmitter<any> = new EventEmitter();



}
