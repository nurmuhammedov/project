import {ROLE_LIST} from '@constants/roles'


export type IRole = ROLE_LIST.USER | ROLE_LIST.ADMIN

export interface ILoginResponse {
	id: string | number;
	first_name: string;
	last_name: string;
	patronymic: string | null;
	username: string;
	email: string;
	role: IRole;
}

export interface IUser {
	id: string | number;
	fullName: string;
	role: IRole;
}
