import {IOption} from 'interfaces/form.interface'


interface IProductItemDetail {
	id: number;
	type: IOption;
	package: IOption;
	country: IOption;
	brand: IOption;
	measure: IOption;
	created_at: string; // ISO 8601 date-time
	updated_at: string; // ISO 8601 date-time
	name: string;
	code: number;
	is_serial: boolean;
	barcodes: string[];
}

export type {
	IProductItemDetail
}