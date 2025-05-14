import {Search} from 'assets/icons'
import {
	HR,
	Input,
	ReactTable,
	Pagination
} from 'components'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()

	const {store} = useTypedSelector(state => state.stores)
	const {data, isPending: isLoading, totalPages} = usePaginatedData<ITemporaryListItem[]>(
		`stores/${store?.value}/sales`,
		{page: page, page_size: pageSize},
		!!store?.value
	)
	const columns: Column<ITemporaryListItem>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_, index: number) => (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Full name'),
					accessor: row => row?.customer?.name || ''
				},
				{
					Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
					accessor: row => ` ${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},
				{
					Header: t('Price type'),
					accessor: row => row?.price_type?.name || ''
				},
				{
					Header: t('Product types'),
					accessor: row => row?.items_count || '0'
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.sale_date ?? '')
				}
			],
		[]
	)

	return (
		<>
			{/*<Card screen={true} className="span-12 gap-2xl flex-1">*/}
			<div className="flex justify-between align-center">
				<Input
					id="search"
					icon={<Search/>}
					placeholder="Search"
					radius={true}
					style={{width: 400}}
				/>
			</div>
			<div className="flex flex-col gap-md flex-1">
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</div>
			{/*</Card>*/}
		</>
	)
}

export default Index


