import {Search} from 'assets/icons'
import {
	HR,
	Card,
	Input,
	ReactTable,
	Pagination,
	Badge
} from 'components/index'
import {currencyOptions} from 'constants/options'
import {IBalanceChange} from 'modules/dashboard/interfaces'
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
	const {id = undefined} = useParams()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IBalanceChange[]>(
		`stores/${id}/changes`,
		{page: page, page_size: pageSize},
		!!id
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
					Header: t('Customer'),
					accessor: row => row?.customer?.name
				},
				{
					Header: t('Conversion'),
					accessor: row => ` ${t(findName(currencyOptions, row?.store_currency) || '')?.toLowerCase()} ->  ${t(findName(currencyOptions, row?.customer_currency) || '')?.toLowerCase()}`
				},
				{
					Header: t('Amount'),
					accessor: row => <Badge
						title={`${decimalToPrice(row.change)}  ${t(findName(currencyOptions, row?.store_currency) || '')?.toLowerCase()}`}
						type={Number(row.change) < 0 ? 'loss' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.date ?? '')
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


