import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { SpinnerModule } from './modules/spinner/spinner.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from './http/http/http.service';
import { authConfig } from "./auth/config/oidc.config";
import { HeadersInterceptor } from "./http/interceptors/headers-interceptor";
import { ErrorHandlerInterceptor } from "./http/interceptors/error-handler.interceptor";
import { ForbiddenComponent } from "./modules/authorization/forbidden/forbidden.component";
import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage } from "angular-oauth2-oidc";
import { authModuleConfig } from "./auth/config/oauth-module.config";
import { AuthGuard } from "./auth/auth.guard";
import { FinanceGuard } from "./modules/authorization/guards/finance.guard";
import { EmployeeGuard } from "./modules/authorization/guards/employee.guard";
import { ManagerGuard } from "./modules/authorization/guards/manager.guard";
import { PayrollManagerGuard } from "./modules/authorization/guards/payroll-manager.guard";
import { FinanceITGuard } from "./modules/authorization/guards/finance-it.guard";
import { SomethingWentWrongComponent } from './components/something-went-wrong/something-went-wrong.component';





export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  declarations: [ForbiddenComponent, SomethingWentWrongComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    RouterModule,
    SpinnerModule,
  ],
  exports: [SpinnerModule],
  providers: [
    AuthGuard,
    FinanceGuard,
    EmployeeGuard,
    ManagerGuard,
    PayrollManagerGuard,
    FinanceITGuard,

    {
      provide: HttpService,
      useClass: HttpService
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    }, 
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: AuthConfig, useValue: authConfig },
        { provide: OAuthModuleConfig, useValue: authModuleConfig },
        { provide: OAuthStorage, useFactory: storageFactory },
      ]
    };
  }
}
