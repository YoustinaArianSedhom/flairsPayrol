export interface TeamMemberModel {
  id: number,
  name: string,
  mission: string,
  manager: {
    id: number,
    name: string,
    organizationEmail: string,
    title: string
  },
  assignedPartners: [
    {
      id: number,
      name: string,
      organizationEmail: string,
      title: string
    }
  ],
  paidAllocation: boolean;
}

export interface TeamFiltrationModel {
  searchQuery?: string;
}
