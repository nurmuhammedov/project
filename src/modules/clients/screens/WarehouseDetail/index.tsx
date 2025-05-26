import Filter from 'components/Filter'
import {BUTTON_THEME} from 'constants/fields'
import {useNavigate, useParams} from 'react-router-dom'
import {Column} from 'react-table'
import {useMemo} from 'react'
import {decimalToInteger} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {IInnerListItem, IProductData} from 'modules/stores/interfaces'
import {useData, usePagination, useSearchParams} from 'hooks'
import {
	Card,
	Button,
	ReactTable,
	PageTitle
} from 'components'
import {getDate} from 'utilities/date'


const Index = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {customerId = undefined, productId = undefined} = useParams()
	const {
		paramsObject: {...params}
	} = useSearchParams()

	const {
		data,
		isPending: isLoading
	} = useData<IProductData>(`customers/${customerId}/stock/${productId}`, !!customerId && !!productId, {
		...params
	})

	const columns: Column<IInnerListItem>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: IInnerListItem, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Store'),
				accessor: (row) => row?.store?.name
			},
			{
				Header: t('Count'),
				accessor: row => decimalToInteger(row.quantity)
			},
			{
				Header: t('Date'),
				accessor: row => getDate(row.updated_at)
			}
		],
		[page, pageSize]
	)


	return (
		<>
			<PageTitle title="Products warehouse">
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['search', 'store']}/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data?.inner_list ?? []} isLoading={isLoading}/>
				</div>
			</Card>
		</>
	)
}

export default Index