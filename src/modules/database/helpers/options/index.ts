import {IMeasurementUnitDetail} from 'modules/database/interfaces'
import {ISelectOption} from 'interfaces/form.interface'


export const databaseTabs: ISelectOption[] = [
	{label: 'Currencies', value: 'currencies'},
	{label: 'Countries', value: 'countries'},
	{label: 'Brands', value: 'brands'},
	{label: 'Expense types', value: 'expenseTypes'},
	{label: 'Price types', value: 'priceTypes'},
	{label: 'Measurement units', value: 'measurementUnits'},
	{label: 'Product types', value: 'productTypes'},
	{label: 'Packages', value: 'packages'}
]

export const measurementUnits: IMeasurementUnitDetail[] = [
	{
		id: 'nb',
		name: 'Item',
		label: 'item',
		type: 'int'
	}
]

export const measurementUnitTypes: ISelectOption[] = [
	{label: 'Integer number', value: 'int'},
	{label: 'Float number', value: 'float'}
]