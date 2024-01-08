import { Session } from 'express-session'

export type UserSessionData = {
    id: string
    email: string
    role: UserRole
}

export enum KitItems {
    FARM,
    SAM,
}

export enum UserRole {
    SUPERADMIN,
    ADMIN,
    MAINTAINER,
    USER,
}

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
    UNCERTAIN,
}

export type UserSession = Session & Record<'user', UserSessionData>
