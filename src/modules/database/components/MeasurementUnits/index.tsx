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
	Select
} from 'components'
import Form from 'components/Form'
import {FIELD} from 'constants/fields'
import {measurementUnitsOptions} from 'helpers/options'
import {measurementUnitsSchema} from 'helpers/yup'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {IMeasureItemDetail} from 'interfaces/database.interface'
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

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IMeasureItemDetail[]>(
		'organization/measurement',
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
		defaultValues: {name: '', value_type: undefined},
		resolver: yupResolver(measurementUnitsSchema)
	})

	const columns: Column<IMeasureItemDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IMeasureItemDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: (row: IMeasureItemDetail) => row.name
				},
				{
					Header: t('Type'),
					accessor: (row: IMeasureItemDetail) => t(measurementUnitsOptions.find(i => i.value == row.value_type)?.label?.toString() ?? '')
				},
				{
					Header: t('Date added'),
					accessor: (row: IMeasureItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Actions'),
					accessor: (row: IMeasureItemDetail) => <div className="flex items-start gap-lg">
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
		defaultValues: {name: '', value_type: undefined},
		resolver: yupResolver(measurementUnitsSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('organization/measurement/create')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('organization/measurement/update/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IMeasureItemDetail>('organization/measurement/detail/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({name: detail.name, value_type: detail.value_type})
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
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'expenseTypes'})}>
						Add
					</Button>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="expenseTypes" style={{height: '30rem'}}>
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
						name="value_type"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="value_type"
								options={measurementUnitsOptions}
								onBlur={onBlur}
								label="Type"
								error={addErrors?.value_type?.message}
								value={getSelectValue(measurementUnitsOptions, value)}
								defaultValue={getSelectValue(measurementUnitsOptions, value)}
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

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '30rem'}}>
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
						name="value_type"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								disabled={true}
								top={true}
								id="value_type"
								options={measurementUnitsOptions}
								onBlur={onBlur}
								label="Type"
								error={editErrors?.value_type?.message}
								value={getSelectValue(measurementUnitsOptions, value)}
								defaultValue={getSelectValue(measurementUnitsOptions, value)}
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

			<DeleteModal endpoint="/organization/measurement/delete/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index
