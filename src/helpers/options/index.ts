import {ISelectOption} from 'interfaces/form.interface'

// COMMON
export const paginationOptions: ISelectOption[] = [
	{value: 5, label: '5'},
	{value: 10, label: '10'},
	{value: 20, label: '20'},
	{value: 50, label: '50'},
	{value: 100, label: '100'}
]

export const currencyOptions: ISelectOption[] = [
	{value: 'USD', label: 'Dollar', code: '$'},
	{value: 'UZS', label: 'Sum', code: 'sum'},
	{value: 'P2P', label: 'Click', code: 'sum'},
	{value: 'TRANSFER', label: 'Transfer', code: 'sum'},
	{value: 'RUB', label: 'Ruble', code: 'ruble'}
]

export const regionsOptions: ISelectOption[] = [
	{
		label: 'Fergana region',
		value: 12
	},
	{
		label: 'Tashkent region',
		value: 11
	},
	{
		label: 'Namangan region',
		value: 6
	},
	{
		label: 'Andijan region',
		value: 1
	},
	{
		label: 'Sirdarya region',
		value: 9
	},
	{
		label: 'Jizzakh region',
		value: 3
	},
	{
		label: 'Samarkand region',
		value: 7
	},
	{
		label: 'Kashkadarya region',
		value: 4
	},
	{
		label: 'Surkhandarya region',
		value: 8
	},
	{
		label: 'Republic of Karakalpakstan',
		value: 14
	},
	{
		label: 'Navoi region',
		value: 5
	},
	{
		label: 'Khorezm region',
		value: 13
	},
	{
		label: 'Bukhara region',
		value: 2
	},
	{
		label: 'Tashkent city',
		value: 10
	}
]

// PRODUCTS
const productExchangeTabOptions = [
	{
		label: 'Making income',
		value: 'purchase'
	},
	{
		label: 'Sale',
		value: 'sale'
	}
]

const seriesOptions: ISelectOption[] = [
	{label: 'Yes', value: true},
	{label: 'No', value: false}
]

export {
	seriesOptions,
	productExchangeTabOptions
}