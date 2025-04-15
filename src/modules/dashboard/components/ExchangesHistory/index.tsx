import {currencyOptions} from 'constants/options'
import {IExchange} from 'modules/clients/interfaces'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {Column} from 'react-table'
import {decimalToPrice, findName} from 'utilities/common'
import {formatDate} from 'utilities/date'
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
	const {data, isPending: isLoading} = usePaginatedData<IExchange[]>(
		`transactions`,
		{page: 1, page_size: 7}
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
					Header: t('Store'),
					accessor: row => row?.store?.name
				},
				{
					Header: t('Amount'),
					accessor: row => `${decimalToPrice(row?.amount || 0)} ${t(findName(currencyOptions, row?.currency)).toLowerCase()}`
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
								url={`currency-exchange/${row.id}/?tab=${row.type == 2 ? '2' : row.type == 3 ? '3' : '1'}`}
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