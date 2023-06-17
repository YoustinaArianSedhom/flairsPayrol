import { SystemRoles } from '@core/modules/authorization/model/authorization.config';
import { MenuItemModel } from './model/layout.interface';

const userLinks: MenuItemModel[] = [
  {
    label: 'Home',
    link: '/home',
    materialIcon: {
      isSvg: true,
      name: 'home'
    },
    roles: [
      SystemRoles.CEO,
      SystemRoles.ITSupport,
      SystemRoles.Employee,
      SystemRoles.Finance,
      SystemRoles.Manager,
      SystemRoles.PayrollManager,
      SystemRoles.HRManager,
      SystemRoles.HR,
      SystemRoles.Payroll
    ],
  },

  {
    label: 'My Profile',
    link: '/my-profile',
    materialIcon: {
      isSvg: true,
      name: 'my-profile'
    },
    roles: [
      SystemRoles.CEO,
      SystemRoles.ITSupport,
      SystemRoles.Employee,
      SystemRoles.Finance,
      SystemRoles.Manager,
      SystemRoles.PayrollManager,
      SystemRoles.HRManager,
    ],
  },

  {
    label: 'My Team',
    link: '/teams/my-team',
    materialIcon: {
      isSvg: true,
      name: 'my-team'
    },
    roles: [SystemRoles.PayrollManager],
  },

  {
    label: 'All Teams',
    link: '/all-teams',
    materialIcon: {
      isSvg: true,
      name: 'all-teams'
    },
    roles: [
      SystemRoles.HRManager,
      SystemRoles.PayrollManager,
      // SystemRoles.Manager,
      SystemRoles.ITSupport,
      SystemRoles.BusinessPartner
    ],
  },

  // {
  //   label: "Settings",
  //   children: [
  {
    label: 'Entities',
    link: '/entities',
    materialIcon: {
      isSvg: true,
      name: 'entities'
    },
    roles: [SystemRoles.Payroll],
  },

  {
    label: 'Salary Levels',
    link: '/salary-levels',
     materialIcon: {
      isSvg: true,
      name: 'salaries-level'
    },
    roles: [SystemRoles.HRManager],
  },
  {
    label: 'Employees Levels',
    link: '/profiles-levels',
    materialIcon: {
      isSvg: true,
      name: 'employees-levels'
    },
    roles: [SystemRoles.HRManager],
  },
  {
    label: 'Employees salaries',
    link: '/employees-salaries',
    materialIcon: {
      isSvg: true,
      name: 'employees-salaries'
    },
    roles: [SystemRoles.Payroll, SystemRoles.HRManager],
    // },
    // ],
  },
  {
    label: 'Loan Management',
    link: '/loan-management',
    materialIcon: {
      isSvg: true,
      name: 'loan-management'
    },
    roles: [SystemRoles.Payroll],
  },
  {
    label: 'User Management',
    link: '/employees',
    materialIcon: {
      isSvg: true,
      name: 'user-management'
    },
    roles: [SystemRoles.ITSupport, SystemRoles.Payroll],
    // children: [
    //   {
    //     label: "All Users",
    //     link: "/employees",
    //   }
    // ],
  },
  {
    label: 'HR Management',
    link: '/hr-management',
    materialIcon: {
      isSvg: true,
      name: 'hr-managment'
    },
    roles: [
      SystemRoles.HRManager,
    ],
  },
  {
    label: 'HR Data',
    link: '/hr-data',
    materialIcon: {
      isSvg: true,
      name: 'hr_data'
    },
    roles: [
      SystemRoles.HR,
      SystemRoles.HRManager,
      SystemRoles.Finance,
      SystemRoles.Payroll
    ],
  },
  {
    label: 'Monthly Payroll',
    link: '/monthly-payrolls',
    materialIcon: {
      isSvg: true,
      name: 'monthly-salary'
    },
    roles: [SystemRoles.Payroll],
  },
  {
    label: 'Raises',
    link: '/raises',
    materialIcon: {
      isSvg: true,
      name: 'raises'
    },
    roles: [SystemRoles.Payroll],
  },

  {
    label: 'My Payslip',
    link: '/payslips/my-payslip',
    materialIcon: {
      isSvg: true,
      name: 'my-payslip'
    },
    roles: [
      SystemRoles.CEO,
      SystemRoles.ITSupport,
      SystemRoles.Employee,
      SystemRoles.Finance,
      SystemRoles.Manager,
      SystemRoles.PayrollManager,
      SystemRoles.HRManager,
    ],
  },
  {
    label: 'My Team Payslips',
    link: '/payslips/team-payslips',
    materialIcon: {
      isSvg: true,
      name: 'my-team payslip'
    },
    roles: [SystemRoles.PayrollManager],
  },

  {
    label: 'Reports',
    link: 'reports',
    materialIcon: {
      isSvg: true,
      name: 'reports'
    },
    roles: [SystemRoles.Payroll],
  },
];

/**
 *
 * @param roles array of string of roles
 * @returns {MenuItemModel[]} - Array of sidenav links
 */
export function getLinksBasedOnRole(roles: string[]): MenuItemModel[] {
  let assignedLinks = [];
  assignedLinks = userLinks.filter((link: MenuItemModel) => {
    if (link.roles && roles.length) {
      const canLoad: boolean = link.roles.some(
        (val) => roles.indexOf(val) !== -1
      );
      if (canLoad && link.children)
        link.children = link.children.filter((child: MenuItemModel) => {
          if (child.roles && roles.length) {
            const canLoadChild = child.roles.some(
              (val) => roles.indexOf(val) !== -1
            );
            if (canLoadChild) return child;
          }
        });
      if (canLoad) return link;
    }
  });
  return assignedLinks;
}

// Recursive but not now
// export function getLinksBasedOnRole(roles: string[], assignedLinks = [], children: boolean = false): MenuItemModel[] {
//   userLinks.forEach((link: MenuItemModel) => {
//     if (link.roles && roles.length) {
//       const canLoad: boolean = link.roles.some((val) => roles.indexOf(val) !== -1);
//       if (canLoad && !children) {
//         assignedLinks.push(link);
//         if (link.children) {
//           getLinksBasedOnRole(roles, assignedLinks.find(assignedLink => assignedLink.label = link.label), true)
//         }
//       }
//       else if (canLoad && children) assignedLinks.push(link)
//     }

//   })

//   return assignedLinks;
// }
