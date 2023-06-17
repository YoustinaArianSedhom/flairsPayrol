export interface EntityModel {
    id?: number;
    name: string;
    countryId: number;
    status?: number;
    value?: string;
    monthlyMinimumGrossSalaryForSocialInsurance?: number;
    monthlyMaximumGrossSalaryForSocialInsurance?: number;
    socialInsurancePercentage?: number;
    yearlyPersonalExemption?: number;
    currency?: number;
}

export interface country{
    id:number;
    name: string;
}

export interface entitySummary {
    entityId?: number;
    entityName?: string;
    numberOfContractors?: number;
    numberOfEmployees?: number;
    totalMonthlyGross?: number;
    totalMonthlyNet?: number;
}

export interface entityProfiles {
    id:number;
    name?: string;
    nationalId?: string;
    employeeType?: string;
    joinedDate?: string;
    managerName?: string;
    title?: string;
    salaryLevelName?: string;
    monthlyGrossSalary: number;
    monthlyNetSalary: number;
    status?: string;
}

export interface GlobalDeductionResponse{
    id:	number
    name?:	string
    value:	number
    entityId:	number
    entityName:	string
    createdDate:	string
    createdBy?:	string
    isApplied?: boolean;
    type?: number;
}

export interface GlobalDeductionModel{
    id? : number
    name: string
    value: number
    entityId: number
}

export interface GlobalAdditionModel {
    id?: number
    name: string
    entityId?: number
}

export interface GlobalAdditionResponse {
    id: number,
    name: string,
    value: number,
    isApplied: true,
    entityId: number,
    entityName: string,
    createdDate: Date,
    createdBy: {
        id: number,
        name: string
    }
}


/* global Deductions and Additions table records */

export interface GlobalAdditionAndDeductionModel {
    id: number,
    name: string,
    value: number,
    isApplied: true,
    entityId: number,
    entityName: string,
    createdDate: Date,
    createdBy: {
        id: number,
        name: string
    },
    type: string
}

export const GLOBAL_ADDITIONS_DEDUCTIONS_TYPES = {
    0: 'Addition',
    1: 'Deduction'
}
