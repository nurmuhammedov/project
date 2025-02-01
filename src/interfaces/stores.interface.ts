interface IStoreItemDetail {
	readonly id: number;
	name: string;
	created_at: string;
	store_type: 'money' | 'product' | 'both';
}

interface IEmployeeDetail {
	id: number;
	username: string;
	full_name: string;
	phone: string;
	role: string;
}

export type {
	IStoreItemDetail,
	IEmployeeDetail
}