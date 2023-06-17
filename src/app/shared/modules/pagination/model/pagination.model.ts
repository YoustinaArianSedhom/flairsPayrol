export interface PaginationConfigModel {
    pageSize?: number;
    pageNumber?: number;
    pageSizeOptions?: number[];
    hidePageSize?: boolean;
    previousPageIndex?: number;
    recordsTotalCount?: number;
    totalPages?: number;
    activePageSize?: number;
}