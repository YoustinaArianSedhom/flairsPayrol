import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEntityFormComponent } from '@modules/employees/modules/employee-salary/components/employee-entity-form/employee-entity-form.component';
import { JoinedEntityModel } from '../../model/salary-details.model';
import { LeaveEntityFormComponent } from '../leave-entity-form/leave-entity-form.component';

@Component({
  selector: 'app-employee-entity-info',
  templateUrl: './employee-entity-info.component.html',
  styleUrls: ['./employee-entity-info.component.scss']
})
export class EmployeeEntityInfoComponent {

  constructor(
    private _matDialog: MatDialog,
  ) { }

  @Input() public entityInfo: JoinedEntityModel;
  @Input() public entitiesHistory: JoinedEntityModel;
  @Input() public profileId: number;
  @Input() public isEntityEditable: boolean;


  public onEntityLeave(leftDate?: Date) {
    this._matDialog.open(LeaveEntityFormComponent, {
      data: {
        profileId: this.profileId,
        entityId: this.entityInfo[0].entityId,
        leftDate: leftDate ?? new Date(),
        type: leftDate ? 'update' : 'leave'
      }
    })
  }


  public onEntityUpdate(entityId) {
    this._matDialog.open(EmployeeEntityFormComponent, {
      data: {
        entity: {...this.entityInfo[0], profileId: this.profileId, entityId: this.entityInfo[0].entityId},
      },
      panelClass: ['FormDialog']
    })
  }


  public onJoinEntity() {
    this._matDialog.open(EmployeeEntityFormComponent, {
      data: { entity: {...this.entityInfo, profileId : this.profileId}},
      panelClass: ['FormDialog'],
    })
  }

}
