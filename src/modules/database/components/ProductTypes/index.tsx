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
	Form, Select
} from 'components'
import {FIELD} from 'constants/fields'
import {productTypesSchema} from 'helpers/yup'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {IDatabaseItemDetail} from 'interfaces/database.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {formatDate} from 'utilities/date'
import {seriesOptions} from 'helpers/options'
import {getSelectValue} from 'utilities/common'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined}} = useSearchParams()

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IDatabaseItemDetail[]>(
		'product-types',
		{
			page: page,
			page_size: pageSize
		}
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', expiry: false},
		resolver: yupResolver(productTypesSchema)
	})

	const columns: Column<IDatabaseItemDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IDatabaseItemDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: (row: IDatabaseItemDetail) => row.name
				},
				{
					Header: t('Date added'),
					accessor: (row: IDatabaseItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Expiry deadline'),
					accessor: (row: IDatabaseItemDetail) => row.expiry ? t('Exist') : t('No')

				},
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
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', expiry: false},
		resolver: yupResolver(productTypesSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('product-types')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('product-types/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IDatabaseItemDetail>('product-types/', updateId)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({name: detail.name, expiry: detail?.expiry})
		}
	}, [detail])

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
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'productTypes'})}>
						Add
					</Button>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="productTypes" style={{height: '30rem'}}>
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
						name="expiry"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="expiry"
								label="Is there expiry date?"
								onBlur={onBlur}
								error={addErrors.expiry?.message}
								options={seriesOptions}
								value={getSelectValue(seriesOptions, value)}
								defaultValue={getSelectValue(seriesOptions, value)}
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

			<EditModal isLoading={isFetching || !detail} style={{height: '30rem'}}>
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
						name="expiry"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="expiry"
								label="Is there expiry date?"
								onBlur={onBlur}
								error={editErrors.expiry?.message}
								options={seriesOptions}
								value={getSelectValue(seriesOptions, value)}
								defaultValue={getSelectValue(seriesOptions, value)}
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

			<DeleteModal endpoint="product-types/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index
