import { Component, OnInit } from '@angular/core';
import { OrgConfigInst } from '@core/config/organization.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-something-went-wrong',
  templateUrl: './something-went-wrong.component.html',
  styles: [
  ]
})
export class SomethingWentWrongComponent implements OnInit {

  public exceptionMessage = OrgConfigInst.CRUD_CONFIG.errorsMessages.notFound;
    ngOnInit() { }

    public onReturningHome() {
        this.fireNavigateToHome();
    }


    @Dispatch() public fireNavigateToHome() {return new Navigate([OrgConfigInst.ROUTES_CONFIG.root])}

}
