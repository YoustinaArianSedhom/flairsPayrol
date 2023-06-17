import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';


@Component({
    selector: 'app-form-monthly-payrolls',
    template: `

        <h2 mat-dialog-title>{{config.type}}</h2>

        <mat-dialog-content class="mat-typography pl-3 w-60 md:w-72">
            <section class="flex flex-col">
            
                <!-- Item -->
                <section
                [ngClass]="{'bg-red-50': !isAddition, 'bg-teal-10': isAddition}"
                class="shadow-sm px-3 py-2  my-3 " 
                *ngFor="let item of config.details"
                > 
                <div class="flex justify-between items-center">
                    <!-- Addition Name -->
                    <div class="info font-bold" *ngIf="isAddition"> {{item?.additionType?.name ? item.additionType.name : item.name }}</div>
                    
                    <!-- Deduction Name -->
                    <div class="info font-bold" *ngIf="!isAddition"> {{item.deductionType.name}}</div>
                    
                    
                    <!-- Addition - Deduction Value -->
                    <div class="value value-inline" [ngClass]="{
                        'text-red-600': !isAddition, 
                        'text-teal': isAddition}"> 
                        <mat-icon inline="true">{{isAddition ? 'arrow_upward': 'arrow_downward'}}</mat-icon> 
                        {{item.value | currency:'':'':'1.0'}}{{item.global || config.type == 'globalAdditions'  ? '%': ''}}</div>
                    </div>
                    

                    <!-- Paid by -->
                    <span 
                    *ngIf="!isAddition && item.global && !item.isApplied"
                    class="text-xs"
                    > Paid by <strong class="font-bold"> {{orgName}} </strong> </span>

                <div class="flex items-start justify-start pt-2" *ngIf="item.notes"> 
                    <mat-icon svgIcon="note" class="mr-1 note"></mat-icon>
                    <span class="text-sm font-medium"> {{item.notes}}</span>
                    
                </div>
                </section> 
            </section>
        </mat-dialog-content>


        <mat-dialog-actions align="end">
            <button mat-button class="actionBtn rounded-none" initialFocus mat-dialog-close>Done</button>   
        </mat-dialog-actions>


`,
    styleUrls: ['./addition-deduction-popup.component.scss']
})
export class AdditionDeductionComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public config: { details: any, type: string },
    ) { 
        console.log(this.config)
    }

    @SelectSnapshot(OrganizationState.orgName) public orgName: string;

    private readonly _ADDITIONS_TYPE = 'Additions';

    public get isAddition() {
        return this.config.type === this._ADDITIONS_TYPE || this.config.type === 'globalAdditions';
    }
}
