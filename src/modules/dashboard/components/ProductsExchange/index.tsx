import {IExchange} from 'modules/clients/interfaces'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {decimalToPrice, findName} from 'utilities/common'
import {formatDate} from 'utilities/date'
import {Badge, Card, CardTitle, DetailButton, ReactTable} from 'components'
import {CSSProperties, FC, useMemo} from 'react'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {t} = useTranslation()


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
					Header: t('Name'),
					accessor: row => row?.store?.name
				},
				{
					Header: t('Count'),
					accessor: row => row?.store?.name
				},
				{
					Header: t('Amount'),
					accessor: row => `${decimalToPrice(row?.amount || 0)} ${row?.currency?.name?.toLowerCase()}`
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
		<Card screen={true} style={style} className={className}>
			<CardTitle
				title="Product exchange"
				subTitle="History"
			/>
			<div style={{marginTop: '2rem'}} className="flex flex-col gap-md flex-1">
				<ReactTable columns={columns} data={[]} isLoading={false}/>
			</div>
		</Card>
	)
}

export default Index