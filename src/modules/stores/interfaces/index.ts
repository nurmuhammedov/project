import {ROLE_LIST} from 'constants/roles'


export interface IStoreDetail {
	readonly id: number;
	name: string;
	created_at: string;
	is_main: boolean;
	exchange_type: 'money' | 'product' | 'both';
}

export interface IEmployeeDetail {
	readonly id: number;
	username: string;
	password: string;
	last_name: string;
	first_name: string;
	phone_number: string;
	role: (typeof ROLE_LIST)[keyof typeof ROLE_LIST];
}
