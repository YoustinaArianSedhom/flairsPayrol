export interface EmployeeSalaryDetailsModel {
    id: number,
    name: string,
    nationalId: string,
    employeeType: number,
    joinedDate: string,
    managerName: string,
    title: string,
    salaryLevelName: string,
    monthlyGrossSalary: number,
    monthlyNetSalary: number,
    status: string,
    bankAccountName: string;
    employeeBoardingStatus:string;
    employeeInsuranceAmount: number;
    flairstechInsuranceAmount: number;
    insuranceStatus:number;
    socialInsurranceAmount: number;
    employmentDate: string;
}

export interface EmployeeFilterModel{
    insuranceStatusFilter?: number,
    entityId?: any,
}
