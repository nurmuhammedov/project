import {
	Card,
	ReactTable
} from 'components/index'
import {currencyOptions} from 'constants/options'
import {IBalance} from 'modules/dashboard/interfaces'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'
import {Column} from 'react-table'
import {useData} from 'hooks/index'
import {decimalToPrice, findName} from 'utilities/common'
import {useTranslation} from 'react-i18next'


const Index = () => {
	const {t} = useTranslation()
	const {id = undefined} = useParams()
	const {
		data: storeBalance = [],
		isPending
	} = useData<IBalance[]>(`stores/${id}/balance`, !!id)

	const columns: Column<IBalance>[] = useMemo(() =>
			[
				// {
				// 	Header: t('№'),
				// 	accessor: (_: IBalance, index: number) => (index + 1),
				// 	style: {
				// 		width: '3rem',
				// 		textAlign: 'center'
				// 	}
				// },
				{
					Header: t('Balance'),
					accessor: row => `${decimalToPrice(row?.amount)} ${t(findName(currencyOptions, row?.currency) || '')?.toLowerCase()}`
				}
			],
		[]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl flex-1">
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={storeBalance} isLoading={isPending}/>
				</div>
			</Card>
		</>
	)
}

export default Index


