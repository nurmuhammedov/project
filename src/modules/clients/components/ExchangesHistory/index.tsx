import {ICurrencyExchangeDetail} from 'interfaces/dashboard.interface'
import {Search} from 'assets/icons'
import {
	HR,
	Card,
	Input,
	ReactTable,
	Pagination,
	DetailButton
} from 'components'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination} from 'hooks'
import {formatCurrencyData, getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {id = undefined} = useParams()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<ICurrencyExchangeDetail[]>(
		`/currency/exchange/${id}`,
		{page: page, page_size: pageSize, supplier: id},
		!!id
	)

	const columns: Column<ICurrencyExchangeDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: ICurrencyExchangeDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Client'),
					accessor: (row: ICurrencyExchangeDetail) => row?.customer?.name
				},
				{
					Header: t('Store'),
					accessor: (row: ICurrencyExchangeDetail) => row?.store?.name
				},
				{
					Header: t('Amount'),
					accessor: (row: ICurrencyExchangeDetail) =>
						<div dangerouslySetInnerHTML={{__html: formatCurrencyData(row?.payment ?? [])}}></div>
				},
				{
					Header: t('Type'),
					accessor: (row: ICurrencyExchangeDetail) => row.type ?? ''
				},
				{
					Header: t('Date'),
					accessor: (row: ICurrencyExchangeDetail) => getDate(row.date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: (row: ICurrencyExchangeDetail) => (
						<div className="flex items-start gap-lg">
							<DetailButton
								id={row.id}
								url={`${row.id}/currency-exchange?tab=${row.type == 'chiqim' ? 'loss' : row.type == 'xarajat' ? 'expense' : 'income'}`}
							/>
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
