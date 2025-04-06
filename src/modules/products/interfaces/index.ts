import {IIDName} from 'interfaces/configuration.interface'


export interface IProductDetail {
	readonly id: number
	type: IIDName
	country: IIDName
	brand: IIDName
	measure: string;
	created_at: string; // ISO 8601 date-time
	updated_at: string; // ISO 8601 date-time
	name: string;
	code: number;
	is_serial: boolean;
	barcodes: string[];
}