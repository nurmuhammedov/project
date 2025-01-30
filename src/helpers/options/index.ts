import {ISelectOption} from 'interfaces/form.interface'


const paginationOptions: ISelectOption[] = [
	{value: 5, label: '5'},
	{value: 10, label: '10'},
	{value: 20, label: '20'},
	{value: 50, label: '50'},
	{value: 100, label: '100'}
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


export {
	storesTypeOptions,
	paginationOptions,
	databaseTabOptions,
	measurementUnitsOptions
}