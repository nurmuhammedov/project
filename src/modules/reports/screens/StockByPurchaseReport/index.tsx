import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import {IStockByPurchase} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToInteger, decimalToPrice, findName} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	Pagination,
	ReactTable,
	PageTitle
} from 'components'
import {getDate} from 'utilities/date'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, customer = undefined, ...params}
	} = useSearchParams()

	const {
		data,
		totalPages,
		isPending: isLoading
	} = usePaginatedData<IStockByPurchase[]>('stocks/by-purchase-item', {
		...params,
		page,
		type: product_type,
		supplier: customer,
		page_size: pageSize
	})


	const columns: Column<IStockByPurchase>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: IStockByPurchase, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				accessor: (row) => row?.product?.name || ''
			},
			// {
			// 	Header: t('Code'),
			// 	accessor: 'code'
			// },
			{
				Header: t('Store'),
				accessor: (row) => row?.store?.name || ''
			},
			{
				Header: t('Customer'),
				accessor: (row) => row?.supplier?.name || ''
			},
			{
				Header: t('Type'),
				accessor: (row) => row?.type?.name || ''
			},
			{
				Header: t('Brand'),
				accessor: (row) => row?.brand?.name || ''
			},
			{
				Header: t('Price'),
				accessor: row => `${decimalToPrice(row?.price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.quantity_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			},
			{
				Header: t('Count'),
				accessor: row => `${decimalToInteger(row?.quantity || 0)}/${decimalToInteger(row?.total_quantity || 0)}`
			},
			{
				Header: t('Date'),
				accessor: row => getDate(row.date)
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Product balance (by purchase)"/>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search', 'product', 'store','currency', 'customer', 'from_date', 'to_date']}/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>
		</>
	)
}

export default Stores