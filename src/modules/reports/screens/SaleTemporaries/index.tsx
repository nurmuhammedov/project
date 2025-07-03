import Filter from 'components/Filter'
import {ISaleProduct} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToInteger, decimalToPrice} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	// Pagination,
	ReactTable,
	PageTitle
} from 'components'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, customer = undefined, ...params}
	} = useSearchParams()

	const {
		data,
		// totalPages,
		isPending: isLoading
	} = usePaginatedData<ISaleProduct[]>('sale-temporaries/all', {
		...params,
		page,
		type: product_type,
		supplier: customer,
		page_size: pageSize
	})


	const columns: Column<ISaleProduct>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				accessor: (row) => row?.product?.name || ''
			},
			{
				Header: t('Store'),
				accessor: (row) => row?.store?.name || ''
			},
			{
				Header: t('Customer'),
				accessor: (row) => row?.customer?.name || ''
			},
			{
				Header: t('Price'),
				accessor: row => `${decimalToPrice(row?.price || 0)}`
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.total_price || 0)}`
			},
			{
				Header: t('Count'),
				accessor: row => `${decimalToInteger(row?.total_quantity || 0)}`
			}
		],
		[page, pageSize]
	)


	return (
		<>
			<PageTitle title="Temporaries (by sale)"/>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search']}/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					{/*<Pagination totalPages={totalPages}/>*/}
				</div>
			</Card>
		</>
	)
}

export default Stores