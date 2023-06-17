export interface PayslipsSummaryModel {
    profileName: string;
    profileTitle: string;
    profileOrganizationEmail?: string;
    salaryLevelName: string;
    managerName: string;
    managerTitle: string
    managerOrganizationEmail?: string
}

export interface PayslipModel {
    profileId: number;
    profileName: string;
    profileOrganizationEmail: string;
    profileTitle: string;
    salaryLevelName: string;
    managerName: string;
    managerTitle: string;
    effectiveDate: Date;
    month: number;
    year: number;
    totalMonthlyGrossSalary: number;
    totalMonthlyNetSalary: number;
    actualTotalMonthlyGrossSalary: number;
    additions: [
        {
            id: number;
            additionType: {
                id: number;
                name: string
            };
            value: number;
            notes: string
        }
    ];
    totalAdditions: number;
    globalAdditions:[
            {
                id: number;
                name: string;
                value: number;
            }
    ],
    totalGlobalAdditions:number;
    globalDeductions: [
        {
            id: number;
            name: string;
            value: number;
            isApplied?: boolean;
        }
    ];
    totalGlobalDeductions: number;
    deductions: [
        {
            id: number;
            deductionType: {
                id: number;
                name: string
            };
            value: number;
            notes: string
        }
    ];
    totalDeductions: number;
    totalPaidSalary: number;
    totalTaxes: number;
    effects: Effect[];
    socialInsurranceAmount: number;
    managerOrganizationEmail: string;
    loyaltyGrossValue: number;
}

interface Effect {
    name:string;
    description:string;
    value:number
}

export interface PayslipsFiltrationModel {
    managerId?: number;
    from: DateLimit;
    to?:   DateLimit;
    searchQuery?: string;
    profileId?: number;
}

export interface DateLimit {
    month: number;
    year:  number;
}

export interface PayslipsProfileModel {
    searchQuery?: string;
    profileId?: number;
}

export interface TeamPayslipsAggregatesResultModel {
    totalGrossSalary: number;
    totalNetSalary: number;
    totalGlobalDeductions: number;
    totalGlobalAdditions: number;
    totalDeductions: number;
    totalAdditions: number;
    totalPaid: number;
}

export interface ManagerWithSubModel{
    id: number,
    name: string,
    organizationEmail: string,
    title: string
}

