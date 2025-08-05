import {
	HR,
	Card,
	ReactTable,
	Pagination,
	Badge
} from 'components'
import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {IBalanceChange} from 'modules/dashboard/interfaces'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {paramsObject} = useSearchParams()
	const {page, pageSize} = usePagination()
	const {store} = useTypedSelector(state => state.stores)
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IBalanceChange[]>(
		`stores/${store?.value}/changes`,
		{...paramsObject, page: 1, page_size: 7},
		!!store?.value
	)

	const columns: Column<IBalanceChange>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IBalanceChange, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Customer'),
					accessor: row => row?.customer?.name
				},
				{
					Header: t('Conversion'),
					accessor: row => ` ${t(findName(currencyOptions, row?.store_currency) || '')?.toLowerCase()} ->  ${t(findName(currencyOptions, row?.customer_currency) || '')?.toLowerCase()}`
				},
				{
					Header: t('Amount'),
					accessor: row => <Badge
						title={`${decimalToPrice(row.change)}  ${t(findName(currencyOptions, row?.store_currency) || '')?.toLowerCase()}`}
						type={Number(row.change) < 0 ? 'loss' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.date ?? '')
				}
			],
		[]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl flex-1">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['customer', 'currency', 'from_date', 'to_date']}/>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>
		</>
	)
}

export default Index


