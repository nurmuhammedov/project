import {
	HR,
	Card,
	ReactTable,
	Pagination,
	PageTitle,
	Button
} from 'components'
import Filter from 'components/Filter'
import {currencyOptions} from 'constants/options'
import {useMemo} from 'react'
import {Column} from 'react-table'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {decimalToPrice, findName} from 'utilities/common'
import {formatDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {BUTTON_THEME} from 'constants/fields'
import {useNavigate} from 'react-router-dom'
import {IExchangeRate} from 'modules/dashboard/interfaces'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {paramsObject} = useSearchParams()
	const navigate = useNavigate()
	const {data, totalPages, isPending: isLoading} = usePaginatedData<IExchangeRate[]>(
		`exchange-rates/history`,
		{...paramsObject, date: paramsObject?.purchase_date, page: page, page_size: pageSize, currency: 'UZS'}
	)

	const columns: Column<IExchangeRate>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_, index: number) => (page - 1) * pageSize + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: `1-${t('Currency')?.toLowerCase()}`,
					accessor: row => `${1} ${t(findName(currencyOptions, row.base_currency))?.toLowerCase()}`
				},
				{
					Header: `2-${t('Currency')?.toLowerCase()}`,
					accessor: row => `${decimalToPrice(row?.rate)} ${t(findName(currencyOptions, row.target_currency))?.toLowerCase()}`
				},
				{
					Header: t('Date'),
					accessor: row => formatDate(row.created_at)
				}
			],
		[page, pageSize]
	)

	return (
		<>
			<PageTitle title="Exchange rate history">
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-9 gap-2xl flex-1">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['purchase_date']}/>
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


