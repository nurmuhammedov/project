import {IRecord} from 'modules/dashboard/interfaces'


export function calculateTotalByRecords(
	firstAmount: string | null | undefined,
	records: IRecord[] | null | undefined
): number {
	const initialAmount = parseFloat(firstAmount || '0') || 0

	if (!Array.isArray(records)) {
		return initialAmount
	}
	const recordsSum = records.reduce((sum, record) => {
		const customerAmount = parseFloat(record?.customer_amount || '0') || 0
		return sum + customerAmount
	}, 0)

	return initialAmount + recordsSum
}