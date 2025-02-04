import {ISelectOption} from 'interfaces/form.interface'

// COMMON
const paginationOptions: ISelectOption[] = [
	{value: 5, label: '5'},
	{value: 10, label: '10'},
	{value: 20, label: '20'},
	{value: 50, label: '50'},
	{value: 100, label: '100'}
]

const regionsOptions: ISelectOption[] = [
	{
		label: 'Fergana region',
		value: 6
	},
	{
		label: 'Tashkent region',
		value: 2
	},
	{
		label: 'Namangan region',
		value: 7
	},
	{
		label: 'Andijan region',
		value: 8
	},
	{
		label: 'Sirdarya region',
		value: 3
	},
	{
		label: 'Jizzakh region',
		value: 4
	},
	{
		label: 'Samarkand region',
		value: 5
	},
	{
		label: 'Kashkadarya region',
		value: 9
	},
	{
		label: 'Surkhandarya region',
		value: 10
	},
	{
		label: 'Republic of Karakalpakstan',
		value: 14
	},
	{
		label: 'Navoi region',
		value: 12
	},
	{
		label: 'Khorezm region',
		value: 13
	},
	{
		label: 'Bukhara region',
		value: 11
	},
	{
		label: 'Tashkent city',
		value: 1
	}
]

// DATABASE
const databaseTabOptions: ISelectOption[] = [
	{label: 'Countries', value: 'countries'},
	{label: 'Product Type', value: 'productType'},
	{label: 'Brands', value: 'brands'},
	{label: 'Measurement Units', value: 'measurementUnits'},
	{label: 'Expense Types', value: 'expenseTypes'},
	{label: 'Price Types', value: 'priceTypes'},
	{label: 'Packages', value: 'packages'}
]


const measurementUnitsOptions: ISelectOption[] = [
	{label: 'Integer number', value: 'int'},
	{label: 'Float number', value: 'float'}
]

// STORES
const storesTypeOptions: ISelectOption[] = [
	{label: 'Money', value: 'money'},
	{label: 'Product', value: 'product'},
	{label: 'Money, Product', value: 'both'}
]

// PRODUCTS
const seriesOptions: ISelectOption[] = [
	{label: 'Yes', value: true},
	{label: 'No', value: false}
]


export {
	seriesOptions,
	regionsOptions,
	storesTypeOptions,
	paginationOptions,
	databaseTabOptions,
	measurementUnitsOptions
}