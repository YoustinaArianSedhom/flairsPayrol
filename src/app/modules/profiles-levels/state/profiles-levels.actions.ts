import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { ProfilesLevelsSummariesFiltrationModel, updateEmployeePersonalInfoConfigModel, UpdateProfileLevelConfigModel } from "../model/profiles-levels.model";

export class GetProfilesLevelsSummaries {
  static readonly type = '[Profiles Levels Summaries] Get';
}

export class SearchProfilesLevelsSummaries {
  static readonly type = '[Profiles Levels Summaries] Search';
  constructor(public searchQuery: string) {}
}


export class FilterProfilesLevelsSummaries {
  static readonly type = '[Profiles Levels Summaries] Filter';
  constructor(public filtration: ProfilesLevelsSummariesFiltrationModel) {}
}

export class ResetProfilesLevelsSummaries {
  static readonly type = '[Profiles Levels Summaries] Reset';
  constructor() {}
}


export class PaginateProfilesLevelsSummaries {
  static readonly type = '[Profiles Levels Summaries] Paginate';
  constructor(public pagination: PaginationConfigModel) {}
}


export class UpdateProfileLevel {
  static readonly type = '[Profiles Levels Summaries] Update Profile Level';
  constructor(public config: UpdateProfileLevelConfigModel) {}
}

export class UpdateProfilePersonalInfo {
  static readonly type = '[Profiles Levels Summaries] Update Profile Personal Info';
  constructor(public config: updateEmployeePersonalInfoConfigModel) {}
}
