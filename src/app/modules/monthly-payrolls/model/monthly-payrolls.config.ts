export const monthlyPayrollStatuses = {
    0: 'Active',
    1: 'Active',
    2: 'Published',
}

export enum MonthlyPayrollStatusesEnum {
    opened = 0,
    closed = 1,
    published = 2,
}

export const excelSheetTypes: {value: number; label: string}[] = [
    {
        value: 0,
        label: 'Salaries',
    }, {
        value: 1,
        label: 'Additions And Allocations'
    }, {
        value:2,
        label: 'Global Additions'
    },
    {
        value:3,
        label: 'Loan'
    }
]

export const emailNotificationTypes: {value: number; label: string}[] = [
    {
        value: 1,
        label: 'Salaries'
    }, {
        value: 0,
        label: 'Additions And Allocations'
    }
]


export const monthly_payroll_module_route = 'monthly-payrolls';
