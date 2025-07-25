interface ICheckoutItem {
	readonly c_id: number;
	name: string;
	currency: string;
	total_amount: string;
	created_at: string;
}


export type {
	ICheckoutItem
}