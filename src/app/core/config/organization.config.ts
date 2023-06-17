import { RecoursesServerConfig, STSServerConfig } from './APIs.config';
import { CRUD_ACTIONS, CRUD_CONFIRMING_MESSAGES, CRUD_ERRORS_MESSAGES, CRUD_PAGINATION_DEFAULTS, CRUD_SORT_TYPES, CRUD_SUCCESSFUL_MESSAGES, CRUD_TYPES_CODES } from './crud.config';

class OrganizationConfig {

    public LAND_ROUTE = 'home';
    public LOGIN_ROUTE = 'auth/login';

    public CANDIDATE_TYPE = 0;
    public EMPLOYEE_TYPE = 1;

    public CRUD_CONFIG = {
        actions: CRUD_ACTIONS,
        messages: CRUD_SUCCESSFUL_MESSAGES,
        confirmationMessages: CRUD_CONFIRMING_MESSAGES,
        paginationDefaults: CRUD_PAGINATION_DEFAULTS,
        sort: CRUD_SORT_TYPES,
        errorsTypes: CRUD_TYPES_CODES,
        errorsMessages: CRUD_ERRORS_MESSAGES
    }

    public SERVERS_CONFIG = {
        STS: STSServerConfig,
        resources: RecoursesServerConfig
        
    }


    public ROUTES_CONFIG = {
        root: '/home',
        login: '/auth/login',
        logout: '/auth/logout',
        unauthorized: '/unauthorized',
        forbidden: '/forbidden',
    }
    constructor() {}
}

export const OrgConfigInst: OrganizationConfig = new OrganizationConfig();


