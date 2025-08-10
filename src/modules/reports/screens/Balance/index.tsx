import Filter from 'components/Filter'
import useTypedSelector from 'hooks/useTypedSelector'
import {ITransactionSummary} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToPrice} from 'utilities/common'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	ReactTable,
	PageTitle
} from 'components'
import {useTranslation} from 'react-i18next'


const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {
		paramsObject: {currency = undefined, ...params}
	} = useSearchParams()
	// const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const {store} = useTypedSelector(state => state?.stores)
	const {
		data,
		isPending: isLoading
	} = usePaginatedData<ITransactionSummary[]>('stores/balances/with-profit', {
			...params,
			page,
			currency: currency,
			page_size: pageSize,
			store: store?.value
		},
		!!store?.value
	)

	const columns: Column<ITransactionSummary>[] = useMemo(
		() => [
			// {
			// 	Header: '№',
			// 	accessor: (_, index: number) => (page - 1) * pageSize + (index + 1),
			// 	style: {
			// 		width: '3rem',
			// 		textAlign: 'center'
			// 	}
			// },
			{
				Header: t('Balance info'),
				id: 'product',
				accessor: (row) => row?.label || ''
			},
			// {
			// 	Header: t('Store'),
			// 	accessor: (row) => row?.supplier?.store_name || ''
			// },
			{
				Header: () => <></>,
				id: 'customer',
				accessor: (row) => row?.amount ? decimalToPrice(row?.amount || '0') : ''
			},
			{
				Header: () => <></>,
				id: 'count',
				accessor: row => row?.refer_amount ? decimalToPrice(row?.refer_amount || '0') : ''
			}
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Balance">
				{/*<div className="flex items-center gap-lg">*/}
				{/*	<Button*/}
				{/*		style={{marginTop: 'auto'}}*/}
				{/*		disabled={isXMLLoading}*/}
				{/*		onClick={() => {*/}
				{/*			setIsXMLLoading(true)*/}
				{/*			interceptor.get(`temporaries/all/export`, {*/}
				{/*				responseType: 'blob',*/}
				{/*				params: {*/}
				{/*					...params,*/}
				{/*					page,*/}
				{/*					currency: currency,*/}
				{/*					page_size: pageSize,*/}
				{/*					store: store?.value*/}
				{/*				}*/}
				{/*			}).then(res => {*/}
				{/*				const blob = new Blob([res.data])*/}
				{/*				const link = document.createElement('a')*/}
				{/*				link.href = window.URL.createObjectURL(blob)*/}
				{/*				link.download = `${t('Temporaries (by purchase)')}.xlsx`*/}
				{/*				link.click()*/}
				{/*			}).finally(() => {*/}
				{/*				setIsXMLLoading(false)*/}
				{/*			})*/}
				{/*		}}*/}
				{/*		mini={true}*/}
				{/*	>*/}
				{/*		Export*/}
				{/*	</Button>*/}
				{/*</div>*/}
			</PageTitle>
			<Card screen={true} className="span-9 gap-xl">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search', 'single_currency']}
					/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				</div>
			</Card>
		</>
	)
}

export default Stores