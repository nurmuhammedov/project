import {usePaginatedData} from 'hooks/index'
import {ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {Card, CardTitle, ReactTable} from 'components'
import {CSSProperties, FC, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {decimalToPrice} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {formatDate} from 'utilities/date'
import {Column} from 'react-table'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {data, isPending: isLoading} = usePaginatedData<ITemporaryListItem[]>(
		`purchase/list`,
		{page: 1, page_size: 7}
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
					accessor: row => row?.store?.name || ''
				},
				{
					Header: t('Store'),
					accessor: row => row?.store?.name || ''
				},
				// {
				// 	Header: t('Price type'),
				// 	accessor: row => row?.price_type?.name || ''
				// },
				{
					Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
					accessor: row => ` ${decimalToPrice(row?.total_price || 0)} ${row?.currency?.toLowerCase()}`
				},
				{
					Header: t('Date'),
					accessor: row => formatDate(row.purchase_date ?? '')
				}
				// {
				// 	Header: t('Actions'),
				// 	accessor: row => (
				// 		<div className="flex items-start gap-lg">
				// 			<DetailButton
				// 				id={row.id}
				// 				url={`product-exchange/history`}
				// 			/>
				// 		</div>
				// 	)
				// }
			],
		[]
	)

	return (
		<Card screen={true} style={style} className={className}>
			<CardTitle
				title="Product exchange"
				subTitle="History"
				onClick={() => navigate(`product-exchange/history`)}
			/>
			<div style={{marginTop: '2rem'}} className="flex flex-col gap-md flex-1">
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
			</div>
		</Card>
	)
}

export default Index