import {IOption} from 'interfaces/form.interface'


interface IClientItemDetail {
	readonly id: number
	full_name: string;
	code: string;
	phone_number: string;
	address: number;
	price_type: IOption;
	currency: IOption;
	store: IOption;
	address_detail: string;
	readonly image: string;
	balance: number;
}


export type {
	IClientItemDetail
}