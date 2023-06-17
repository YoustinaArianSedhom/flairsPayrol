export interface RaisesModel {
    employeeName: string;
    employeeEmail: string;
    entityName: string;
    jobName: string;
    departmentName: string;
    oldGrossSalary: number;
    newGrossSalary: number;
    oldNetSalary: number;
    newNetSalary: number;
    appliedMonth: string;
    note: string;
    raiseReason: string;
    requestedBy: string;
}
export interface RaisesFilterationModel {
    month: number;
    year: number;
}



