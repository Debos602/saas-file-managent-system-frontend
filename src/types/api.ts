export type LoginPayload = {
    email: string;
    password: string;
};

export type CreateUserPayload = {
    email: string;
    name: string;
    password: string;
};

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Meta {
    page: number;
    limit: number;
    total: number;
}

export interface GetAllUsersResponse {
    success?: boolean;
    message?: string;
    data: User[];
    meta?: Meta;
}

export type UpdateProfilePayload = Record<string, any>;

export interface UpdateMyProfileResponse {
    success?: boolean;
    message?: string;
    data?: User;
}

export interface DeleteUserResponse {
    success?: boolean;
    message?: string;
}

export interface SubscriptionPackage {
    id: string;
    name: string;
    maxFolders: number;
    maxNestingLevel: number;
    allowedFileTypes: string[];
    maxFileSizeMB: number;
    totalFileLimit: number;
    filesPerFolder: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetPackagesResponse {
    success?: boolean;
    message?: string;
    data: SubscriptionPackage[];
    meta?: Meta;
}

