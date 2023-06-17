export interface ReportModel {
    date: Date;
    employeeName: string;
    employeeEmail: string;
    employeeTitle: string;
    directManager: string;
    baseGrossSalary: number;
    actualGrossSalary: number;
    monthAdditionGross: number;
    monthAdditionsNet: number;
    additions: AdditionDeductionModel[]
    deductionsNet: number;
    deductions: AdditionDeductionModel[];
    paid: number;
    monthGlobalAdditionGross?:number;
}


export interface AdditionDeductionModel {
    id: number;
    additionType: {
        id: number;
        name: string
    };
    value: number;
    notes: string;
}

export interface ReportsFiltrationModel {
    entityId?: number;
    onlyDirects?: boolean;
    managerId?: number;
    payrollIds?: number[]
}


export interface ManagerModel {
    id: number;
    name: string;
    organizationEmail: string;
}


export interface PublishedPayrollModel {
    id: number;
    name: string;
    effectiveDate: Date
}
