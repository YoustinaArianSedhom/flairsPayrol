export interface EmployeesSyncModel {
    lastSyncedBy: {
        id: number,
        name: string,
        organizationEmail: string,
        title: string
    },
    lastSyncedDate: Date
}
