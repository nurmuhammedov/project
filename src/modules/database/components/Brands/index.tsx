import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {
	Button,
	Card,
	DeleteButton,
	DeleteModal,
	EditButton,
	EditModal,
	HR,
	Input,
	Modal,
	Pagination,
	ReactTable,
	Form
} from 'components'
import {FIELD} from 'constants/fields'
import {databaseTableHeader} from 'helpers/headers'
import {databaseSchema} from 'helpers/yup'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {IDatabaseItemDetail} from 'interfaces/database.interface'
import {useEffect, useMemo} from 'react'
import {useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined}} = useSearchParams()

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IDatabaseItemDetail[]>(
		'brands',
		{
			page: page,
			page_size: pageSize
		}
	)

	const columns: Column<IDatabaseItemDetail>[] = useMemo(() =>
			[
				...databaseTableHeader(t, page, pageSize),
				{
					Header: t('Actions'),
					accessor: (row: IDatabaseItemDetail) => <div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton id={row.id}/>
					</div>
				}
			],
		[t, page, pageSize]
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: ''},
		resolver: yupResolver(databaseSchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: ''},
		resolver: yupResolver(databaseSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('brands')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('brands/', updateId)
	const {data: detail, isPending: isDetailLoading} = useDetail<IDatabaseItemDetail>('brands/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({name: detail.name})
		}
	}, [detail, resetEdit])

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius={true}
						style={{width: 400}}
					/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'brands'})}>
						Add
					</Button>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="brands" animation="flip" style={{height: '20rem'}}>
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
					<Button
						style={{marginTop: 'auto'}}
						type={FIELD.SUBMIT}
						disabled={isAdding}
					>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '21rem'}}>
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
					<Button
						style={{marginTop: 'auto'}}
						type={FIELD.SUBMIT}
						disabled={isUpdating}
					>
						Edit
					</Button>
				</Form>
			</EditModal>

			<DeleteModal endpoint="brands/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index
