import {IIDName} from 'interfaces/configuration.interface'


interface IClientItemDetail {
	readonly id: number
	full_name: string;
	code: string;
	phone_number: string;
	address: number;
	price_type: IIDName;
	currency: IIDName;
	store: IIDName;
	address_detail: string;
	readonly image: string;
	balance: number;
	customer_balance: { currency: IIDName; amount: string | number }[]
}

export type {
	IClientItemDetail
}