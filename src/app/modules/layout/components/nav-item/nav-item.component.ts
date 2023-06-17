import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ShowSpinner } from '@core/modules/spinner/state/spinner.actions';
@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class NavItemComponent {
  @Input() link?: string;
  @Input() action?: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() current: any;
  @Input() children: any;
  @Input() iconsOnly: any;
  @Input() queries!: object;
  @Input() materialIcon!: { isSvg: boolean; name: string };
  @Output() clickHandler= new EventEmitter();
  public collapsed = true;


  constructor() { }


  public ShowChildren() {
    this.collapsed = !this.collapsed
  }


  @Dispatch() public showLoader() { return new ShowSpinner() }

}
