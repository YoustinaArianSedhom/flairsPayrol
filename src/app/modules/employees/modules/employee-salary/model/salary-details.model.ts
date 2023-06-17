export interface monthlyNetSalary {
    monthlyGrossSalary: number;
    monthlyPersonalExemptionAmount: number;
    monthlySocialInsurance: number;
}
export interface JoinEntityModel {
    profileId: number
    entityId: number
    salaryLevelId: number
    monthlyPersonalExemptionAmount: number
    monthlySocialInsuranceAmount: number
    monthlyGrossSalary: number
    employeeType: number
    joinedDate: string
    monthlyBaseSocialInsurance?: number
    socialInsurancePercentage?: number
}
export interface JoinedEntityModel {
    result? : any
    entityId: number
    entityName?: string
    salaryLevelId: number
    salaryLevelName?: string
    employeeType: number
    employeeTypeName?: string
    monthlyGrossSalary: number
    monthlyNetSalary: number
    monthlyTaxes: number
    monthlyPersonalExemptionAmount: number
    monthlySocialInsuranceAmount: number
    joinedDate: string
    leftDate: string
    length?: number
    monthlyBaseSocialInsurance?: number
    socialInsurancePercentage?: number
}

export interface LeaveEntityModel {
    profileId: number;
    entityId: number;
    leftDate: Date;
    type?: 'update' | 'leave'
}

export interface EmployeePersonalInfo {
    id?: number
    name?: string
    title?: string
    nationalId?: string
    medicalInsuranceNumber?: string
    socialInsuranceNumber?: string
    syncedDate?: string;
    hrCode?: string
    isSalarySuspended?: boolean
    status?: number
    flairstechJoinDate?: string
    organizationEmail?: string
    address?: string
    arabicName?: string
}

export interface BankInfo {
    bankName?: string
    bankAccountName?: string
    bankAccountNumber?: string
}
export interface PayrollInfo {
    salaryLevelName?: string
    nullable: true
    totalMonthlySocialInsuranceAmount: number
    totalMonthlyGrossSalary: number
    totalMonthlyNetSalary: number
    totalMonthlyTaxes: number
    result: any
}

export interface EmployeeBankDetailsModel {
    id?: number,
    bankName: string,
    bankAccountName: string,
    bankAccountNumber: string
}


export interface CalculateSocialInsuranceModel {
    entityId: number;
    monthlyGrossSalary: number;
}

export interface CalculateMonthlyNetSalaryModel {
    entityId: number;
    monthlyGrossSalary: number;
    monthlyPersonalExemptionAmount: number;
    monthlySocialInsurance?: number;
    monthlyBaseSocialInsurance?: number;
}
export interface SuspendSalaryModel {
    profileId: number;
    suspensionReasonId?: number;
    remarks?: string
    suspendDate?: Date
}
export interface SuspensionReasonsModel {
    id: number;
    name: string
}
export interface SuspensionDetailsModel {
    suspendReason: string;
    remarks: string;
    suspendDate: Date;
    releasedAmount: number;
}

export interface UnSuspendSalaryModel extends SuspendSalaryModel {}
