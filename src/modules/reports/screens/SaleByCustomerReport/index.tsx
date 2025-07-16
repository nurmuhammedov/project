import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import {ISaleByCustomer} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo, useState} from 'react'
import {decimalToInteger, decimalToPrice, findName} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	Pagination,
	ReactTable,
	PageTitle, Button
} from 'components'
import {getDate} from 'utilities/date'
import {interceptor} from 'libraries/index'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, ...params}
	} = useSearchParams()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)

	const {
		data,
		totalPages,
		isPending: isLoading
	} = usePaginatedData<ISaleByCustomer[]>('sale-items', {
		...params,
		page,
		type: product_type,
		page_size: pageSize
	})


	const columns: Column<ISaleByCustomer>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: ISaleByCustomer, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				// accessor: (row) => row?.product?.name || '',
				accessor: (row) => `${row?.product?.name}${row?.brand?.name ? ` - (${row?.brand?.name})` : ``}`

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
				Header: t('Type'),
				accessor: (row) => row?.type?.name || ''
			},
			// {
			// 	Header: t('Brand'),
			// 	accessor: (row) => row?.brand?.name || ''
			// },
			{
				Header: t('Price'),
				accessor: row => `${decimalToPrice(row?.price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			},
			{
				Header: `${t('Total')} ${t('Count')?.toLowerCase()}`,
				accessor: row => `${decimalToInteger(row?.total_quantity || 0)}`
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.total_quantity || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			},
			{
				Header: t('Date'),
				accessor: row => getDate(row.sale_date)
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Sales (by customer)">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`sale-items/export`, {
								responseType: 'blob',
								params: {
									...params,
									page,
									type: product_type,
									page_size: pageSize
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Sales (by customer)')}.xlsx`
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
						fieldsToShow={['search', 'product', 'store', 'product_type', 'customer', 'from_date', 'to_date']}/>
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