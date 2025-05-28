import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import {IStockByPrice} from 'modules/reports/interfaces'
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
	} = usePaginatedData<IStockByPrice[]>('stocks/by-price', {
		...params,
		page,
		type: product_type,
		page_size: pageSize
	})


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
				accessor: 'product_name'
			},
			{
				Header: t('Code'),
				accessor: 'code'
			},
			{
				Header: t('Store'),
				accessor: 'store_name'
			},
			{
				Header: t('Brand'),
				accessor: 'brand_name'
			},
			{
				Header: t('Type'),
				accessor: 'type_name'
			},
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
				accessor: row => `${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Remaining stock (by price)"/>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['search', 'product', 'store', 'product_type', 'currency']}/>
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