import {ISelectOption} from 'interfaces/form.interface'


export const currencyExchangeOptions: ISelectOption[] = [
	{label: 'Making income', value: 1},
	{label: 'Making loss', value: 2},
	{label: 'Making expense', value: 3}
]


export const exchangeOptions: ISelectOption[] = [
	{label: 'Income', value: 1},
	{label: 'Loss', value: 2},
	{label: 'Expense', value: 3}
]

export const exchangeTabs: ISelectOption[] = [
	{label: 'Currency exchange history', value: 'currencies'},
	{label: 'Balance change', value: 'balanceChange'},
]
