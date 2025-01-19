import React from "react";

interface RoleOrder {
    [key: string]: number;
}

interface IMenuItem {
    id: string;
    label: string;
    icon?: () => React.ReactNode;
    href: string;
    allowedRoles: string[];
    order: RoleOrder;
}

interface IListResponse<T> {
    count: number
    totalPages: number
    currentPage: number
    results: T
}

export type {
    IMenuItem,
    IListResponse,
}