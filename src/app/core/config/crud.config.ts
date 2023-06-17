export enum CRUD_ACTIONS {
    update = 'Update',
    create = 'Create',
    remove = 'Remove',
    delete = 'Delete',
    disable = 'Disable',
    archive = 'Archive',
    enable = 'Enable',
    submit = 'Submit',
    fetch = 'Fetch',
    logout = 'Logout',
    cancel = 'Cancel',
    leave = 'Leave',
    publish = 'Publish',
    transfer = 'Transfer',
    keep = 'Keep',
    confirm = 'confirm',
    configure = 'configure',
    ok = 'ok',
    view = 'view'
}


export const CRUD_SUCCESSFUL_MESSAGES = {
    updated(title: string) { return title + ' has been updated successfully' },
    created(title: string) { return title + ' has been created successfully' },
    removed(title: string) { return title + ' has been removed successfully' },
    deleted(title: string) { return title + ' has been deleted successfully' },
    disabled(title: string) { return title + ' has been disabled successfully' },
    enabled(title: string) { return title + ' has been enabled successfully' },
    archived(title: string) { return title + ' has been archived successfully' },
    submitted(title: string) { return title + ' has been submitted successfully' },
    leaved(title: string) { return title + ' has been left successfully' },
    left(title: string) { return `has left ${title} successfully` },
    opened(title: string) { return title + ' has been opened successfully' },
    closed(title: string) { return title + ' has been closed successfully' },
    published(title: string) { return title + ' has been published successfully' }
}


export const CRUD_CONFIRMING_MESSAGES = {
    update(title: string) { return `Please confirm to update ${title}` },
    remove(title: string) { return `Please confirm to remove ${title}` },
    delete(title: string) { return `Please confirm to delete ${title}` },
    create(title: string) { return `Please confirm to create ${title}` },
    disable(title: string) { return `Please confirm to disable ${title}` },
    enable(title: string) { return `Please confirm to enable ${title}` },
    archive(title: string) { return `Please confirm to archive ${title}` },
    submit(title: string) { return `Please confirm to submit ${title}` },
    leave(title: string) { return `Please confirm to leave ${title}` },
    publish(title: string) { return `Please confirm to publish ${title}` },
    transfer(title: string) { return `Please confirm to transfer ${title}` },
    apply(title: string) { return `Please confirm to apply ${title}` },
    logout() { return `Please confirm to logout` },
}



const MANAGE_PAGE_SIZE = 10;
const MANAGE_PAGE_SIZE_OPTIONS: number[] = [10, 30, 50, 100, 500, 1000];


export const CRUD_PAGINATION_DEFAULTS: {
    size: number;
    options: number[];
    startAt: number
} = {
    size: MANAGE_PAGE_SIZE,
    options: MANAGE_PAGE_SIZE_OPTIONS,
    startAt: 0
};


export enum CRUD_SORT_TYPES {
    desc = -1,
    asc = 1
}

export enum CRUD_ERRORS_MESSAGES {
    refreshToken = "It seems like you didn't resume your session for a long time, Please, login again to renew your session",
    networkOrServer = "Looks like Server is running down, Please try again after few moments.",
    notFound = "There is no such action or page like that you request",
    forbidden = "you are not authorized to be there or to take that action",
    notAuthorized = "You are not authenticated to be there or to take that action",
    generalFail = 'Request failed. Please check your internet connection and try again'
}

export enum CRUD_TYPES_CODES {
    forbidden = 403,
    notAuthenticated = 401,
    notFound = 404,
    networkOrServer = 503,
    lockedToken = 423
}

