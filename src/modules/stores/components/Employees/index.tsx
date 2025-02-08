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
	Input, MaskInput,
	Modal,
	Pagination,
	ReactTable,
	Form
} from 'components'
import {FIELD} from 'constants/fields'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {IEmployeeDetail} from 'interfaces/stores.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {employeeEditSchema, employeeSchema} from 'helpers/yup'
import {useParams} from 'react-router-dom'


const Index = () => {
	const {id = undefined} = useParams()
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams, paramsObject: {updateId = undefined}} = useSearchParams()

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IEmployeeDetail[]>(
		`employee/${id}`,
		{page: page, page_size: pageSize},
		!!id
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			username: '',
			full_name: '',
			password: '',
			confirmPassword: '',
			email: '',
			phone: ''
		},
		resolver: yupResolver(employeeSchema)
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
					Header: t('Full name'),
					accessor: (row: IEmployeeDetail) => row.full_name
				},
				{
					Header: t('Duties'),
					accessor: () => null
				},
				{
					Header: t('Phone number'),
					accessor: (row: IEmployeeDetail) => row.phone
				},
				{
					Header: t('Login'),
					accessor: (row: IEmployeeDetail) => row.username
				},
				{
					Header: t('Actions'),
					accessor: (row: IEmployeeDetail) => <div className="flex items-start gap-lg">
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
		defaultValues: {username: '', full_name: '', phone: ''},
		resolver: yupResolver(employeeEditSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('employee/create/')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('employee/update/', updateId, 'patch')
	const {data: detail, isPending: isDetailLoading} = useDetail<IEmployeeDetail>('employee/detail/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({username: detail.username, full_name: detail.full_name, phone: detail.phone})
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

			<Modal title="Add a new employee" id="employee" style={{height: '60rem', width: '60rem'}}>
				<Form onSubmit={
					handleAddSubmit(
						(data) => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const {confirmPassword, ...rest} = data
							mutateAsync({...rest, store_id: id})
								.then(async () => {
									resetAdd()
									removeParams('modal')
									await refetch()
								})
						}
					)
				}
				>
					<Input
						id="full_name"
						label="Full name"
						error={addErrors.full_name?.message}
						{...registerAdd('full_name')}
					/>
					<Controller
						name="phone"
						control={controlAdd}
						render={({field}) => (
							<MaskInput
								id="phone"
								label="Phone number"
								error={addErrors?.phone?.message}
								{...field}
							/>
						)}
					/>
					<Input
						id="email"
						label="Email"
						error={addErrors.email?.message}
						{...registerAdd('email')}
					/>
					<Input
						id="username"
						label="Login"
						error={addErrors.username?.message}
						{...registerAdd('username')}
					/>
					<Input
						id="password"
						label="Password"
						type="password"
						error={addErrors.password?.message}
						{...registerAdd('password')}
					/>
					<Input
						id="confirmPassword"
						label="Confirm password"
						type="password"
						error={addErrors.confirmPassword?.message}
						{...registerAdd('confirmPassword')}
					/>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>Save</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '45rem', width: '60rem'}}>
				<Form
					onSubmit={
						handleEditSubmit(
							(data) => update(data)
								.then(async () => {
									resetEdit()
									removeParams('modal', 'updateId')
									await refetch()
								})
						)
					}
				>
					<Input
						id="full_name"
						label="Full name"
						error={editErrors.full_name?.message}
						{...registerEdit('full_name')}
					/>
					<Controller
						name="phone"
						control={controlEdit}
						render={({field}) => (
							<MaskInput
								id="phone"
								label="Phone number"
								error={editErrors?.phone?.message}
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
			<DeleteModal endpoint="employee/delete/" onDelete={refetch}/>
		</>
	)
}
export default Index
