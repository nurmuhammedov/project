import {IBalance, ITransaction} from 'modules/dashboard/interfaces'
import {ISearchParams} from 'interfaces/params.interface'
import {ISelectOption} from 'interfaces/form.interface'


export const noop = (): void => {}

export const noopAsync = async (): Promise<undefined> => {}

export const cleanParams = (params: ISearchParams) => {
	const filteredParams: ISearchParams = {}
	Object.keys(params).forEach(key => {
		const value = params[key]
		if (value !== null && value !== undefined && value !== '') {
			filteredParams[key] = value
		}
	})
	return filteredParams
}

export function isObject(val: unknown): val is ISearchParams {
	return typeof val === 'object' && val !== null
}

export function getSelectValue(options: ISelectOption[], value: string | number | boolean | (string | number | boolean)[] | undefined | null): ISelectOption[] | null | ISelectOption {
	if (Array.isArray(value)) {
		return options.filter((item) => value.includes(item.value))
	}
	return options.find((item) => item?.value == value) ?? null
}

export function decimalToInteger(value?: string | number): string {
	const intValue = Math.floor(Number(value || 0))
	return intValue.toLocaleString('en-US').split(',').join(' ')
}

export function decimalToNumber(value?: string | number): string {
	const intValue = Math.floor(Number(value || 0))
	return intValue.toLocaleString('en-US').split(',').join('')
}

export function decimalToPrice(value?: string | number): string {
	const numberValue = Number(value || 0)
	const formattedValue = new Intl.NumberFormat('de-DE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Math.abs(numberValue))

	return numberValue < 0 ? `-${formattedValue}` : formattedValue
}

export function sumDecimals(values: string[]): number {
	const sum = values.reduce((acc, val) => acc + parseFloat(val), 0)
	return parseFloat(sum.toFixed(2))
}

export function getBalanceAsString(arr: IBalance[]): string {
	if (!arr || arr.length === 0) {
		return decimalToPrice(0)
	}

	return arr
		.map((item: IBalance) => `${decimalToPrice(item?.amount)} ${item?.currency?.name?.toLowerCase()}`)
		.join(';  ')
}

export function convertCurrency(amount: number, direction: 'toStore' | 'fromStore', storeCurrencyId: number, rates: ITransaction[]): number {
	const storeCurrency = rates.find(r => r?.store_currency?.id == storeCurrencyId)

	let result = 0

	if (direction === 'toStore') {
		const baseValue = amount / (storeCurrency?.store_currency?.rate || 1)
		result = baseValue * (storeCurrency?.rate || 1)
	} else if (direction === 'fromStore') {
		const baseValue = amount / (storeCurrency?.rate || 1)
		result = baseValue * (storeCurrency?.store_currency?.rate || 1)
	}

	return parseFloat(result.toFixed(2))
}

export function findName(arr: ISelectOption[], id: number | string | null | undefined): string {
	return arr.find(item => item?.value == id)?.label?.toString() || ''
}
