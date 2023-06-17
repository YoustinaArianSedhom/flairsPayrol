
export class AdditionDeductionDispatch {
  static readonly type = '[AdditionDeduction] Get Required Date';
  constructor(public config: {profileId: number, entityId: number, PayrollMonth?: number, PayrollYear?: number}) { }
}

export class GetAdditionTypes {
  static readonly type = '[AdditionDeduction] Get Addition Types';
}

export class GetDeductionTypes {
  static readonly type = '[AdditionDeduction] Get Deduction Types';
}

export class GetAllSalaryModificationsForProfile {
  static readonly type = '[AdditionDeduction] Get All Salary Modifications For Profile';
  constructor(public config : {profileId: number, entityId: number}) { }
}
export class GetAllSalaryModifications {
  static readonly type = '[AdditionDeduction] Get All Salary Modifications In Monthly For Profile';
  constructor(public config: {profileId: number, entityId: number, PayrollMonth?: number, PayrollYear?: number}) { }
}

export class AddAdditionForProfile {
  static readonly type = '[AdditionDeduction] Add Addition For Profile';
  constructor(public addition) { }

}

export class EditAdditionForProfile {
  static readonly type = '[AdditionDeduction] Edit Addition For Profile';
  constructor(public addition) { }
}



export class AddDeductionForProfile {
  static readonly type = '[AdditionDeduction] Add Deduction For Profile';
  constructor(public deduction) { }
}

export class EditDeductionForProfile {
  static readonly type = '[AdditionDeduction] Edit Deduction For Profile';
  constructor(public deduction) { }
}



export class DeleteAdditionFromProfile {
  static readonly type = '[AdditionDeduction] Delete Addition From Profile';
  constructor(public id) { }
}

export class DeleteDeductionFromProfile {
  static readonly type = '[AdditionDeduction] Delete Deduction From Profile';
  constructor(public id) { }
}

export class UploadAdditions {
  static readonly type = '[AdditionDeduction] Uplaod Additions';
  constructor(public MonthlyPayrollId: number, public File:any,public Options:any) { }
}
export class ApplyAdditions {
  static readonly type = '[AdditionDeduction] Apply Additions';
  constructor(public MonthlyPayrollId: number, public File:any) { }
}

export class GetUploadedAdditions {
  static readonly type = '[AdditionDeduction] Get Uploaded Additions';
  constructor(public MonthlyPayrollId) { }
}

export class DeleteAdditions {
  static readonly type = '[AdditionDeduction] Delete Additions';
  constructor(public monthlyPayrollId) { }
}

export class GetUploadedDeductions {
  static readonly type = '[AdditionDeduction] Get Uploaded Deduction';
  constructor(public MonthlyPayrollId) { }
}
export class ApplyDeductionsFromExcel {
  static readonly type = '[AdditionDeduction] Apply Deduction From Excel';
  constructor(public MonthlyPayrollId: number, public File:any) { }
}

export class DeleteDeduction {
  static readonly type = '[AdditionDeduction] Delete Deduction';
  constructor(public monthlyPayrollId) { }
}
