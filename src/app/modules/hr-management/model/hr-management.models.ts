export interface HRTeamMemberModel {
  id: number;
  name: string;
  organizationEmail: string;
  title: string;
  managerId: number;
  managerName: string;
  assignedTeams: [
    {
      id: number;
      name: string;
      mission: string;
      manager: {
        id: number;
        name: string;
        organizationEmail: string;
        title: string;
      };
    }
  ];
}

export interface HRTeamFiltrationModel {
  searchQuery?: string;
}

export interface AssignHRModel {
  profileId: number;
  teamId: number;
}

export interface TeamModel {
  id: number;
  name: string;
  mission: string;
  manager: {
    id: number;
    name: string;
    organizationEmail: string;
    title: string;
  };
}
