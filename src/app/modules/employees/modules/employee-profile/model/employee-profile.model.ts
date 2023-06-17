export interface EmployeeWorkflowsModel {
    id: string,
    readableId: number,
    createdDate: Date,
    approvalDate: Date,
    workflowType: number,
    workflowTypeName: string,
    requestStatus: string,
    instanceNote: string
}

export interface EmployeeWorkflowDetailsModel {
    identifier: string;
    name: string;
    value: any
}
