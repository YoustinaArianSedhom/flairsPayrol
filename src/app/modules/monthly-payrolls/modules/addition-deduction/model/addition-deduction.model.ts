
export interface AdditionDeductionRecordsModel{
    profileName?: string
    additions?: AdditionDeductionModel[]
    deductions?: AdditionDeductionModel[]
}

export interface AdditionDeductionModel {
    additionType? : {name:string, id:number}
    deductionType? : {name:string, id:number}
    id	: number
    name?	: string
    value	: number
    notes?	: string
    startMonth	: number
    startYear	: number
    endMonth	: number
    endYear	: number
    additionTypeId?	: number
    deductionTypeId?	: number
    PayrollYear? : number
    PayrollMonth? : number
}

export interface ValidAddition extends AdditionDeductionModel {
  employeeOrganizationEmail: string;
  employeeName:              string;
  grossAmount:               string;
  isValid:                   boolean;
  validationErrorMessages:   string[];
}

export interface AppliedAddition {
  id:                        number;
  employeeId:                string;
  employeeName:              string;
  employeeOrganizationEmail: string;
  additionType:              AdditionType;
  value:                     number;
  notes:                     string;
  startMonth:                number;
  startYear:                 number;
  endMonth:                  number;
  endYear:                   number;
}

export interface AdditionType {
  id: number;
  name: string;
}

export interface ValidateDeduction {
  employeeOrganizationEmail: string;
  employeeName:              string;
  netAmount:                 string;
  deductionType:             string;
  isValid:                   boolean;
  validationErrorMessages:   string[];
}
export interface AppliedDeductionModel {
  id:                        number;
  employeeId:                string;
  employeeName:              string;
  employeeOrganizationEmail: string;
  deductionType:             DeductionTypeModel;
  value:                     number;
  notes:                     string;
  startMonth:                number;
  startYear:                 number;
  endMonth:                  number;
  endYear:                   number;
}
export interface DeductionTypeModel {
  id: number;
  name: string;
}
