import {IIDName} from 'interfaces/configuration.interface'


export interface IDailyCurrency {
	id: number;
	rate: string;
	base_currency: IIDName;
	target_currency: IIDName;
	created_at: string;
}