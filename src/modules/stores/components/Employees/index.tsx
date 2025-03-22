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
	MaskInput,
	Modal,
	Pagination,
	ReactTable,
	Form, Select, Chechbox
} from 'components'
import {FIELD} from 'constants/fields'
import {ROLE_LABEL} from 'constants/roles'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {roles} from 'modules/stores/helpers/options'
import {employeeEditSchema, employeeSchema} from 'modules/stores/helpers/yup'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {useParams} from 'react-router-dom'
import {IEmployeeDetail} from 'modules/stores/interfaces'
import {getSelectValue} from 'utilities/common'
import {InferType} from 'yup'


const DEFAULT_FORM_VALUES = {
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	username: '',
	password: 'password',
	confirmPassword: 'password'
}

const Employees = () => {
	const {id = undefined} = useParams()
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined}} = useSearchParams()

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IEmployeeDetail[]>(
		`users/${id}`,
		{page: page, page_size: pageSize},
		!!id
	)

	const {mutateAsync: addEmployee, isPending: isAdding} = useAdd('users')
	const {mutateAsync: updateEmployee, isPending: isUpdating} = useUpdate('users/', updateId, 'patch')

	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IEmployeeDetail>('users/', updateId)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof employeeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(employeeSchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm<InferType<typeof employeeEditSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(employeeEditSchema)
	})

	const columns: Column<IEmployeeDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IEmployeeDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('First name'),
					accessor: row => row.first_name
				},
				{
					Header: t('Last name'),
					accessor: row => row.first_name
				},
				{
					Header: t('Duties'),
					accessor: () => null
				},
				{
					Header: t('Phone number'),
					accessor: row => row.phone_number
				},
				{
					Header: t('Role'),
					accessor: row => t(ROLE_LABEL[row.role])
				},
				{
					Header: t('Actions'),
					accessor: row => <div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton id={row.id}/>
					</div>
				}
			],
		[page, pageSize]
	)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				first_name: detail.first_name,
				last_name: detail.last_name,
				username: detail.username,
				phone_number: detail.phone_number
			})
		}
	}, [detail])

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius={true} style={{width: 400}}/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'employee'})}>Add a new employee</Button>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal title="Add a new employee" id="employee" style={{height: '50rem', width: '60rem'}}>
				<Form onSubmit={
					handleAddSubmit(
						(data) => {
							addEmployee({...data, store: id})
								.then(async () => {
									removeParams('modal')
									resetAdd(DEFAULT_FORM_VALUES)
									await refetch()
								})
						}
					)
				}
				>
					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Input
								id="first_name"
								label="First name"
								error={addErrors.first_name?.message}
								{...registerAdd('first_name')}
							/>
						</div>
						<div className="span-6">
							<Input
								id="last_name"
								label="Last name"
								error={addErrors.last_name?.message}
								{...registerAdd('last_name')}
							/>
						</div>
					</div>
					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Controller
								name="phone_number"
								control={controlAdd}
								render={({field}) => (
									<MaskInput
										id="phone_number"
										label="Phone number"
										error={addErrors?.phone_number?.message}
										{...field}
									/>
								)}
							/>
						</div>
						<div className="span-6">
							<Input
								id="email"
								label="Email"
								error={addErrors.email?.message}
								{...registerAdd('email')}
							/>
						</div>
					</div>
					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Input
								id="username"
								label="Login"
								error={addErrors.username?.message}
								{...registerAdd('username')}
							/>
						</div>
						<div className="span-6">
							<Controller
								name="role"
								control={controlAdd}
								render={({field}) => (
									<Select
										id="role"
										options={roles}
										label="Role"
										error={addErrors?.role?.message}
										value={getSelectValue(roles, field.value)}
										handleOnChange={field.onChange}
									/>
								)}
							/>
						</div>
					</div>
					<Chechbox
						type="PAssword update"
					/>

					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Input
								id="password"
								label="Password"
								type="password"
								error={addErrors.password?.message}
								{...registerAdd('password')}
							/>
						</div>
						<div className="span-6">
							<Input
								id="confirmPassword"
								label="Confirm password"
								type="password"
								error={addErrors.confirmPassword?.message}
								{...registerAdd('confirmPassword')}
							/>
						</div>
					</div>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>Save</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '45rem', width: '60rem'}}>
				<Form
					onSubmit={
						handleEditSubmit(
							(data) => updateEmployee(data)
								.then(async () => {
									removeParams('modal', 'updateId')
									resetEdit(DEFAULT_FORM_VALUES)
									await refetch()
								})
						)
					}
				>
					<Input
						id="first_name"
						label="First name"
						error={editErrors.first_name?.message}
						{...registerEdit('first_name')}
					/>
					<Input
						id="last_name"
						label="Last name"
						error={editErrors.last_name?.message}
						{...registerEdit('last_name')}
					/>
					<Controller
						name="phone_number"
						control={controlEdit}
						render={({field}) => (
							<MaskInput
								id="phone_number"
								label="Phone number"
								error={editErrors?.phone_number?.message}
								{...field}
							/>
						)}
					/>
					<Input
						id="username"
						label="Login"
						error={editErrors.username?.message}
						{...registerEdit('username')}
					/>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>Edit</Button>
				</Form>
			</EditModal>
			<DeleteModal endpoint="users/" onDelete={refetch}/>
		</>
	)
}
export default Employees
