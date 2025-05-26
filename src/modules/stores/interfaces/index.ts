import {ROLE_LIST} from 'constants/roles'
import {IIDName} from 'interfaces/configuration.interface'


export interface IStoreDetail {
	readonly id: number;
	name: string;
	created_at: string;
	is_main: boolean;
	exchange_type: 'money' | 'product' | 'both';
}

export interface IEmployeeDetail {
	readonly id: number;
	username: string;
	password: string;
	last_name: string;
	first_name: string;
	phone_number: string;
	role: (typeof ROLE_LIST)[keyof typeof ROLE_LIST];
}

interface IProductIdentifier {
	id: number;
	name: string;
}

interface IProductImage {
	image: string | null;
}

interface IProductDetails extends IProductIdentifier, IProductImage {
	type: IProductIdentifier;
	country: IProductIdentifier;
	brand: IProductIdentifier;
	created_at: string;
	updated_at: string;
	code: number;
	measure: string;
	is_serial: boolean;
	expiry: boolean;
	barcodes: string[];
}

export interface IInnerListItem {
	customer: IIDName;
	store: IIDName;
	quantity: string;
	updated_at: string;
}

export interface IProductData {
	product: IProductDetails;
	inner_list: IInnerListItem[];
}