import {IIDName} from 'interfaces/configuration.interface'


interface ICashierItem {
	readonly c_id: number;
	name: string;
	label: string;
	summa: string;
	created_at: string;
}

interface IDailyCurrency {
	id: number;
	summa: string;
	currency: IIDName;
	datetime: string;
	previous: number;
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
	ICashierItem,
	IDailyCurrency,
	ICurrencyExchangeDetail
}