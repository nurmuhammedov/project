import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {IExchange} from 'modules/clients/interfaces'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {Column} from 'react-table'
import {decimalToPrice, findName} from 'utilities/common'
import {getDate} from 'utilities/date'
import {Badge, Card, CardTitle, DetailButton, ReactTable} from 'components'
import {CSSProperties, FC, useMemo} from 'react'
import {usePaginatedData} from 'hooks'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	const {store} = useTypedSelector(state => state.stores)
	const {data, isPending: isLoading} = usePaginatedData<IExchange[]>(
		`stores/${store?.value}/transactions`,
		{page: 1, page_size: 7},
		!!store?.value
	)

	const columns: Column<IExchange>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IExchange, index: number) => (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Amount'),
					accessor: row => `${decimalToPrice(row?.amount || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},
				{
					Header: t('Type'),
					accessor: row => <Badge
						title={row.type == 3 ? 'Expense' : findName(exchangeOptions, row.type)}
						type={row.type == 3 ? 'expense' : row.type == 2 ? 'loss' : row?.type == 3 ? 'expense' : undefined}
					/>
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							<DetailButton
								id={row.id}
								url={row?.type == 3 ? `currency-exchange/expense/${row.id}` : `currency-exchange/${row.id}?tab=${row.type == 2 ? '2' : row.type == 3 ? '3' : '1'}`}
							/>
						</div>
					)
				}
			],
		[]
	)

	return (
		<Card style={style} className={className}>
			<CardTitle
				title="Currency exchange"
				subTitle="History"
				onClick={() => navigate(`currency-exchange/history`)}
			/>
			<div style={{marginTop: '2rem'}} className="flex flex-col gap-md flex-1">
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
			</div>
		</Card>
	)
}

export default Index