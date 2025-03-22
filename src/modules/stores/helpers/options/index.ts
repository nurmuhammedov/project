import {ISelectOption} from 'interfaces/form.interface'


export const storeTypes: ISelectOption[] = [
	{label: 'Money', value: 'money'},
	{label: 'Product', value: 'product'},
	{label: 'Money, Product', value: 'both'}
]

export const roles: ISelectOption[] = [
	{label: 'Admin', value: 'admin'},
	{label: 'Seller', value: 'seller'}
]
