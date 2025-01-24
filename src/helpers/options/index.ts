import {ISelectOption} from 'interfaces/form.interface'


const paginationOptions: ISelectOption[] = [
	{value: 5, label: '5'},
	{value: 10, label: '10'},
	{value: 20, label: '20'},
	{value: 50, label: '50'},
	{value: 100, label: '100'}
]

const databaseTabOptions = [
	{label: 'Countries', value: 'countries'},
	{label: 'Product Type', value: 'productType'},
	{label: 'Brands', value: 'brands'},
	// {label: 'Measurement Units', value: 'measurementUnits'},
	{label: 'Expense Types', value: 'expenseTypes'},
	{label: 'Price Types', value: 'priceTypes'}
]

export {
	paginationOptions,
	databaseTabOptions
}