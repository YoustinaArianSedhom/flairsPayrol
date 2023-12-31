import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, ReplaySubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { OrgConfigInst } from '@core/config/organization.config';
import { ApiResponse } from '@core/http/apis.model';
import { LoggedInUserModel } from './auth.interface';
import { Store } from '@ngxs/store';
import { HttpService } from '@core/http/http/http.service';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
import { SetUser } from '@core/modules/user/state/user.actions';
import { UserState } from '@core/modules/user/state/user.state';
import { StorageService } from '@core/services/storage/storage.service';
import { Location } from '@angular/common';
import { NotifyAllOriginContextsToLogin } from '../state/auth.actions';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { OauthEventsTypes, OauthFailsMessages } from '../config/oauth-events.config';
import { LoadSystemRoles, SetGrantedRoles } from '@core/modules/authorization/state/authorization.actions';
import { SystemRoles } from '@core/modules/authorization/model/authorization.config';


@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(
        private readonly _oauthService: OAuthService,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _http: HttpService,
        private readonly _storage: StorageService,
        private readonly _location: Location,
        private readonly _snacks: SnackBarsService
    ) {
        this._logAuthProcessInfo();
        this._listenToStorageEvents();
        // this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(
        //     event => this.isAuthenticatedSubject$.next(this._oauthService.hasValidAccessToken())
        // )
        this._setupOauthServiceEventsHandlers();
        // this._oauthService.setupAutomaticSilentRefresh();
    }


    public get roles(): string[] {
        return this._store.selectSnapshot(UserState.user).profileRoles;
    }

    public get isEmployee(): boolean {
        return this.isHaveRole(SystemRoles.Employee);
    }

    public get isManager(): boolean {
        return this.isHaveRole(SystemRoles.Manager);
    }

    public get isPayrollManager(): boolean {
        return this.isHaveRole(SystemRoles.PayrollManager);
    }

    public get isITSupport(): boolean {
        return this.isHaveRole(SystemRoles.ITSupport);
    }

    public get isFinance(): boolean {
        return this.isHaveRole(SystemRoles.Finance);
    }
    public get isCEO(): boolean {
        return this.isHaveRole(SystemRoles.CEO);
    }
    public get isHRManager(): boolean {
        return this.isHaveRole(SystemRoles.HRManager);
    }

    public get isHR():boolean {
        return this.isHaveRole(SystemRoles.HR)
    }

    public get isITHelpDesk():boolean {
        return this.isHaveRole(SystemRoles.IT_HELP_DESK)
    }

    public get isBusinessPartner(): boolean {
        return this.isHaveRole(SystemRoles.BusinessPartner);
    }

    /**
 * Check if applicationsUserRoles have custom role
 */
    private isHaveRole(role: string) {
        return this.roles.includes(role);
    }



    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
    public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

    /**
     * Publishes `true` if and only if (a) all the asynchronous initial
     * login calls have completed or errorred, and (b) the user ended up
     * being authenticated.
     *
     * In essence, it combines:
     *
     * - the latest known state of whether the user is authorized
     * - whether the ajax calls for initial log in have all been done
     */
    public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
        this.isAuthenticated$,
        this.isDoneLoading$
    ]).pipe(map(values => values.every(b => b)));






    public navigateToLoginPage() {
        this._router.navigate([OrgConfigInst.LOGIN_ROUTE]);
    }



    /**
     * Get user info then fire SetUser Action which will save user data to storage
     */
    public setupUserInfo() {
        return this._http.fetch(`Auth/GetMyUserInfo`).pipe(
            tap(({ result: user }: ApiResponse<LoggedInUserModel>) => {
                this._store.dispatch(new SetUser(user))
                this._store.dispatch(new SetGrantedRoles(user.profileRoles));
            }))
    }


    public setTargetUrl() {
        this._storage.set('targetUrl', this._location.path(), this._storage.SESSION_STORAGE)
    }


    public hasValidToken() { return this._oauthService.hasValidAccessToken(); }
    public get refreshToken() {return this._oauthService.getRefreshToken()}


    // Debugging Info
    private _logAuthProcessInfo() {
        this._oauthService.events.subscribe(event => {
            if (event instanceof OAuthErrorEvent) console.error('OAuthErrorEvent Object:', event);
            else console.warn('OAuthEvent Object:', event);
        });
    }

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    private _listenToStorageEvents() {

        window.addEventListener('storage', (event) => {
            // The `key` is `null` if the event was caused by `.clear()`
            if (event.key !== 'access_token' && event.key !== null) {
                return;
            }

            console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
            this.isAuthenticatedSubject$.next(this._oauthService.hasValidAccessToken());

            if (!this._oauthService.hasValidAccessToken()) {
                this.navigateToLoginPage();
            }
        });
    }



    /**
     * Setup all the needed handlers for events we need to listen to
     */
    private _setupOauthServiceEventsHandlers() {
        /**
         * Updated Authenticated status whenever any change on state happened
         */
        this._oauthService.events
            .subscribe(_ => {
                const isAuthorized = this._oauthService.getAccessToken() ? true : false;
                this.isAuthenticatedSubject$.next(isAuthorized);
            });


        /**
         * ON access_token expiration
         */
        this._oauthService.events
            .pipe(filter((e: OAuthEvent) => OauthEventsTypes.tokenExpires == e.type && ['access_token'].includes(e['info'])))
            .subscribe(e => {
                // this._modals.openFailDialog('[Auth Service] Access token has been expired', 5);
                // Don't refresh token if user is on login page
                // if (window.location.pathname != OrgConfigInst.ROUTES_CONFIG.login) {
                //     console.info('[Auth Service] Access token has been expired');
                //     this._store.dispatch(new RefreshToken)
                // }
                console.info('[Auth Service] One of ID_TOKEN and ACCESS_TOKEN has been expired');

            })



        /**
         * On new Session initializing 
         */
        this._oauthService.events
            .pipe(filter((e: OAuthEvent) => OauthEventsTypes.tokenReceived == e.type))
            .subscribe(e => {
                forkJoin([
                    this.setupUserInfo(),
                    this._store.dispatch(new GetMyOrganization),
                    this._store.dispatch(new LoadSystemRoles)
                ]).subscribe(() => {
                    console.info('[Auth Service] Setup all the needed information before user start his session');
                    this._store.dispatch(new NotifyAllOriginContextsToLogin)
                }, (error) => {
                    console.error(OauthFailsMessages.failToAuthenticate, error);
                    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.login]);
                    this._snacks.openFailureSnackbar({
                        message: OauthFailsMessages.failToAuthenticate, 
                        duration: 8
                    })
                });
            });

        this._oauthService.events.pipe(filter((e) => OauthEventsTypes.discoveryDocumentLoadFails == e.type))
        .subscribe(error => {
            console.error(OauthFailsMessages.failToCommunicate, error)
            this._snacks.openFailureSnackbar({
                message: OauthFailsMessages.failToCommunicate, 
                duration: 8
            })
        })


        /**
         * On Session Terminating or any other case
         */
        this._oauthService.events
            .pipe(filter(e => OauthEventsTypes.sessionTerminated == e.type || OauthEventsTypes.sessionError == e.type))
            .subscribe(e => {
                console.info('[Auth Service] Session has been ended due to termination or error', e)
                this._snacks.openFailureSnackbar({
                    message: 'Unexpected Error happened while authenticating current user, Please try again',
                    duration: 8
                })
                this.navigateToLoginPage();
            });
    }

    /**
    * Setup basis for authentication flow
    */
    public async runInitialLoginSequence(): Promise<void> {
        try {
            await this._oauthService.loadDiscoveryDocument();
            // Try to log in via hash fragment after redirect back
            await this._oauthService.tryLoginCodeFlow();
            // if (this.oauthService.hasValidAccessToken()) return;
            this.isDoneLoadingSubject$.next(true)
        } catch (error) {
            console.error(error)
            this.isDoneLoadingSubject$.next(true)
        }



    }


}




 // return this.oauthService.loadDiscoveryDocument()


        //     // 1. HASH LOGIN:
        //     // Try to log in via hash fragment after redirect back
        //     // from IdServer from initImplicitFlow:
        //     .then(() => this.oauthService.tryLogin())


        //     .then(() => {
        //         if (this.oauthService.hasValidAccessToken()) {
        //             return Promise.resolve();
        //         }

        //         // 2. SILENT LOGIN:
        //         // Try to log in via a refresh because then we can prevent
        //         // needing to redirect the user:
        //         // return this.oauthService.silentRefresh()
        //         //     .then(() => Promise.resolve())
        //         //     .catch(result => {
        //         //         // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
        //         //         // Only the ones where it's reasonably sure that sending the
        //         //         // user to the IdServer will help.
        //         //         const errorResponsesRequiringUserInteraction = [
        //         //             'interaction_required',
        //         //             'login_required',
        //         //             'account_selection_required',
        //         //             'consent_required',
        //         //         ];

        //         //         if (result
        //         //             && result.reason
        //         //             && errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >= 0) {

        //         //             // 3. ASK FOR LOGIN:
        //         //             // At this point we know for sure that we have to ask the
        //         //             // user to log in, so we redirect them to the IdServer to
        //         //             // enter credentials.
        //         //             //
        //         //             // Enable this to ALWAYS force a user to login.
        //         //             // this.login();
        //         //             //
        //         //             // Instead, we'll now do this:
        //         //             console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
        //         //             return Promise.resolve();
        //         //         }

        //         //         // We can't handle the truth, just pass on the problem to the
        //         //         // next handler.
        //         //         return Promise.reject(result);
        //         //     });
        //     })

        //     .then(() => {
        //         this.isDoneLoadingSubject$.next(true);
        //     })
        //     .catch(() => this.isDoneLoadingSubject$.next(true));