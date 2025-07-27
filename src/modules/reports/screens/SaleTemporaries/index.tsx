import Filter from 'components/Filter'
import {ISaleProduct} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo, useState} from 'react'
import {decimalToInteger, decimalToPrice} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	// Pagination,
	ReactTable,
	PageTitle, Button
} from 'components'
import {interceptor} from 'libraries/index'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, customer = undefined, ...params}
	} = useSearchParams()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)

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
				Header: t('Count'),
				accessor: row => `${decimalToInteger(row?.total_quantity || 0)}`
			},
			{
				Header: t('Price'),
				accessor: row => `${decimalToPrice(row?.price || 0)}`
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.total_price || 0)}`
			}
		],
		[page, pageSize]
	)


	return (
		<>
			<PageTitle title="Temporaries (by sale)">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`sale-temporaries/all/export`, {
								responseType: 'blob',
								params: {
									...params,
									page,
									type: product_type,
									supplier: customer,
									page_size: pageSize
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Temporaries (by sale)')}.xlsx`
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
						fieldsToShow={['search', 'store', 'customer']}/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				</div>
			</Card>
		</>
	)
}

export default Stores