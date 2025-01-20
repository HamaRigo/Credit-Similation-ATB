import { RoleType } from "./RoleType";

export type UserType = {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    activated?: boolean;
    roles?: RoleType[];
};
