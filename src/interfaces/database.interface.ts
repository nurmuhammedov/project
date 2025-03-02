import {IIDName} from 'interfaces/configuration.interface'


interface IDatabaseItemDetail {
	readonly id: number;
	name: string;
	organization?: IIDName;
	created_at: string;
	expiry: boolean;
}


interface IMeasureItemDetail {
	readonly id: number;
	name: string;
	created_at: string;
	value_type: 'int' | 'float';
}

interface IPackageItemDetail {
	readonly id: number;
	name: string;
	measure_name: string;
	measure: IMeasureItemDetail
	amount: string;
	quantity: string;
	created_at: string;
}

interface ICurrencyItemDetail {
	id: number;
	name: string;
	label: string;
	created_at: string;
}


export type  {
	IDatabaseItemDetail,
	IMeasureItemDetail,
	IPackageItemDetail,
	ICurrencyItemDetail
}