export interface loansModel {
    id: string,
    profileId: string,
    employeeName: string,
    employeeOrganizationEmail: string,
    grossAmount: number,
    repaidAmount: number,
    numberOfInstallments: number,
    status: number,
    transferDate: Date,
    startDate: Date,
    endDate: Date,
    repaidAmountPercentage: number,
    numberOfPaidInstallments: number
}

export interface loansFiltrationModel {
    loanStatus?: number;
    query?: string;
  }

export interface PaymentPlanModelRequest {
    loanGrossAmount:      number;
    firstInstallmentDate: FirstInstallmentDate;
    numberOfInstallment:  number;
    loanId?: number;
    numberOfRemainingInstallments?: number;
}

export interface FirstInstallmentDate {
    month: number;
    year:  number;
}

export interface PaymentPlanModel {
    paymentPlan: PaymentPlanListModel[];
    unpaidLoanAmount: number,
    numberOfUnpaidInstallments: number,
    paidLoanAmount: number,
    numberOfPaidInstallments: number,
    endDate: Date
}

export interface PaymentPlanListModel{
    date: Date;
    installmentAmount: number;
    installmentPercentageOfTotalAmount: number;
    remainingAmount: number;
}

export interface CreateLoanResponseModel{
    id:                        number;
    profileId:                 number;
    employeeName:              string;
    employeeOrganizationEmail: string;
    grossAmount:               number;
    repaidAmount:              number;
    numberOfInstallments:      number;
    status:                    number;
    transferDate:              Date;
    startDate:                 Date;
    endDate:                   Date;
}
export interface CreateLoanRequestModel {
    profileId:            number;
    grossAmount:          number;
    transferDate:         FirstInstallmentDateClass;
    firstInstallmentDate: FirstInstallmentDateClass;
    numberOfInstallments: number;
    purpose:              string;
}

export interface FirstInstallmentDateClass {
    month: number;
    year:  number;
}

export interface GetLoanByIDResponseModel {
    id:                        string;
    profileId:                 number;
    profileEntityLastPublishedPayrollDate: Date;
    employeeName:              string;
    employeeOrganizationEmail: string;
    grossAmount:               number;
    repaidAmount:              number;
    numberOfInstallments:      number;
    status:                    {id: number, name: string};
    purpose:                   string;
    transferDate:              Date;
    startDate:                 Date;
    endDate:                   Date;
    paymentPlan:               PaymentPlanModel[];
    unpaidLoanAmount:          number;
    numberOfUnpaidInstallments: number;
    repaidAmountPercentage: number;
}

export interface LoanStatusModel{
    id: string;
    name: string;
}


export interface UpdateLoanRequestModel {
  loanId: number;
  grossAmount?: number;
  transferDate?: {
    month: number;
    year: number;
  };
  firstInstallmentDate?: {
    month: number;
    year: number;
  };
  numberOfInstallments?: number;
  numberOfRemainingInstallments?: number;
  purpose?: string;
}
