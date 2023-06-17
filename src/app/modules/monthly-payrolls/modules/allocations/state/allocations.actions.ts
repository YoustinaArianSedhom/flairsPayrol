

export class AddAllocations {
  static readonly type = '[Allocations] Add Allocations';
  constructor(public MonthlyPayrollId: number, public AllocationsSheet: any, public options: any) { }
}
export class ApplyAllocations {
  static readonly type = '[Allocations] Apply Allocations';
  constructor(public MonthlyPayrollId: number, public AllocationsSheet:any) { }
}

export class DeleteAllocations {
  static readonly type = '[Allocations] Delete Allocations';
  constructor(public monthlyPayrollId) { }
}
export class GetUploadedAllocations {
  static readonly type = '[Allocations] Get Uploaded Allocations';
  constructor(public payrollId) { }

}
