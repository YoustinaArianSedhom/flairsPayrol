/**
 * @summary Here we define the custom icons base path along side the custom icons config
 *
 * @explain the name of the icon will be used alongside the base path, and with the svg extension at the end
 * to format the path automatically on the CustomIcons service
 *
 *
 * @note Incase there's another path for specific icon you should define its own path to override the default path formatter
 *
 *
 * @note Name of the icon that you defined here will be used as value for "svgIcon" on the mat-icon element
 *
 *
 * For reference
 * @see [https://alligator.io/angular/custom-svg-icons-angular-material/]
 */

interface CustomIcon {
  name: string;
  path?: string;
}

export const ICONS_BASE_PATH = "assets/images/";

export const customIcons: CustomIcon[] = [
  {
    name: "info",
  },
  {
    name: "edit-button",
  },
  {
    name: "delete",
  },
  {
    name: "view",
  },
  {
    name: "salary",
  },
  {
    name: 'international'
  }, {
    name: 'gross'
  }, {
    name: 'net'
  }, {
    name: 'paid-salary'
  }, {
    name: "settings",
  }, {
    name: 'excel',
  }, {
    name: 'note',
  }, {
    name: 'home',
  }
  , {
    name: 'all-teams',
  }
  , {
    name: 'employees-levels',
  }
  , {
    name: 'employees-salaries',
  }
  , {
    name: 'salaries-level',
  }
  , {
    name: 'entities',
  }
  , {
    name: 'hr-managment',
  }
  , {
    name: 'monthly-salary',
  }
  , {
    name: 'my-profile',
  }
  , {
    name: 'my-team',
  }
  , {
    name: 'payslip',
  }
  , {
    name: 'my-payslip',
  }
  , {
    name: 'my-team payslip',
  }
  , {
    name: 'reports',
  }
  , {
    name: 'user-management',
  },
  {
    name: 'loan-management',
  },
  {
    name: 'flairs-accounts',
  },
  {
    name: 'raises'
  },
  {
    name: 'hr_data'
  },
  {
    name: 'monthly_assigned_budget'
  },
  {
    name: 'view_total_budget'
  },
  {
    name: 'edit_budget'
  },
  {
    name: 'loyalty_bonus'
  },
  {
    name: 'insert'
  },
  {
    name: 'remove'
  },
  {
    name: 'Loyalty_bonus_history'
  }

];
