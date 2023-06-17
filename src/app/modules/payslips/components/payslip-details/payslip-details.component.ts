import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayslipModel } from '../../model/payslips.model';

@Component({
  selector: 'app-payslip-details',
  templateUrl: './payslip-details.component.html',
  styleUrls: ['./payslip-details.component.scss']
})
export class PayslipDetailsComponent {
  public record: PayslipModel;
  public totalAdditions = 0;
  public totalDeductions = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { record: PayslipModel }
  ) {
    this.record = this.data.record;
    this.record.effects.map(effect => {
      if (effect.value > 0) {
        this.totalAdditions = this.totalAdditions + effect.value
      } else {
        this.totalDeductions = this.totalDeductions + effect.value;
      }
    })
  }

}
