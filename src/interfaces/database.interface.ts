interface IMeasureItemDetail {
	readonly id: number;
	name: string;
	created_at: string;
	value_type: 'int' | 'float';
}


export type  {
	IMeasureItemDetail,
}