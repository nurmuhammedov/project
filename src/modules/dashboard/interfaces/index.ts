import {IIDName} from 'interfaces/configuration.interface'


export interface IDailyCurrency {
	readonly id: number
	rate: string
	base_currency: string
	target_currency: string
	created_at: string
	updated_at: string
}

export interface IBalance {
	currency: string
	amount: string
}

export interface ICustomerShortData {
	readonly id: number
	store: IIDName
	price_type: IIDName
	currency: string
	balances: IBalance[]
}

export interface IRate {
	id: string;
	rate: number;
}

export interface ITransaction {
	store_currency: IRate;
	rate: number;
}


export interface IRecord {
	store_currency: string;
	store_amount: string;
	customer_currency: string;
	customer_amount: string;
	change: string;
}

export interface ITransactionDetail {
	id: number;
	store: IIDName;
	customer: IIDName;
	currency: string;
	service_type: IIDName;
	type: number;
	amount: string;
	description: string | null;
	records: IRecord[];
	created_at: string;
	date: string;
}


export interface IBalanceChange {
	readonly id: number;
	store: IIDName;
	customer: IIDName;
	type: number;
	created_at: string;
	store_currency: string;
	customer_currency: string;
	change: string;
	date: string;
}

