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
	Modal, NumberFormattedInput,
	Pagination,
	ReactTable,
	Select
} from 'components'
import Form from 'components/Form'
import {FIELD} from 'constants/fields'
import {PackagesSchema} from 'helpers/yup'
import {useAdd, useData, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {IPackageItemDetail} from 'interfaces/database.interface'
import {ISelectOption} from 'interfaces/form.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {getSelectValue} from 'utilities/common'
import {formatDate} from 'utilities/date'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined, modal = undefined}} = useSearchParams()

	const {data: measurementUnitsOptions = []} = useData<ISelectOption[]>('organization/measurement/select', modal === 'packages' || modal === 'edit')
	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IPackageItemDetail[]>(
		'/packages',
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
		watch: watchAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', measure: undefined, quantity: '', amount: ''},
		resolver: yupResolver(PackagesSchema)
	})

	const columns: Column<IPackageItemDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IPackageItemDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: (row: IPackageItemDetail) => row.name
				},
				{
					Header: t('Number of products per package'),
					accessor: (row: IPackageItemDetail) => row.quantity
				},
				{
					Header: t('Quantity of 1 product in the package(default)'),
					accessor: (row: IPackageItemDetail) => `${row.amount} ${row.measure_name}`
				},
				{
					Header: t('Date added'),
					accessor: (row: IPackageItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Actions'),
					accessor: (row: IPackageItemDetail) => <div className="flex items-start gap-lg">
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
		watch: watchEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {name: '', measure: undefined, quantity: '', amount: ''},
		resolver: yupResolver(PackagesSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('packages')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('packages/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IPackageItemDetail>('packages/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({
				name: detail.name,
				measure: detail.measure.id,
				amount: detail.amount,
				quantity: detail?.quantity
			})
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
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'packages'})}>
						Add
					</Button>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="packages" style={{height: '45rem'}}>
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
						name="measure"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								id="measure"
								options={measurementUnitsOptions}
								onBlur={onBlur}
								label="Measure unit"
								error={addErrors?.measure?.message}
								value={getSelectValue(measurementUnitsOptions, value)}
								defaultValue={getSelectValue(measurementUnitsOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Controller
						name="quantity"
						control={controlAdd}
						render={({field}) => (
							<NumberFormattedInput
								id="quantity"
								maxLength={3}
								allowDecimals={false}
								label="Number of products per package"
								error={addErrors?.quantity?.message}
								{...field}
							/>
						)}
					/>

					<Controller
						name="amount"
						control={controlAdd}
						render={({field}) => (
							<NumberFormattedInput
								id="amount"
								maxLength={20}
								label={
									watchAdd('measure') ? t(
										'Quantity of 1 product in the package',
										{measure: measurementUnitsOptions?.find(i => i?.value == watchAdd('measure'))?.label ?? ''}
									) : t('Quantity of 1 product in the package(default)')
								}
								error={addErrors?.amount?.message}
								{...field}
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

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '45rem'}}>
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
						name="measure"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								id="measure"
								options={measurementUnitsOptions}
								onBlur={onBlur}
								label="Measure unit"
								error={editErrors?.measure?.message}
								value={getSelectValue(measurementUnitsOptions, value)}
								defaultValue={getSelectValue(measurementUnitsOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Controller
						name="quantity"
						control={controlEdit}
						render={({field}) => (
							<NumberFormattedInput
								id="quantity"
								maxLength={3}
								label="Number of products per package"
								error={editErrors?.quantity?.message}
								{...field}
							/>
						)}
					/>

					<Controller
						name="amount"
						control={controlEdit}
						render={({field}) => (
							<NumberFormattedInput
								id="amount"
								maxLength={20}
								label={
									watchEdit('measure') ? t(
										'Quantity of 1 product in the package',
										{measure: measurementUnitsOptions?.find(i => i?.value == watchEdit('measure'))?.label ?? ''}
									) : t('Quantity of 1 product in the package(default)')
								}
								error={editErrors?.amount?.message}
								{...field}
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

			<DeleteModal endpoint="packages/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index
