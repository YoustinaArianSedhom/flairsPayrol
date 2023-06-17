import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { CreateLoanRequestModel, loansFiltrationModel, UpdateLoanRequestModel } from "../model/loans.models";

import { PaymentPlanModelRequest } from "../model/loans.models";

export class getAllLoans {
  static readonly type = '[ALL-LOANS] Get all loans';
}

export class FilterLoans {
  static readonly type = '[ALL-LOANS] Filter loans';
  constructor(public filtration: loansFiltrationModel) {}
}

export class PaginateLoans {
  static readonly type = '[ALL-LOANS] Paginate loans';
  constructor(public config: PaginationConfigModel) {}
}
export class DeleteLoan {
  static readonly type = '[ALL-LOANS] Delete loan';
  constructor(public id: string) {}
}

export class getPaymentPlan {
  static readonly type = '[LOANS] Get all Payment Plan';
  constructor(public plan: PaymentPlanModelRequest){}
}

export class GetById {
  static readonly type = '[LOANS] Get Loan by ID';
  constructor(public loanId: number){}
}

export class CreateLoan {
  static readonly type = '[LOANS] Create Loan';
  constructor(public data: CreateLoanRequestModel){}
}

export class CreateLoanAsDraft {
  static readonly type = '[LOANS] Create Loan as Draft';
  constructor(public data: CreateLoanRequestModel){}
}

export class ApplyDraftLoan {
  static readonly type = '[LOANS] Change loan status to proceed';
  constructor(public loanId: number){}
}

export class ResetPaymentPlan {
  static readonly type = '[LOANS] Reset PaymentPlan';
}

export class ExportLoan {
  static readonly type = '[LOANS] Export Loan';
}

export class GetLoanStatus{
  static readonly type = '[LOANS] Get Loan Status'
}

export class UpdateLoan {
  static readonly type = '[LOANS] Update Loan';
  constructor(public data: UpdateLoanRequestModel){}
}
