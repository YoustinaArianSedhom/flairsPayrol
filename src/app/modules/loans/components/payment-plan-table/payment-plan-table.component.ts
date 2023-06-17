import { Component, Input, OnInit } from '@angular/core';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import * as LOANS_MODEL from '@modules/loans/model/loans.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-plan-table',
  templateUrl: './payment-plan-table.component.html',
  styleUrls: ['./payment-plan-table.component.scss']
})
export class PaymentPlanTableComponent implements OnInit{

  public paymentPlan$: Observable<LOANS_MODEL.PaymentPlanListModel>;

  @Input() set paymentPlanData(paymentPlan$: Observable<LOANS_MODEL.PaymentPlanListModel>) {
    this.paymentPlan$ = paymentPlan$;
  }
  get paymentPlanData() {
    return this.paymentPlan$;
  }
  public endInstallmentsDate: Date;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: []
    ,
    keys: ['payment-date', 'payment-amount', 'percentage', 'remaining-amount'],
    columns: [
      {
        key: 'payment-date',
        head: 'Payment Date',
        hidden: false,
        value: (record: LOANS_MODEL.PaymentPlanListModel) => {
          return record.date;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.dateMonthYear,
      },
      {
        key: 'payment-amount',
        head: 'Payment Amount',
        hidden: false,
        value: (record: LOANS_MODEL.PaymentPlanListModel) => {
          return record.installmentAmount;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.currency
      },
      {
        key: 'percentage',
        head: 'Percentage',
        hidden: false,
        value: (record: LOANS_MODEL.PaymentPlanListModel) => {
          return Math.round(record.installmentPercentageOfTotalAmount * 100) / 100 + ' %';
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
      },
      {
        key: 'remaining-amount',
        head: 'Remaining Amount',
        hidden: false,
        value: (record: LOANS_MODEL.PaymentPlanListModel) => {
          return record.remainingAmount;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
          },
        },
        type: TableCellTypes.currency
      }
    ]
  }

  constructor() { }

  ngOnInit(): void {
    this.paymentPlan$.subscribe(data => {
      if(data){      
        this.endInstallmentsDate = data[Object.values(data).length-1].date ;
      }
    })
  }

}
