export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    isActive: boolean;
    avatarUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    published: boolean;
    status: 'draft' | 'published' | 'scheduled' | 'private';
    scheduledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SearchParams extends PaginationParams {
    query: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
