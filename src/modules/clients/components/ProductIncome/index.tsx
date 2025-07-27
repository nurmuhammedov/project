import {Search} from 'assets/icons'
import {
	HR,
	Card,
	Input,
	ReactTable,
	Pagination, DetailButton, EditButton
} from 'components/index'
import {currencyOptions} from 'constants/options'
import {ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'
import {Column} from 'react-table'
import {usePaginatedData, usePagination} from 'hooks/index'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {customerId = undefined} = useParams()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<ITemporaryListItem[]>(
		`customers/${customerId}/purchases`,
		{page: page, page_size: pageSize},
		!!customerId
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
				// {
				// 	Header: t('Full name'),
				// 	accessor: row => row?.supplier?.name || ''
				// },
				{
					Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
					accessor: row => ` ${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},
				{
					Header: `${t('Expense')}`,
					accessor: row => ` ${decimalToPrice(row?.cost_amount || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},

				{
					Header: t('Product types'),
					accessor: row => row?.items_count || '0'
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.purchase_date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							<DetailButton
								id={row.id}
								url={`product-exchange/history/${row.id}?tab=purchase`}
							/>
							<EditButton
								id={row.id}
								url={`product-exchange/history/edit/${row.id}?tab=purchase`}
							/>
						</div>
					),
					style: {
						width: '5rem'
					}
				}
			],
		[]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl flex-1">
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
			</Card>
		</>
	)
}

export default Index


