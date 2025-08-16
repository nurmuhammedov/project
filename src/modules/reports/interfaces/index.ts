import {IIDName} from 'interfaces/configuration.interface'


export interface IStockByPrice {
	brand_name: string;
	code: string;
	currency: string;
	refer_currency: string;
	price: string;
	converted_price: string;
	product_id: number;
	product_name: string;
	store_id: number;
	store_name: string;
	total_price: string;
	converted_total_price: string;
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

interface Product {
	id: number;
	name: string;
	measure: string;
	is_serial: boolean;
}

interface Supplier {
	id: number;
	name: string;
	store_name: string;
}

export interface IPurchasedProduct {
	id: number;
	product: Product;
	supplier: Supplier;
	total_quantity: string;
	total_price: string;
	price: string;
	unit_quantity: string;
	expiry_date: string | null;
}

export interface ISaleProduct {
	id: number;
	product: Product;
	customer: IIDName;
	store: IIDName;
	total_quantity: string;
	total_price: string;
	price: string;
}

export interface ITransferHistory {
	id: number;
	from_store: IIDName;
	to_store: IIDName;
	date: string;
	is_received: boolean;
	items_count: number;
}

export interface ITransactionSummary {
	label: string;
	currency: string | null;
	amount: number | null;
	refer_amount: number;
}

interface Product {
	id: number;
	name: string;
	type: IIDName;
	brand: string | null;
}


interface Sale {
	store: IIDName;
	customer: IIDName;
	currency: string;
	sale_date: string; // ISO format date
}

interface SaleItem {
	id: number;
	product: Product;
	sale: Sale;
	price: string; // original format preserved as string
}

interface Supplier {
	id: number;
	name: string;
}

interface PurchaseItem {
	id: number;
	supplier: Supplier;
	currency: string;
	price: string;
	purchase_date: string; // ISO format date
}

export interface ITransactionDetail {
	id: number;
	sale_item: SaleItem;
	purchase_item: PurchaseItem;
	quantity: string;
	currency_rate: number | null;
	sale_price: string;
	currency_total_price: string;
	total_purchase_price: string;
	profit: string;
}