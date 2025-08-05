import Filter from 'components/Filter'
import useTypedSelector from 'hooks/useTypedSelector'
import {IStock} from 'modules/products/interfaces'
import {useTranslation} from 'react-i18next'
import {useMemo} from 'react'
import {Column} from 'react-table'

import {
	Card,
	ReactTable,
	Pagination
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
	const {
		paramsObject: {product_type = undefined, ...params}
	} = useSearchParams()
	const {store} = useTypedSelector(state => state.stores)

	const {data, totalPages, isPending: isLoading} = usePaginatedData<IStock[]>(
		`stocks`,
		{...params, page: page, page_size: pageSize, type: product_type, tab: undefined, store: store?.value},
		!!store?.value
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
				accessor: (row) => `${row?.product_name}${row?.brand_name ? ` - (${row?.brand_name})` : ``}`
			},
			{
				Header: `${t('Total')} ${t('Count')?.toLowerCase()}`,
				accessor: (row) => decimalToInteger(row.total_quantity)
			},
			// {
			// 	Header: `${t('Customer')} ${t('Count')?.toLowerCase()}`,
			// 	accessor: (row) => decimalToInteger(row?.customer_count)
			// },
			// {
			// 	Header: t('Store'),
			// 	accessor: (row) => row.store_name
			// },
			{
				Header: t('Type'),
				accessor: (row) => row.type_name
			}
			// {
			// 	Header: t('Code'),
			// 	accessor: (row) => row.code
			// }
			// {
			// 	Header: t('Actions'),
			// 	accessor: (row) => (
			// 		<div className="flex items-start gap-lg">
			// 			<EditButton id={row.id}/>
			// 			<DeleteButton id={row.id}/>
			// 		</div>
			// 	)
			// }
		],
		[page, pageSize]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['search', 'customer', 'product_type', 'product']}/>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<Pagination totalPages={totalPages}/>
			</Card>
		</>
	)
}

export default ProductWarehouse