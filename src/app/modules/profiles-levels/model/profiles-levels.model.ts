export interface ProfileLevelSummary {
    id: number,
    name: string,
    nationalId: string,
    employeeType: string,
    hrCode: string,
    managerName: string,
    title: string,
    medicalInsuranceNumber: string,
    socialInsuranceNumber: string,
    salaryLevelId: number,
    salaryLevelName: string,
    levelStatusId: number,
    levelStatusName: string,
    status: string
}

export interface ProfilesLevelsSummariesFiltrationModel {
    searchQuery?: string;
    entityId?: number;
    salaryLevelIds?: number[],
    levelStatuses?: number[]
}

export interface UpdateProfileLevelConfigModel {
    profileId: number;
    entityId: number;
    salaryLevelId: number;
}

export interface updateEmployeePersonalInfoConfigModel {
    id?: number,
    nationalId?: number,
    medicalInsuranceNumber?: number,
    socialInsuranceNumber?: number,
    hrCode?: string
}
