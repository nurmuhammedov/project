export interface ISale {
	sale_date: string;
	days_passed: number | string;
	total_amount: number | string;
	remaining_debt: number | string;
	currency: string;
}

export interface ICustomerWithSales {
	id: number;
	name: string;
	store: string;
	currency: string;
	sales: ISale[];
}

export type CustomerSaleRow = {
	customer_id: number;
	name: string;
	store: string;

	currency?: string;
	sale_date?: string;
	days_passed?: number | string;
	total_amount?: number | string;
	remaining_debt?: number | string;

	// rowSpan uchun meta
	_rowSpan: number;
	_isFirst: boolean;
}
