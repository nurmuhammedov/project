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

export const storeDetailTabs: ISelectOption[] = [
	{label: 'Balance', value: 'balance'},
	{label: 'Currency exchange history', value: 'currencies'},
	{label: 'Balance change', value: 'balanceChange'},
	{label: 'Income', value: 'income'},
	{label: 'Loss', value: 'loss'}
]
