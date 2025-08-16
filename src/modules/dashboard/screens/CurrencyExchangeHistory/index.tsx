import {
	HR,
	Card,
	ReactTable,
	Pagination,
	DetailButton,
	Badge
} from 'components'
import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {IExchange} from 'modules/clients/interfaces'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {paramsObject} = useSearchParams()
	const {store} = useTypedSelector(state => state.stores)
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IExchange[]>(
		`stores/${store?.value}/transactions`,
		{...paramsObject, page: page, page_size: pageSize},
		!!store?.value
	)

	const columns: Column<IExchange>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IExchange, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				// {
				// 	Header: t('Store'),
				// 	accessor: row => row?.store?.name || ''
				// },
				{
					Header: t('Customer'),
					accessor: row => row?.customer?.name || ''
				},
				{
					Header: t('Amount'),
					accessor: row => `${decimalToPrice(row?.amount || 0)} ${t(findName(currencyOptions, row?.currency) || '')?.toLowerCase()}`
				},
				{
					Header: t('Type'),
					accessor: row => <Badge
						title={row.type == 3 ? 'Expense' : findName(exchangeOptions, row.type)}
						type={row.type == 3 ? 'expense' : row.type == 2 ? 'loss' : row?.type == 3 ? 'expense' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							<DetailButton
								id={row.id}
								url={row?.type == 3 ? `/admin/reports/currency-exchange/expense/${row.id}` : `/admin/reports/currency-exchange/${row.id}?tab=${row.type == 2 ? '2' : row.type == 3 ? '3' : '1'}`}
							/>
						</div>
					)
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


