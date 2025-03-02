import {Search} from 'assets/icons'
import {
	Card,
	DetailButton,
	HR,
	Input,
	Pagination,
	ReactTable
} from 'components'
import {IPurchaseListItem} from 'interfaces/products.interface'
import {usePaginatedData, usePagination} from 'hooks'
import {decimalToPrice} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {formatDate} from 'utilities/date'
import {useMemo} from 'react'
import {Column} from 'react-table'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {id = undefined} = useParams()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IPurchaseListItem[]>(
		`sale/list`,
		{page: page, page_size: pageSize, supplier: id},
		!!id
	)

	const columns: Column<IPurchaseListItem>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IPurchaseListItem, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Total amount'),
					accessor: (row: IPurchaseListItem) => `${decimalToPrice(row.total_price ?? '0')} ${row.currency?.label ?? ''}`
				},
				{
					Header: t('Price type'),
					accessor: (row: IPurchaseListItem) => row.price_type?.name ?? ''
				},
				{
					Header: t('Date'),
					accessor: (row: IPurchaseListItem) => formatDate(row.created_at ?? '')
				},
				{
					Header: t('Actions'),
					accessor: (row: IPurchaseListItem) => (
						<div className="flex items-start gap-lg">
							<DetailButton id={row.id} url={`${row.id}/product-exchange?tab=sale`}/>
						</div>
					)
				}
			],
		[t, page, pageSize]
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
