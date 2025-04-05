import {IIDName} from 'interfaces/configuration.interface'


interface ICheckoutItem {
	readonly c_id: number;
	name: string;
	label: string;
	summa: string;
	created_at: string;
}



interface ICurrencyExchangeDetail {
	id: number
	store: IIDName
	customer: IIDName
	type: 'kirim' | 'chiqim' | 'xarajat'
	date: string
	payment: {
		currency: IIDName,
		amount: string
	}[];
}


export type {
	ICheckoutItem,
	ICurrencyExchangeDetail
}