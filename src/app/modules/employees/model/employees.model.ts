export interface EmployeeModel {
    id: number,
    name: string,
    organizationEmail: string,
    title: string,
    managerId: number,
    managerName: string,
    nationalId: string,
    medicalInsuranceNumber: string,
    socialInsuranceNumber: string,
    status: number,
    syncedDate: Date | string,
    submittedDate: Date,
    archivedDate: Date,
    bankName: string,
    bankAccountName: string,
    bankAccountNumber: string,
    hrCode?:string,
    roles: string[],
    jobLevelName?: string;
    flairstechJoinDate: Date,
}
export interface FiltrationModel{
    searchQuery?: string;
    roles?: string[];
    statuses?: number[];
}

export interface UsersRolesModel{
      id: string;
      name: string;
}
     
export type openedFromType = 'inside' | 'outside'
export type formMode = 'update' | 'add'
