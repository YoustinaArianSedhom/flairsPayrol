import * as REPORTS_MODELS from '@modules/reports/models/reports.model';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';


export class GetReports {
    static readonly type = '[REPORTS] Get Reports'
}

export class PaginateReports {
    static readonly type = '[REPORTS] Paginate Reports'
    constructor(public pagination: PaginationConfigModel) { }
}

export class FilterReports {
    static readonly type = '[REPORTS] Filter Reports'
    constructor(public filtration: REPORTS_MODELS.ReportsFiltrationModel) { }
}

export class ResetFilterReports {
    static readonly type = '[REPORTS] Reset Filter Reports'
    constructor(public filtration: REPORTS_MODELS.ReportsFiltrationModel) { }
}


export class GetManagersList {
    static readonly type = '[REPORTS] Get Managers List'
    constructor(public query: string) { }
}


export class GetPublishedPayrolls {
    static readonly type = '[REPORTS] Get Published Payrolls'
    constructor(public entityId: number) { }
}

export class GetExpensesReportAsExcel{
    static readonly type = '[REPORTS] Get Expenses Report As Excel';
    constructor(public managerName:string) { }
}
