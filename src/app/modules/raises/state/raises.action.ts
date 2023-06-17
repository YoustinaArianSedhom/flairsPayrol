import { RaisesFilterationModel } from "../model/raises";
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";

export class GetMyRaisesRequest {
    static readonly type = '[Raises] Get My Raises Request'
}
export class FilterMyRaises {
    static readonly type = '[Raises] Filter My Raises';
    constructor(public filteration: RaisesFilterationModel) { }
}
export class ResetFilterRaises {
    static readonly type = '[Raises] Reset My Raises';
}
export class ExportRaisesDataToExcel {
    static readonly type = '[Raises] Export Raises Data To Excel'
}
export class PaginateMyRaises {
    static readonly type = '[Raises] Paginate My Raises'
    constructor(public pagination: PaginationConfigModel) { }
}

