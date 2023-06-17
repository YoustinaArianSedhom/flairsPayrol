// User information model which must be used as the single trusted reference for logged in user interface

export interface UserModel {
    profileId: number;
    profileName: string;
    profileTitle: string;
    profileRoles: string[]
}

export interface Role {
    roleName: string;
    organizationName: string;
    organizationId: number;
}
export interface ProfileModel {
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
    syncedDate: Date,
    submittedDate: Date,
    archivedDate: Date,
    bankName: string,
    bankAccountName: string,
    bankAccountNumber: string,
    hrCode?:string,
    roles: string[],
    jobLevelName?: string;
    profileImageLink?:string
}

export interface MyWorkflowsModel {
    id: string,
    readableId: number,
    createdDate: Date,
    approvalDate: Date,
    workflowType: number,
    workflowTypeName: string,
    requestStatus: string,
    instanceNote: string
}

export interface MyWorkflowDetailsModel {
    identifier: string;
    name: string;
    value: any
}

export const loggedInIdentifier = 'profileId';
