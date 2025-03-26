export interface ICurrencyDetail {
	id: number;
	name: string;
	code: string;
	is_main: boolean;
	created_at: string;
}

export interface ICountryDetail {
	id: number;
	name: string;
	created_at: string;
}

export interface IBrandDetail {
	id: number;
	name: string;
	created_at: string;
}

export interface IExpenseTypeDetail {
	id: number;
	name: string;
	created_at: string;
}

export interface IMeasurementUnitDetail {
	id: string;
	name: string;
	label: string;
	type: 'int' | 'float';
}

export interface IPriceTypeDetail {
	id: number;
	name: string;
	created_at: string;
}