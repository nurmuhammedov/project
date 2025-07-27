import {currencyOptions} from 'constants/options'
import {usePaginatedData} from 'hooks/index'
import useTypedSelector from 'hooks/useTypedSelector'
import {ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {Card, CardTitle, DetailButton, EditButton, ReactTable} from 'components'
import {CSSProperties, FC, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {decimalToPrice, findName} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {getDate} from 'utilities/date'
import {Column} from 'react-table'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {store} = useTypedSelector(state => state.stores)
	const {data, isPending: isLoading} = usePaginatedData<ITemporaryListItem[]>(
		`stores/${store?.value}/purchases`,
		{page: 1, page_size: 7},
		!!store?.value
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
					accessor: row => row?.supplier?.name || ''
				},
				// {
				// 	Header: t('Store'),
				// 	accessor: row => row?.store?.name || ''
				// },
				// {
				// 	Header: t('Price type'),
				// 	accessor: row => row?.price_type?.name || ''
				// },
				{
					Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
					accessor: row => ` ${decimalToPrice(row?.total_price || 0)} ${t(findName(currencyOptions, row?.currency, 'code')).toLowerCase()}`
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.purchase_date ?? '')
				},
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
				// },
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