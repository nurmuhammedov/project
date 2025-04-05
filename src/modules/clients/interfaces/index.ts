import {IIDName} from 'interfaces/configuration.interface'


export interface ICustomerDetail {
	readonly id: number
	name: string;
	code: string;
	phone_number: string;
	address: string;
	is_employee: boolean;
	price_type: IIDName;
	currency: IIDName;
	store: IIDName;
	region: number;
}

export interface IExchange {
	readonly id: number
	store: IIDName;
	currency: IIDName;
	service_type: IIDName | null;
	type: number;
	amount: string;
	created_at: string;
}