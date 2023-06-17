import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { InnerPageLayoutComponent } from './inner-page-layout/inner-page-layout.component';
import { LinkComponent } from './link/link.component';
import { NoResultComponent } from './no-result/no-result.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { StatsCardModule } from './stats-card/stats-card.module';
import { DownloadEmptyTemplateComponent } from '@shared/modules/tables/components/download-empty-template/download-empty-template.component';

@NgModule({
    imports: [CommonModule, RouterModule, MaterialModule, StatsCardModule],
    exports: [InnerPageLayoutComponent, NoResultComponent, SearchInputComponent, LinkComponent, StatsCardModule, DownloadEmptyTemplateComponent],
    declarations: [InnerPageLayoutComponent, NoResultComponent, SearchInputComponent, LinkComponent, DownloadEmptyTemplateComponent],
    providers: [],
})
export class SharedComponentsModule { }
