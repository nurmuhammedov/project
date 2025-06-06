import Filter from 'components/Filter'
import {IStock} from 'modules/products/interfaces'
import {useTranslation} from 'react-i18next'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'
import {Column} from 'react-table'

import {
	HR,
	Card,
	ReactTable,
	// EditButton,
	Pagination, DetailButton
	// DeleteButton
} from 'components'

import {
	usePagination,
	useSearchParams,
	usePaginatedData
} from 'hooks'
import {decimalToInteger} from 'utilities/common'


const ProductWarehouse = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {customerId = undefined} = useParams()
	const {
		paramsObject: {product_type = undefined, ...params}
	} = useSearchParams()

	const {data, totalPages, isPending: isLoading} = usePaginatedData<IStock[]>(
		`customers/${customerId}/stock`,
		{...params, page: page, page_size: pageSize, type: product_type, tab: undefined}
	)

	const columns: Column<IStock>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: IStock, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				accessor: (row) => row.product_name
			},
			{
				Header: t('Count'),
				accessor: (row) => decimalToInteger(row.total_quantity)
			},
			// {
			// 	Header: `${t('Store')} ${t('Count')?.toLowerCase()}`,
			// 	accessor: (row) => decimalToInteger(row?.store_count)
			// },
			{
				Header: t('Type'),
				accessor: (row) => row.type_name
			},
			{
				Header: t('Brand'),
				accessor: (row) => row.brand_name
			},
			{
				Header: t('Code'),
				accessor: (row) => row.code
			},
			{
				Header: t('Actions'),
				accessor: (row) => (
					<div className="flex items-start gap-lg">
						<DetailButton url={`warehouse/${row.product_id}`}/>
					</div>
				)
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['search', 'product_type', 'store']}/>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>
		</>
	)
}

export default ProductWarehouse