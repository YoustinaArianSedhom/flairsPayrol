import { Component, OnInit } from '@angular/core';
import { SearchAllTeams } from '@modules/all-teams/state/all-teams.actions';
import { AllTeamsState } from '@modules/all-teams/state/all-teams.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss']
})
export class AllTeamsComponent implements OnInit {

constructor(private _store: Store,private _layoutService: LayoutService) {}

  public headInformation = { title: 'All Teams' };

  @ViewSelectSnapshot(AllTeamsState.searchQuery)
  public searchQuery: string;

  ngOnInit(): void {
    this._layoutService.setTitle(this.headInformation.title);

  }

  @Dispatch() public fireSearchAllTeamsActions(searchQuery: string) {
    return new SearchAllTeams(searchQuery);
  }

}
