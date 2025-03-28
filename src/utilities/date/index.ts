import {IIDName} from 'interfaces/configuration.interface'
import {decimalToPrice} from 'utilities/common'


function formatDate(isoDateString: string | null | undefined): string {
	if (!isoDateString) return ''
	const date = new Date(isoDateString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${day}.${month}.${year} - ${hours}:${minutes}`
}

const getDate = (dateStr?: string): string => {
	let date: Date

	if (dateStr) {
		date = new Date(dateStr)
		if (isNaN(date.getTime())) return ''
	} else {
		date = new Date()
	}

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${day}.${month}.${year}`
}

function formatCurrencyData(data: { currency: IIDName; amount: string | number }[]): string {
	return data.map(item => {
		const amountNumber = Number(item.amount) || 0
		const formattedAmount = decimalToPrice(amountNumber)

		return `${formattedAmount} ${item.currency.code}`
	}).join('<br/>')
}

export {
	formatCurrencyData,
	formatDate,
	getDate
}