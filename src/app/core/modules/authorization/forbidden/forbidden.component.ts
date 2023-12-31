import { Component, OnInit } from '@angular/core';
import { OrgConfigInst } from '@core/config/organization.config';
import { ResetUserInfo } from '@core/modules/user/state/user.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Navigate } from '@ngxs/router-plugin';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.scss']
})

export class ForbiddenComponent implements OnInit {
    constructor() { }

    public exceptionMessage = OrgConfigInst.CRUD_CONFIG.errorsMessages.forbidden;
    ngOnInit() { }

    public onReturningHome() {
        this.fireResettingUserInfo();
        this.fireNavigateToHome();
    }


    @Dispatch() public fireResettingUserInfo() { return new ResetUserInfo}
    @Dispatch() public fireNavigateToHome() {return new Navigate([OrgConfigInst.ROUTES_CONFIG.root])}
}