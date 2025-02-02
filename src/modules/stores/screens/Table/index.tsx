import {
	HR,
	Form,
	Card,
	Input,
	Modal,
	Select,
	Button,
	EditModal,
	PageTitle,
	Pagination,
	ReactTable,
	EditButton,
	DetailButton
} from 'components'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {FIELD} from 'constants/fields'
import {storesTypeOptions} from 'helpers/options'
import {storeSchema} from 'helpers/yup'
import {IStoreItemDetail} from 'interfaces/stores.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {getSelectValue} from 'utilities/common'
import {formatDate} from 'utilities/date'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined}} = useSearchParams()

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IStoreItemDetail[]>(
		'stores/',
		{
			page: page,
			page_size: pageSize
		}
	)

	const columns: Column<IStoreItemDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IStoreItemDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: (row: IStoreItemDetail) => row.name
				},
				{
					Header: t('Type'),
					accessor: (row: IStoreItemDetail) => t(storesTypeOptions.find(i => i.value == row.store_type)?.label?.toString() ?? '')
				},
				{
					Header: t('Date added'),
					accessor: (row: IStoreItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Actions'),
					accessor: (row: IStoreItemDetail) => <div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DetailButton id={row.id}/>
					</div>
				}
			],
		[t, page, pageSize]
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', store_type: undefined},
		resolver: yupResolver(storeSchema)
	})


	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', store_type: undefined},
		resolver: yupResolver(storeSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('stores/create/')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('stores/update/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IStoreItemDetail>('stores/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({name: detail.name, store_type: detail.store_type})
		}
	}, [detail, resetEdit])

	return (
		<>
			<PageTitle title="Stores">
				<div className="flex align-center gap-lg">
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'store'})}
					>
						Add a new store
					</Button>
				</div>
			</PageTitle>

			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex items-start">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius={true}
						style={{width: 400}}
					/>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="store" style={{height: '37rem'}}>
				<Form
					onSubmit={
						handleAddSubmit((data) => mutateAsync(data).then(async () => {
							resetAdd()
							removeParams('modal')
							await refetch()
						}))
					}
				>
					<Input
						id="name"
						type={FIELD.TEXT}
						label="Name"
						placeholder="Enter name"
						error={addErrors?.name?.message}
						{...registerAdd('name')}
					/>

					<Controller
						name="store_type"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								id="store_type"
								options={storesTypeOptions}
								onBlur={onBlur}
								label="Type"
								error={addErrors?.store_type?.message}
								value={getSelectValue(storesTypeOptions, value)}
								defaultValue={getSelectValue(storesTypeOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Button
						style={{marginTop: 'auto'}}
						type={FIELD.SUBMIT}
						disabled={isAdding}
					>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '37rem'}}>
				<Form
					onSubmit={
						handleEditSubmit((data) => update(data).then(async () => {
							resetEdit()
							removeParams('modal', 'updateId')
							await refetch()
						}))
					}
				>
					<Input
						id="name"
						type={FIELD.TEXT}
						label="Name"
						placeholder="Enter name"
						error={editErrors?.name?.message}
						{...registerEdit('name')}
					/>

					<Controller
						name="store_type"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								id="store_type"
								options={storesTypeOptions}
								onBlur={onBlur}
								label="Type"
								error={editErrors?.store_type?.message}
								value={getSelectValue(storesTypeOptions, value)}
								defaultValue={getSelectValue(storesTypeOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Button
						style={{marginTop: 'auto'}}
						type={FIELD.SUBMIT}
						disabled={isUpdating}
					>
						Edit
					</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Index