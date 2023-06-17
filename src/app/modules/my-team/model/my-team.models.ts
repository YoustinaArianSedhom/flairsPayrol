interface TeamMemberEntityModel {
  entityId: number;
  entityName: string;
  monthlyGrossSalary: number;
  monthlyNetSalary: number;
  employeeInsuranceAmount: number;
  flairstechInsuranceAmount: number;
  insuranceStatus: number;
  monthlyTotalInsuranceAmount: number;
}
export interface TeamMemberModel {
  profileId: number;
  profileName: string;
  profileOrganizationEmail: string;
  profileTitle: string;
  managerId: number;
  managerName: string;
  managerOrganizationEmail: string;
  entities: TeamMemberEntityModel[];
  salaryLevel: SalaryLevelModel;
  profileBoardingStatus: string;
  isManager: boolean;
  isBudgetEditable: boolean;
  profileEmploymentDate: string;
  lastLoyaltyTransferred: Date;
  lastLoyaltyPercentage: number;
  lastLoyaltyAmount: number;
  nextLoyalty: Date;
  nextLoyaltyPercentage: number;
  nextLoyaltyAmount: number;
}

export interface TeamFiltrationModel {
  directSubsOnly?: boolean;
  subsInRoleManagerOnly?: boolean;
  searchQuery?: string;
  month?: number,
  year?: number,
  statuses?: number[];
}

interface SalaryLevelModel {
  from: number;
  jobName: string;
  salaryLevelDescription: string;
  salaryLevelId: number;
  salaryLevelName: string;
  to: number;
}

export interface TeamDetails {
  name: 'string';
  mission: 'string';
}

export interface CurrentBudgetModel {
  profileId: number;
  managerId: number;
  entityId: number;
  cycleId: number;
  budgetCycleDetails: BudgetCycleDetails;
  totalBudgetAmount: number;
  totalBudgetRemainingAmount: number;
  totalBudgetSpentAmount: number;
  budgetItemsDetails: BudgetItemsDetail[];
}

export interface BudgetCycleDetails {
  name: string;
  entityId: number;
  from: Date;
  to: Date;
}

export interface BudgetItemsDetail {
  budgetItemTypeId: number;
  budgetItemTypeName: string;
  budgetItemLimit: number;
  budgetItemSpentAmount: number;
  budgetItemRemainingAmount: number;
}

export interface ProfileAssignedTeamBudgetModel {
  profileId: number;
  managerId: number;
  entityId: number;
  cycleId: number;
  totalBudgetAmount: number;
  itemsDetails: ItemsDetail[];
}

export interface ItemsDetail {
  budgetItemTypeId: number;
  budgetItemTypeName: string;
  budgetItemLimit: number;
  limit?:number;
}

export interface BudgetItemLimit {
  budgetItemTypeId: number;
  limit: number;
}

export interface AssignTeamBudgetFormBodyModel {
  profileId: number;
  budgetItemsLimits: BudgetItemLimit[];
}

export interface MyTeamLoyaltyBonusModel {
  transferMonth: string;
  durationInMonths: number;
  percentage: number;
  amount: number;
  isTransferred: boolean;
  isDeserveLoyalty: boolean;
}
