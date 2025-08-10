import Filter from 'components/Filter'
import useTypedSelector from 'hooks/useTypedSelector'
import {ITransactionDetail} from 'modules/reports/interfaces'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToInteger, decimalToPrice, findName} from 'utilities/common'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	ReactTable,
	PageTitle, Pagination
} from 'components'
import {useTranslation} from 'react-i18next'
import {getDate} from 'utilities/date'
import {currencyOptions} from 'constants/options'


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
		isPending: isLoading,
		totalPages
	} = usePaginatedData<ITransactionDetail[]>('sale-items/profit', {
			...params,
			page,
			currency: currency,
			page_size: pageSize,
			store: store?.value
		},
		!!store?.value
	)

	const columns: Column<ITransactionDetail>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: `${t('Trade')} ${t('Date')?.toLowerCase()}`,
				accessor: (row) => row?.purchase_item?.purchase_date ? getDate(row?.purchase_item?.purchase_date) : ''
			},
			{
				Header: t('Seller'),
				accessor: (row) => row?.sale_item?.sale?.customer?.name || ''
			},
			{
				Header: `${t('Income')} ${t('Date')?.toLowerCase()}`,
				accessor: row => row?.sale_item?.sale?.sale_date ? getDate(row?.sale_item?.sale?.sale_date) : ''
			},
			{
				Header: `${t('Income')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${row?.purchase_item?.price ? decimalToPrice(row?.purchase_item?.price) : ''} ${t(findName(currencyOptions, row?.purchase_item?.currency)).toLowerCase()}`
			},
			// {
			// 	Header: `${t('Income')} ${t('Currency')?.toLowerCase()}`,
			// 	accessor: row => t(findName(currencyOptions, row?.purchase_item?.currency)).toLowerCase()
			// },
			{
				Header: t('Count'),
				accessor: row => decimalToInteger(row?.quantity)
			},
			{
				Header: `${t('Trade')} ${t('Price')?.toLowerCase()}`,
				accessor: row => `${row?.sale_item?.price ? decimalToPrice(row?.sale_item?.price) : ''} ${t(findName(currencyOptions, row?.sale_item?.sale?.currency)).toLowerCase()}`
			},
			{
				Header: `${t('Rate')}`,
				accessor: row => decimalToPrice(row?.currency_rate || '')
			},
			{
				Header: `${t('Loss')}`,
				accessor: row => decimalToPrice(row?.total_sale_price || '')
			},
			{
				Header: `${t('Income')}`,
				accessor: row => decimalToPrice(row?.total_purchase_price || '')
			},
			{
				Header: `${t('Benefit')}`,
				accessor: row => decimalToPrice(row?.profit || '')
			}
			// {
			// 	Header: `${t('Trade')} ${t('Currency')?.toLowerCase()}`,
			// 	accessor: row => t(findName(currencyOptions, row?.purchase_item?.currency)).toLowerCase()
			// }
		],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Benefit">
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
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>
		</>
	)
}

export default Stores