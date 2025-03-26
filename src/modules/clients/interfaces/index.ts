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