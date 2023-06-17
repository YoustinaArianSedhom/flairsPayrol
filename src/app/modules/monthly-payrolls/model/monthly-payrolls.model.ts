import { OrgEntityModel } from "@core/modules/organization/model/organization.model";
import { DoneByModel } from "@shared/models/done-by.model";

export interface MonthlyPayrollModel {
    id: number;
    name: string;
    month: number;
    year: number;
    status: number;
    entityId: number;
    entity: OrgEntityModel;
    createdDate: Date;
    createdBy: DoneByModel;
    closedDate: Date;
    closedBy: DoneByModel;
    publishedDate: Date;
    publishedBy: DoneByModel;
    payrollModificationsCount: number;
}


export interface MonthlyPayrollSummaryModel {
    id: number;
    name: string;
    month: number;
    year: number;
    status: number;
    entityId: number;
    entity: {
        id: number;
        name: string;
        status: number;
        countryId: number;
        createdDate: Date;
        createdBy: string;
        currency: number;
        monthlyMinimumGrossSalaryForSocialInsurance: number;
        monthlyMaximumGrossSalaryForSocialInsurance: number;
        socialInsurancePercentage: number;
        yearlyPersonalExemption: number
    };
    totalNetSalaries: number;
    totalGrossSalaries: number;
    totalPaidSalaries: number;
    createdDate: Date;
    createdBy: DoneByModel;
    lastModifiedDate: Date;
    lastModifiedBy: DoneByModel;
    closedDate: Date;
    closedBy: DoneByModel;
    publishedDate: Date;
    publishedBy: DoneByModel;
    allocationSheetUploaded: boolean;
    additionSheetUploaded: boolean;
    deductionSheetUploaded: boolean;
    isPayrollModifiedAfterPublish?: boolean;
    payrollModificationsCount: number
}

export interface MonthlyPayrollDetailsModel {
    profileId: number;
    profileName: string;
    profileTitle: string;
    profileOrganizationEmail: string;
    profileStatus: number;
    grossSalary: number;
    netSalary: number;
    monthlyNetSalaryWithAdditionsAndGlobalAdditions: number;
    totalAdditions: number;
    totalGlobalAdditions: number;
    totalDeductions: number;
    totalGlobalDeductions: number;
    totalTaxes: number;
    additionsTaxes: number;
    baseGrossSalaryTaxes: number;
    globalAdditionsTaxes: number;
    workingDays: number;
    paidSalary: number;
    additions: additionItem[];
    deductions: deductionItem[];
    employeeBoardingStatus: string;
    employeeInsuranceAmount: number;
    flairstechInsuranceAmount: number;
    insuranceStatus: number;
    socialInsurranceAmount: number;
    transferDate: Date;
    isTransferred: boolean
    salarySuspensionStatus: string;
    releasedAmount: number;
    totalPaid: number;
    loyaltyBonusPercentage: number;
    loyaltyBonusValue: number;
}

export interface additionItem {
    id: number;
    additionType: {
        id: number;
        name: string
    };
    value: number;
    notes: string
}
export interface deductionItem {
    id: number;
    deductionType: {
        id: number;
        name: string
    };
    value: number;
    notes: string
}

export interface MonthlyPayrollsFiltrationModel {
    searchQuery?: string;
    entityId?: number;
    statuses?: number[];
}


export interface MonthlyPayrollAddingModel {
    month: number;
    year: number;
    entityId: number;
}

export interface MonthlyPayrollExportingModel {
    payrollId: number;
    exportType: exportTypeType
}

export interface MonthlyPayrollDetailsFiltrationModel {
    payrollId: number;
    searchQuery: string;
    insuranceStatusFilter: number;
    transferDateFilter?: string;
    suspensionStatusFilter?: boolean;
}

export type exportTypeType = 0 | 1 | 3;

export interface TransferPayroll {
    transferredRecordsCount: number;
    message: string;
    transferredRecords: MonthlyPayrollDetailsModel;
    isPayrollModifiedAfterPublish: boolean;
}

export interface MonthlyPayrollTransferDateModel{
    name:string;
    value:string;
    isSelected:boolean;
}

export interface LoyaltyBonusModel {
    payrollId: number;
    profileId: number;
    loyaltyPercentage: number;
    joiningDate: Date;
    isDeserveLoyalty: boolean;
    isApplied: boolean;
    name: string;
    title: string;
    organizationEmail: string;
    duration: number;
    amount: number;
    reason: string;
    checked: boolean;
    grossValue: number;
    netValue: number;
}
