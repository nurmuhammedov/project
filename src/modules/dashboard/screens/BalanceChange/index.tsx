import {Search} from 'assets/icons'
import {
	HR,
	Card,
	Input,
	ReactTable,
	Pagination,
	Badge
} from 'components'
import {IBalanceChange} from 'modules/dashboard/interfaces'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination} from 'hooks'
import {decimalToPrice} from 'utilities/common'
import {formatDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IBalanceChange[]>(
		`transactions/changes`,
		{page: page, page_size: pageSize}
	)

	const columns: Column<IBalanceChange>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IBalanceChange, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Store'),
					accessor: row => row?.store?.name
				},
				{
					Header: t('Customer'),
					accessor: row => row?.customer?.name
				},
				{
					Header: t('Conversion'),
					accessor: row => `${row?.store_currency?.name?.toLowerCase()} -> ${row?.customer_currency?.name?.toLowerCase()}`
				},
				// {
				// 	Header: t('Amount'),
				// 	accessor: row => `${decimalToPrice(row?.amount || 0)} ${row?.currency?.name?.toLowerCase()}`
				// },
				{
					Header: t('Type'),
					accessor: row => <Badge
						title={`${decimalToPrice(row.change)} ${row?.store_currency?.name?.toLowerCase()}`}
						type={Number(row.change) < 0 ? 'loss' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => formatDate(row.created_at ?? '')
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


