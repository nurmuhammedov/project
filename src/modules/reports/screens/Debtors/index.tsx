import {useMemo, useState} from 'react'
import {Button, Card, PageTitle, Pagination, ReactTable} from 'components'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {useTranslation} from 'react-i18next'
import {ICustomerWithSales, CustomerSaleRow} from 'modules/reports/interfaces/sales.interface'
import {interceptor} from 'libraries/index'
import useTypedSelector from 'hooks/useTypedSelector'
import {getDate} from 'utilities/date'
import {Column} from 'react-table'
import {decimalToPrice, findName} from 'utilities/common'
import {currencyOptions} from 'constants/options'


const CustomerSales = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const {paramsObject} = useSearchParams()
	const {store} = useTypedSelector(state => state.stores)

	const {data: raw, totalPages, isPending} = usePaginatedData<ICustomerWithSales[]>(
		'sales/debtors',
		{page, page_size: pageSize, ...paramsObject, ...paramsObject, store: store?.value}
	)
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)


	const data = useMemo<CustomerSaleRow[]>(() => {
		const rows: CustomerSaleRow[] = []
		;(raw || []).forEach((item: ICustomerWithSales) => {
			const len = item.sales?.length || 1

			if (item.sales?.length) {
				item.sales.forEach((s, idx) => {
					rows.push({
						customer_id: item.id,
						name: item.name,
						store: item.store,

						currency: s.currency,
						sale_date: s.sale_date,
						days_passed: s.days_passed,
						total_amount: s.total_amount,
						remaining_debt: s.remaining_debt,

						_rowSpan: idx === 0 ? len : 0,
						_isFirst: idx === 0
					})
				})
			} else {
				rows.push({
					customer_id: item.id,
					name: item.name,
					store: item.store,
					currency: undefined,
					sale_date: undefined,
					days_passed: undefined,
					total_amount: undefined,
					remaining_debt: undefined,
					_rowSpan: 1,
					_isFirst: true
				})
			}
		})
		return rows
	}, [raw])

	const columns: Column<CustomerSaleRow>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: CustomerSaleRow, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				},
				cellRowSpan: (row: CustomerSaleRow) => (row._isFirst ? row._rowSpan : 0)
			},
			{
				Header: t('Customer'),
				accessor: (row: CustomerSaleRow) => row.name,
				cellRowSpan: (row: CustomerSaleRow) => (row._isFirst ? row._rowSpan : 0)
			},
			{
				Header: t('Date'),
				accessor: (row: CustomerSaleRow) => row.sale_date ? getDate(row.sale_date) : ''
			},
			{
				Header: t('Days'),
				accessor: (row: CustomerSaleRow) => row.days_passed ?? ''
			},
			{
				Header: t('Total'),
				accessor: (row: CustomerSaleRow) => `${decimalToPrice(row?.total_amount)} ${t(findName(currencyOptions, row?.currency) || '')?.toLowerCase()}`
			},
			{
				Header: t('Debt'),
				accessor: (row: CustomerSaleRow) => `${decimalToPrice(row?.remaining_debt)} ${t(findName(currencyOptions, row?.currency) || '')?.toLowerCase()}`
			}
		],
		[t]
	)

	return (
		<>
			<PageTitle title={t('Debtors')}>
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`sales/debtors`, {
								responseType: 'blob',
								params: {
									...paramsObject,
									page,
									page_size: pageSize,
									excel_export: true,
									store: store?.value
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Debtors')}.xlsx`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						Exel
					</Button>
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`sales/debtors`, {
								responseType: 'blob',
								params: {
									...paramsObject,
									page,
									page_size: pageSize,
									pdf_export: true,
									store: store?.value
								}
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Debtors')}.pdf`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						PDF
					</Button>
				</div>
			</PageTitle>
			<Card screen className="span-9 gap-xl">
				<ReactTable columns={columns} data={data} isLoading={isPending}/>
				<Pagination totalPages={totalPages}/>
			</Card>
		</>
	)
}

export default CustomerSales
