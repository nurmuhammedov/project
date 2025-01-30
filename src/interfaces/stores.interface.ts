interface IStoreItemDetail {
	readonly id: number;
	name: string;
	created_at: string;
	store_type: 'money' | 'product' | 'both';
}

export type {
	IStoreItemDetail
}