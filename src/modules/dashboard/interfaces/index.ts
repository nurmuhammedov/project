import {IIDName} from 'interfaces/configuration.interface'


export interface IDailyCurrency {
	readonly id: number
	rate: string
	base_currency: IIDName
	target_currency: IIDName
	created_at: string
}

export interface IBalance {
	currency: IIDName
	amount: string
}

export interface ICustomerShortData {
	readonly id: number
	store: IIDName
	price_type: IIDName
	currency: IIDName
	balances: IBalance[]
}

export interface IRate {
	id: number;
	name: string;
	rate: number;
}

export interface ITransaction {
	store_currency: IRate;
	rate: number;
}


export interface IRecord {
	store_currency: IIDName;
	store_amount: string;
	customer_currency: IIDName;
	customer_amount: string;
	change: string;
}

export interface ITransactionDetail {
	id: number;
	store: IIDName;
	customer: IIDName;
	currency: IIDName;
	service_type: IIDName;
	type: number;
	amount: string;
	description: string | null;
	records: IRecord[];
	created_at: string;
}


export interface IBalanceChange {
	readonly id: number;
	store: IIDName;
	customer: IIDName;
	type: number;
	created_at: string;
	store_currency: IIDName;
	customer_currency: IIDName;
	change: string;
}

