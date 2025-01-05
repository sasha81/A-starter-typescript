export interface IWorkspace {
    
    name: string;
    
    version: string
}

export interface IWorkspaceDto extends IWorkspace {
    dateCreated: string;
}