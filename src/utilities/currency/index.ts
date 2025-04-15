import {currencyOptions} from 'constants/options'
import {ITransaction} from 'modules/dashboard/interfaces'


export const transformTransactions = (
	transactions: ITransaction[],
	excludeCurrencyId: string = currencyOptions[0].value?.toString()
): ITransaction[] => {
	const latestMap = new Map<string, ITransaction>()

	transactions
		.slice()
		.reverse()
		.forEach((tx: ITransaction) => {
			const id = tx.store_currency?.id
			if (id && id !== excludeCurrencyId && !latestMap.has(id)) {
				latestMap.set(id, tx)
			}
		})

	const final: ITransaction[] = []

	for (const option of currencyOptions) {
		const optionId = option.value?.toString()

		if (optionId === excludeCurrencyId) continue

		const currency = latestMap.get(optionId) || {store_currency: {id: optionId, rate: 1}, rate: 1}

		final.push({
			store_currency: currency.store_currency,
			rate: currency.rate
		})

	}

	console.log(final)
	return final
}
