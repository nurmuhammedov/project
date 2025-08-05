import Filter from 'components/Filter'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISalesByTotal} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo, useState} from 'react'
import {decimalToInteger} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	Pagination,
	ReactTable,
	PageTitle, Button
} from 'components'
import {interceptor} from 'libraries/index'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, ...params}
	} = useSearchParams()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const {store} = useTypedSelector(state => state.stores)

	const {
		data,
		totalPages,
		isPending: isLoading
	} = usePaginatedData<ISalesByTotal[]>('sale-items/report/by-product', {
			...params,
			page,
			type: product_type,
			page_size: pageSize,
			store: store?.value
		},
		!!store?.value
	)

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
				// accessor: (row) => row?.product_name || '',
				accessor: (row) => `${row?.product_name}${row?.brand_name ? ` - (${row?.brand_name})` : ``}`
			},
			{
				Header: t('Code'),
				accessor: (row) => row?.code || ''
			},
			// {
			// 	Header: t('Store'),
			// 	accessor: (row) => row?.store_name || ''
			// },
			{
				Header: t('Type'),
				accessor: (row) => row?.type_name || ''
			},
			// {
			// 	Header: t('Brand'),
			// 	accessor: (row) => row?.brand_name || ''
			// },
			{
				Header: `${t('Count')}`,
				accessor: row => `${decimalToInteger(row?.quantity || 0)}`
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Sales (total)">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`sale-items/by-product/export`, {
								responseType: 'blob',
								params: {
									...params,
									page,
									type: product_type,
									page_size: pageSize,
									store: store?.value
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Sales (total)')}.xlsx`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						Export
					</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search', 'product', 'product_type', 'brand', 'from_date', 'to_date']}
					/>
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