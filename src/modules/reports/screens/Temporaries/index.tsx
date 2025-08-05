import Filter from 'components/Filter'
import useTypedSelector from 'hooks/useTypedSelector'
import {IPurchasedProduct} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo, useState} from 'react'
import {decimalToInteger, decimalToPrice} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	ReactTable,
	PageTitle,
	Button
} from 'components'
import {interceptor} from 'libraries/index'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {product_type = undefined, customer = undefined, ...params}
	} = useSearchParams()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const {store} = useTypedSelector(state => state?.stores)
	const {
		data,
		isPending: isLoading
	} = usePaginatedData<IPurchasedProduct[]>('temporaries/all', {
			...params,
			page,
			type: product_type,
			supplier: customer,
			page_size: pageSize,
			store: store?.value
		},
		!!store?.value
	)

	const columns: Column<IPurchasedProduct>[] = useMemo(
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
			// {
			// 	Header: t('Store'),
			// 	accessor: (row) => row?.supplier?.store_name || ''
			// },
			{
				Header: t('Customer'),
				accessor: (row) => row?.supplier?.name || ''
			},
			{
				Header: t('Count'),
				accessor: row => `${decimalToInteger(row?.unit_quantity || 0)}/${decimalToInteger(row?.total_quantity || 0)}`
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
			<PageTitle title="Temporaries (by purchase)">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`temporaries/all/export`, {
								responseType: 'blob',
								params: {
									...params,
									page,
									type: product_type,
									supplier: customer,
									page_size: pageSize,
									store: store?.value
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Temporaries (by purchase)')}.xlsx`
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
						fieldsToShow={['search', 'customer']}
					/>
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