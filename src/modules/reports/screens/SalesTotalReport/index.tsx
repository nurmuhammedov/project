import Filter from 'components/Filter'
import {ISalesByTotal} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToInteger} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	Pagination,
	ReactTable,
	PageTitle
} from 'components'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, ...params}
	} = useSearchParams()

	const {
		data,
		totalPages,
		isPending: isLoading
	} = usePaginatedData<ISalesByTotal[]>('sale-items/by-product', {
		...params,
		page,
		type: product_type,
		page_size: pageSize
	})


	const columns: Column<ISalesByTotal>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: ISalesByTotal, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				accessor: (row) => row?.product_name || ''
			},
			{
				Header: t('Code'),
				accessor: (row) => row?.code || ''
			},
			{
				Header: t('Store'),
				accessor: (row) => row?.store_name || ''
			},
			{
				Header: t('Type'),
				accessor: (row) => row?.type_name || ''
			},
			{
				Header: t('Brand'),
				accessor: (row) => row?.brand_name || ''
			},
			{
				Header: `${t('Count')}`,
				accessor: row => `${decimalToInteger(row?.quantity || 0)}`
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Sales (total)"/>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search', 'product', 'store', 'product_type', 'brand', 'from_date', 'to_date']}/>
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