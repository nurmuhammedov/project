import {ISearchParams} from 'interfaces/params.interface'
import {ISelectOption} from 'interfaces/form.interface'


// function ensureHttps(url: string | undefined | null): string | undefined | null {
// 	if (url?.startsWith('http://')) {
// 		return url.replace('http://', 'https://')
// 	}
// 	return url
// }

// function isString(val: unknown): val is string {
// 	return typeof val === 'string'
// }

const noop = (): void => {}

const noopAsync = async (): Promise<undefined> => {}

const cleanParams = (params: ISearchParams) => {
	const filteredParams: ISearchParams = {}
	Object.keys(params).forEach(key => {
		const value = params[key]
		if (value !== null && value !== undefined && value !== '') {
			filteredParams[key] = value
		}
	})
	return filteredParams
}

function isObject(val: unknown): val is ISearchParams {
	return typeof val === 'object' && val !== null
}

function getSelectValue(options: ISelectOption[], value: string | number | boolean | (string | number | boolean)[] | undefined | null): ISelectOption[] | null | ISelectOption {
	if (Array.isArray(value)) {
		return options.filter((item) => value.includes(item.value))
	}
	return options.find((item) => item?.value == value) ?? null
}

function decimalToInteger(value?: string | number): string {
	const intValue = Math.floor(Number(value || 0))
	return intValue.toLocaleString('en-US').split(',').join(' ')
}

function decimalToNumber(value?: string | number): string {
	const intValue = Math.floor(Number(value || 0))
	return intValue.toLocaleString('en-US').split(',').join('')
}

function decimalToPrice(value?: string | number): string {
	const numberValue = Number(value || 0)
	const formattedValue = new Intl.NumberFormat('de-DE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Math.abs(numberValue))

	return numberValue < 0 ? `-${formattedValue}` : formattedValue
}

function sumDecimals(values: string[]): number {
	const sum = values.reduce((acc, val) => acc + parseFloat(val), 0)
	return parseFloat(sum.toFixed(2))
}


export {
	noop,
	isObject,
	noopAsync,
	sumDecimals,
	cleanParams,
	getSelectValue,
	decimalToPrice,
	decimalToNumber,
	decimalToInteger

	// ensureHttps
	// isString
}