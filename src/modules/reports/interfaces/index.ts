import {IIDName} from 'interfaces/configuration.interface'


export interface IStockByPrice {
	brand_name: string;
	code: string;
	currency: string;
	price: string;
	product_id: number;
	product_name: string;
	store_id: number;
	store_name: string;
	total_price: string;
	total_quantity: string;
	type_name: string;
}


export interface IStockByPurchase {
	product: IIDName;
	code: string;
	store: IIDName;
	supplier: IIDName;
	brand: IIDName;
	type: IIDName;
	price: string;
	currency: string;
	date: string;
	quantity: string;
	quantity_price: string;
	total_quantity: string;
}

export interface ISaleByCustomer {
	id: number;
	product: IIDName;
	type: IIDName;
	brand: IIDName;
	store: IIDName;
	customer: IIDName;
	total_quantity: string;
	price: string;
	total_price: string;
	sale_date: string;
	currency: string;
}

export interface ISalesByTotal {
	product_id: number;
	product_name: string;
	store_name: string;
	code: string;
	brand_name: string;
	type_name: string;
	quantity: string;
}