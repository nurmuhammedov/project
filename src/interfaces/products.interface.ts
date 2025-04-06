import {IIDName} from 'interfaces/configuration.interface'
import {IMeasureItemDetail} from 'interfaces/database.interface'


interface IPackage {
	id?: number;
	name: string;
	measure?: IMeasureItemDetail;
	amount?: number;
	quantity?: number;
}

interface ProductSelect {
	id: number;
	name: string;
	is_serial: boolean;
	measure: IMeasureItemDetail,
	image?: string;
}

interface TemporaryListItem {
	id: number;
	product: ProductSelect;
	total_quantity?: string;
	total_price?: string;
	price: string;
	package_quantity?: number;
	unit_quantity?: string;
	serial_numbers?: string[];
	is_booked?: boolean;
	is_paid?: boolean;
	store?: IIDName;
	expiry_date?: string | null;
}


interface IValidationData {
	id: number;
	package: IPackage | null;
	expiry: boolean;
	is_serial: boolean;
	measure: IMeasureItemDetail;
}

interface ISerialNumber {
	id: number;
	serial: string;
	is_sold: boolean;
	is_book: boolean;
	is_paid: boolean;
}


interface IPurchaseListItem {
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
	currency: IIDName;
	cost_currency: IIDName;
	purchase_date: string;
	sale_date: string;
	total_price: string;
	cost_amount: string;
	comment: string;
	created_at: string;
	items: TemporaryListItem[];
	items_count: number;
}


export type {
	TemporaryListItem,
	IValidationData,
	ISerialNumber,
	IPurchaseListItem
}