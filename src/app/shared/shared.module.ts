import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from './components/shared-components.module';
import { MaterialModule } from './material.module';
import { ModalsModule } from './modules/modals/modals.module';
import { PaginationModule } from './modules/pagination/pagination.module';
import { SelectsModule } from './modules/selects/selects.module';
import { SnackbarsModule } from './modules/snackbars/snackbars.module';
import { TablesModule } from './modules/tables/tables.module';
import { ValidationModule } from './modules/validation/validation.module';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedComponentsModule,
        ValidationModule,
        TablesModule,
        ModalsModule,
        PaginationModule,
        SnackbarsModule,
        SelectsModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedComponentsModule,
        ValidationModule,
        TablesModule,
        ModalsModule,
        PaginationModule,
        SnackbarsModule,
        SelectsModule,
    ],
    declarations: [],
    providers: [],
})
export class SharedModule { }
