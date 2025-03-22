import {ROLE_LIST} from 'constants/roles'


type IRole = ROLE_LIST.SELLER | ROLE_LIST.ADMIN

interface ILogin {
	first_name: string;
	last_name: string;
	role: IRole;
}

interface IUser {
	fullName: string;
	role: IRole;
}

export type{
	ILogin,
	IUser,
	IRole
}