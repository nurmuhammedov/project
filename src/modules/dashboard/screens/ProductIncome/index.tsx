import {
	HR,
	ReactTable,
	Pagination, DetailButton, EditButton
} from 'components'
import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import {ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
// import useTypedSelector from 'hooks/useTypedSelector'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {paramsObject: {customer = undefined, ...params}} = useSearchParams()

	// const {store} = useTypedSelector(state => state.stores)
	const {data, isFetching: isLoading, totalPages} = usePaginatedData<ITemporaryListItem[]>(
		`purchases`,
		{...params, supplier: customer, page: page, page_size: pageSize},
		!!params?.from_date
	)

	const columns: Column<ITemporaryListItem>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_, index: number) => (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Full name'),
					accessor: row => row?.supplier?.name || ''
				},
				{
					Header: t('Store'),
					accessor: row => row?.store?.name || ''
				},
				// {
				// 	Header: t('Store'),
				// 	accessor: row => row?.store?.name || ''
				// },
				// {
				// 	Header: t('Price type'),
				// 	accessor: row => row?.price_type?.name || ''
				// },
				{
					Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
					accessor: row => ` ${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},
				{
					Header: `${t('Expense')}`,
					accessor: row => ` ${decimalToPrice(row?.cost_amount || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},

				{
					Header: t('Product types'),
					accessor: row => row?.items_count || '0'
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.purchase_date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							<DetailButton id={row.id} url={`${row.id}?tab=purchase`}/>
							<EditButton id={row.id} url={`edit/${row.id}?tab=purchase`}/>
						</div>
					),
					style: {
						width: '5rem'
					}
				}
			],
		[]
	)

	return (
		<>
			<div className="flex justify-between align-center">
				<Filter fieldsToShow={['search', 'store', 'customer', 'from_date', 'to_date']}/>
			</div>
			<div className="flex flex-col gap-md flex-1">
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</div>
		</>
	)
}

export default Index


