import {IIDName} from 'interfaces/configuration.interface'


export interface IProductDetail {
	readonly id: number
	type: IIDName
	country: IIDName
	brand: IIDName
	brand_name: string
	measure: 'nb';
	created_at: string; // ISO 8601 date-time
	updated_at: string; // ISO 8601 date-time
	name: string;
	code: number;
	is_serial: boolean;
	expiry: boolean;
	barcodes: string[];
}

export interface IStock {
	product_id: number;
	product_name: string;
	store_id: number;
	store_name: string;
	brand_name: string;
	type_name: string;
	code: string;
	total_quantity: string;
	customer_count: number;
	store_count: number;
}


export interface IStockItem {
	id: number;
	price: number;
	expiry_date: string | null;
	quantity: number;
	purchase_date: string; // ISO format: YYYY-MM-DD
	supplier_name: string;
	product_name: string;
	brand_name: string;
	type_name: string;
}