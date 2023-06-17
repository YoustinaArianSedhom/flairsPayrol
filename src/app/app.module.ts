import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { statesConfig } from '@core/config/state.config';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@modules/layout/layout.module';
import { CoreModule } from '@core/core.module';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
// import { AuthModule } from 'angular-auth-oidc-client';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),

    NgxsSelectSnapshotModule.forRoot(),

    LayoutModule,

    // AuthModule.forRoot(),

    NgxsModule.forRoot([
      ...statesConfig.coreStates
    ], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot({
      key: [...statesConfig.statesToBeCached],
      storage: StorageOption.LocalStorage
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name:'payroll'
    }),
    NgxsDispatchPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot()
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
