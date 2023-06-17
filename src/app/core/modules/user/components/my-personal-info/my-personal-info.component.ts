import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileModel } from '@core/modules/user/model/user.model';

@Component({
  selector: 'app-my-personal-info',
  templateUrl: './my-personal-info.component.html',
  styles: [
    `
        .value{
          word-break: break-word ;
          text-align: center ;
        }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPersonalInfoComponent{

  @Input() public personalInfo: ProfileModel;
  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  public onEditClicked() {
    this.rolesEdit.emit();
  }

}
