import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {IStockByPrice} from 'modules/reports/interfaces'
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
import {interceptor} from 'libraries/index'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, currency = undefined, ...params}
	} = useSearchParams()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const {store} = useTypedSelector(state => state.stores)


	const {
		data,
		totalPages,
		isPending: isLoading
	} = usePaginatedData<IStockByPrice[]>('stocks/by-price', {
			...params,
			page,
			type: product_type,
			refer_currency: currency,
			page_size: pageSize,
			store: store?.value
		}, !!store?.value
	)


	const columns: Column<IStockByPrice>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: IStockByPrice, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Product'),
				// accessor: 'product_name',
				accessor: (row) => `${row?.product_name}${row?.brand_name ? ` - (${row?.brand_name})` : ``}`
			},
			// {
			// 	Header: t('Code'),
			// 	accessor: 'code'
			// },
			// {
			// 	Header: t('Store'),
			// 	accessor: 'store_name'
			// },
			// {
			// 	Header: t('Brand'),
			// 	accessor: 'brand_name'
			// },
			{
				Header: t('Type'),
				accessor: 'type_name'
			},
			{
				Header: `${t('Total')} ${t('Count')?.toLowerCase()}`,
				accessor:
					row => `${decimalToInteger(row?.total_quantity || 0)}`
			},
			{
				Header: t('Price'),
				accessor: row => currency ? `${decimalToPrice(row?.converted_price || 0)} ${t(findName(currencyOptions, row?.refer_currency, 'code')).toLowerCase()}` : `${decimalToPrice(row?.price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor:
					row => currency ? `${decimalToPrice(row?.converted_total_price || 0)} ${t(findName(currencyOptions, row?.refer_currency, 'code')).toLowerCase()}` : `${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			}
		],
		[page, pageSize, currency]
	)

	return (
		<>
			<PageTitle title="Remaining stock (by price)">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`stocks/by-price/export`, {
								responseType: 'blob',
								params: {
									...params,
									page,
									type: product_type,
									refer_currency: currency,
									page_size: pageSize,
									store: store?.value
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Remaining stock (by price)')}.xlsx`
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
					<Filter fieldsToShow={['search', 'product', 'product_type', 'single_currency']}/>
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