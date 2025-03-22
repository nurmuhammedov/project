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


export type  {
	IMeasureItemDetail,
	IPackageItemDetail
}