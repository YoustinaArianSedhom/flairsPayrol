import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { HRDataFilterModel } from '../models/hr-data.models';

export class GetProfilesHRData {
   static readonly type = '[HR-DATA] Get Profiles HR Data';
}

export class FilterHRDataProfiles {
   static readonly type = '[HR-DATA] Filter Profiles HR Data';
   constructor(public filtration: HRDataFilterModel) { }
}
export class PaginateProfilesHRData {
   static readonly type = '[HR-DATA] Paginate Profiles HR Data';
   constructor(public pagination: PaginationConfigModel) { }
}

export class ClearFilterHRDataProfiles {
   static readonly type = '[HR-DATA] Clear Filter Profiles HR Data';
}

export class GetAllProfileStatuses {
   static readonly type = '[HR-DATA] Get ALl Profile Statuses';
}
export class FindDepartments {
   static readonly type = '[HR-DATA] Find Departments';
}
export class FindManagers {
   static readonly type = '[HR-DATA] Find Managers';
}
export class ExportProfilesHRDataToExcel {
   static readonly type = '[HR-DATA] Export Profiles HR Data To Excel';
}
