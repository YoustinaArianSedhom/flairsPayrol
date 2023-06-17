import { Component, OnInit } from '@angular/core';
import {
  SearchMyHrTeamMembers,
} from '../../state/hr-management.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { MyHrTeamState } from '@modules/hr-management/state/hr-management.state';
import { LayoutService } from '@modules/layout/model/layout.service';

@Component({
  selector: 'app-hr-management',
  templateUrl: './hr-management.component.html',
  styleUrls: ['./hr-management.component.scss'],
})
export class HrManagementComponent implements OnInit {
  constructor(private _store: Store, private _layoutService: LayoutService) {}

  public headInformation = { title: 'HR Management' };

  @ViewSelectSnapshot(MyHrTeamState.searchQuery)
  public searchQuery: string;

  ngOnInit(): void {
    this._layoutService.setTitle(this.headInformation.title);
  }

  @Dispatch() public fireSearchMyHrTeamMembersAction(searchQuery: string) {
    return new SearchMyHrTeamMembers(searchQuery);
  }
}
