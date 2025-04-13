import {Search} from 'assets/icons'
import {
	HR,
	Card,
	Input,
	ReactTable,
	Pagination,
	DetailButton,
	Badge
} from 'components'
import {currencyOptions} from 'helpers/options'
import {IExchange} from 'modules/clients/interfaces'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {formatDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IExchange[]>(
		`transactions`,
		{page: page, page_size: pageSize}
	)

	const columns: Column<IExchange>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IExchange, index: number) => ((page - 1) * pageSize) + (index + 1),
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
					Header: t('Amount'),
					accessor: row => `${decimalToPrice(row?.amount || 0)} ${t(findName(currencyOptions, row?.currency) || '')?.toLowerCase()}`
				},
				{
					Header: t('Type'),
					accessor: row => <Badge
						title={findName(exchangeOptions, row.type)}
						type={row.type == 2 ? 'loss' : row?.type == 3 ? 'expense' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => formatDate(row.created_at ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							<DetailButton
								id={row.id}
								url={`/admin/home/currency-exchange/${row.id}?tab=${row.type == 2 ? '2' : row.type == 3 ? '3' : '1'}`}
							/>
						</div>
					)
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


