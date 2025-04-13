import {IIDName} from 'interfaces/configuration.interface'
import {IProductDetail} from 'modules/products/interfaces/index'


export interface ITemporaryListItem {
	id: number;
	product: IProductDetail;
	total_quantity?: string;
	total_price?: string;
	price: string;
	package_quantity?: number;
	unit_quantity?: string;
	serial_numbers?: string[];
	store?: IIDName;
	expiry_date?: string | null;
}

export interface IValidationData {
	id: number;
	expiry: boolean;
	is_serial: boolean;
	measure: 'nb';
}

export interface IPurchaseItem {
	id: number;
	store: IIDName;
	supplier: {
		id: number;
		full_name: string;
	};
	customer: {
		id: number;
		full_name: string;
	};
	price_type: IIDName;
	currency: string;
	cost_currency: string;
	purchase_date: string;
	sale_date: string;
	total_price: string;
	cost_amount: string;
	comment: string;
	created_at: string;
	items: ITemporaryListItem[];
	items_count: number;
}