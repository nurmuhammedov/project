import {DetailButton, EditButton, HR, Modal, PageTitle, Pagination, ReactTable} from 'components/index'
import {Button} from 'components/UI'
import {BUTTON_THEME} from 'constants/fields'
import useTypedSelector from 'hooks/useTypedSelector'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import Filter from 'components/Filter'
import {usePaginatedData, usePagination, useSearchParams} from 'hooks/index'
import {Column} from 'react-table'
import {useMemo, useState} from 'react'
import {getDate} from 'utilities/date'
import {ITransferHistory} from 'modules/reports/interfaces'
import Card from 'components/Card'
import {interceptor} from 'libraries/index'
import {showMessage} from 'utilities/alert'


const Index = () => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {page, pageSize} = usePagination()
	const {store} = useTypedSelector(state => state.stores)
	const {paramsObject: {id, ...rest}, addParams, removeParams} = useSearchParams()
	const {data, isFetching: isLoading, totalPages, refetch} = usePaginatedData<ITransferHistory[]>(
		`movements/parties`,
		{...rest, page: page, page_size: pageSize, from_store: store?.value},
		!!store?.value
	)
	const [loader, setLoader] = useState(false)


	const set = (id: number | string | boolean | null | undefined) => {
		setLoader(true)
		if (!loader) {
			interceptor
				.post(`movements/parties/${id}/receive`)
				.then(async () => {
					showMessage('Successful', 'success')
					removeParams('page', 'modal', 'id')
					await refetch()
				})
				.finally(async () => {
					setLoader(false)
				})
		}
	}


	const columns: Column<ITransferHistory>[] = useMemo(() =>
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
					Header: t('To store'),
					accessor: row => row?.to_store?.name || ''
				},
				{
					Header: t('Is received'),
					accessor: row => row?.is_received ? t('Yes') : t('No')
				},
				{
					Header: t('Count'),
					accessor: row => row?.items_count || '0'
				},
				{
					Header: t('Date'),
					accessor: row => getDate(row.date ?? '')
				},
				{
					Header: t('Actions'),
					accessor: row => (
						<div className="flex items-start gap-lg">
							{
								!row?.is_received &&
								<Button
									style={{whiteSpace: 'nowrap'}}
									mini={true}
									onClick={() => addParams({modal: 'accept', id: row?.id})}
								>
									Accept
								</Button>
							}
							<DetailButton id={row.id} url={`${row.id}?tab=sale`}/>
							{
								!row?.is_received &&
								<EditButton id={row.id} url={`edit/${row.id}?tab=sale`}/>
							}
						</div>
					),
					style: {
						maxWidth: '5rem'
					}
				}
			],
		[]
	)

	return (
		<>
			<PageTitle
				title={t('Transfer history')}>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-12 gap-md flex-1">
				<div className="flex justify-between align-center">
					<Filter
						fieldsToShow={['search', 'customer', 'price_type', 'from_date', 'to_date']}
					/>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal
				title="Accept?"
				id="accept"
				style={{height: '15rem'}}
			>
				<div style={{marginTop: 'auto'}} onClick={() => set(id)}>
					<Button style={{width: '100%'}} disabled={loader}>
						Confirm
					</Button>
				</div>
			</Modal>
		</>
	)
}

export default Index