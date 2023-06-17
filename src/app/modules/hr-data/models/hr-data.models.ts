export interface HRDataModel {
   id: number;
   name: string;
   organizationEmail: string;
   managerId: number;
   managerName: string;
   managerEmail: string;
   nationalId: string;
   hrCode: string;
   departmentName: string;
   departmentCode: string;
   flairstechJoinDate: Date;
}

export interface StatusModel {
   id: number;
   name: string;
}

export interface HRDataFilterModel {
   query?:string;
   managersIds?: number[];
   departmentsCodes?: string[];
   statuses?: number[];
}

export interface ManagerModel {
   id: number,
   name: string,
   organizationEmail: string,
   title: string
}

export interface DepartmentModel {
   name: string;
   code: string;
   id: string;
}
