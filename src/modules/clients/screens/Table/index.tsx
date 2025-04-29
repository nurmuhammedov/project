import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {
	Button,
	Card,
	EditButton,
	EditModal,
	HR,
	Input,
	MaskInput,
	Modal,
	Pagination,
	ReactTable,
	Form,
	Select,
	PageTitle,
	DetailButton
} from 'components'
import {FIELD} from 'constants/fields'
import {currencyOptions, regionsOptions} from 'constants/options'
import {
	useAdd, useData,
	useDetail,
	usePaginatedData,
	usePagination,
	useSearchParams,
	useUpdate
} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerDetail} from 'modules/clients/interfaces'
import {customerSchema} from 'modules/clients/helpers/yup'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {findName, getSelectValue} from 'utilities/common'
import {InferType} from 'yup'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {store} = useTypedSelector(state => state.stores)

	const {
		addParams,
		removeParams,
		paramsObject: {updateId = undefined, modal = undefined}
	} = useSearchParams()
	const {
		data: stores = []
	} = useData<ISelectOption[]>('stores/select', modal === 'customer' || modal === 'edit')
	const {
		data: priceTypes = [],
		isPending: isPriceTypesLoading
	} = useData<ISelectOption[]>('price-types/select', modal === 'customer' || modal === 'edit')

	const {mutateAsync: addCustomer, isPending: isAdding} = useAdd('customers')
	const {mutateAsync: updateCustomer, isPending: isUpdating} = useUpdate('customers/', updateId, 'patch')
	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<ICustomerDetail>('customers/', updateId)


	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<ICustomerDetail[]>(
		`customers`,
		{page: page, page_size: pageSize}
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		setFocus,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof customerSchema>>({
		mode: 'onSubmit',
		defaultValues: {
			name: '',
			phone_number: '',
			region: undefined,
			currency: 'USD',
			address: '',
			store: store?.value ? Number(store?.value) : undefined,
			price_type: undefined
		},
		resolver: yupResolver(customerSchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm<InferType<typeof customerSchema>>({
		mode: 'onSubmit',
		defaultValues: {
			name: '',
			phone_number: '',
			region: undefined,
			currency: 'USD',
			address: '',
			store: store?.value ? Number(store?.value) : undefined,
			price_type: undefined
		},
		resolver: yupResolver(customerSchema)
	})
	//
	// useEffect(() => {
	// 	if (stores?.length && !isStoresLoading && stores?.find((store) => store?.is_main)?.value) {
	// 		resetAdd((prevValues: InferType<typeof customerSchema>) => ({
	// 			...prevValues,
	// 			store: stores?.find((store) => store?.is_main)?.value as unknown as number ?? undefined
	// 		}))
	// 	}
	// }, [stores])

	useEffect(() => {
		if (priceTypes?.length && !isPriceTypesLoading && priceTypes?.[0]?.value) {
			resetAdd((prevValues: InferType<typeof customerSchema>) => ({
				...prevValues,
				price_type: priceTypes?.[0]?.value as unknown as number ?? undefined
			}))
		}
	}, [priceTypes])

	useEffect(() => {
		if (modal == 'customer') {
			setTimeout(() => {
				setFocus('name')
			}, 0)
		}
	}, [modal])

	const columns: Column<ICustomerDetail>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: ICustomerDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Full name'),
				accessor: row => row.name
			},
			{
				Header: t('Store'),
				accessor: row => row.store?.name
			},
			// {
			// 	Header: t('Client code'),
			// 	accessor: row => row.code
			// },
			{
				Header: t('Phone number'),
				accessor: row => row.phone_number
			},
			{
				Header: t('Price type'),
				accessor: row => row.price_type?.name
			},
			{
				Header: t('Currency'),
				accessor: row => t(findName(currencyOptions, row.currency))
			},
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DetailButton id={row.id}/>
					</div>
				)
			}
		],
		[page, pageSize]
	)


	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				name: detail.name,
				phone_number: detail.phone_number,
				address: detail.address,
				currency: detail.currency,
				region: detail.region,
				store: detail.store?.id as number,
				price_type: detail.price_type?.id as number
			})
		}
	}, [detail])

	return (
		<>
			<PageTitle title="Customers"/>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius={true} style={{width: 400}}/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'customer'})}>
						Add a new client
					</Button>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal
				title="Add a new client"
				id="customer"
				style={{height: '40rem', width: '60rem'}}
				onClose={() => {
					removeParams('modal')
					resetAdd((prevValues: InferType<typeof customerSchema>) => ({
						...prevValues,
						store: store?.value ? Number(store?.value) : undefined as unknown as number,
						price_type: priceTypes?.[0]?.value as unknown as number ?? undefined,
						region: undefined,
						currency: 'USD',
						name: '',
						phone_number: '',
						address: ''
					}))
				}}
			>
				<Form
					onSubmit={handleAddSubmit((data) =>
						addCustomer(data).then(async () => {
							setFocus('name')
							resetAdd((prevValues: InferType<typeof customerSchema>) => ({
								...prevValues,
								store: store?.value ? Number(store?.value) : undefined as unknown as number,
								price_type: priceTypes?.[0]?.value as unknown as number ?? undefined,
								region: undefined,
								currency: 'USD',
								name: '',
								phone_number: '',
								address: ''
							}))
							// removeParams('modal')
							await refetch()
						})
					)}
				>

					<div className="grid gap-lg">
						<div className="span-12 grid gap-lg">
							<div className="span-4">
								<Input
									id="name"
									label="Full name"
									error={addErrors.name?.message}
									{...registerAdd('name')}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="phone_number"
									control={controlAdd}
									render={({field}) => (
										<MaskInput
											id="phone_number"
											label="Phone number"
											error={addErrors.phone_number?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="region"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="region"
											label="Region"
											options={regionsOptions}
											onBlur={onBlur}
											error={addErrors.region?.message}
											value={getSelectValue(regionsOptions, value)}
											defaultValue={getSelectValue(regionsOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>

						<div className="span-12 grid gap-lg">
							<div className="span-4">
								<Controller
									name="store"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="store"
											label="Store"
											options={stores}
											onBlur={onBlur}
											error={addErrors.store?.message}
											value={getSelectValue(stores, value)}
											defaultValue={getSelectValue(stores, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="currency"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="currency"
											label="Currency"
											options={currencyOptions}
											onBlur={onBlur}
											error={addErrors.currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="price_type"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="price_type"
											label="Price type"
											options={priceTypes}
											onBlur={onBlur}
											error={addErrors.price_type?.message}
											value={getSelectValue(priceTypes, value)}
											defaultValue={getSelectValue(priceTypes, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>
						<div className="span-12">
							<Input
								id="address"
								label="Address"
								error={addErrors.address?.message}
								{...registerAdd('address')}
							/>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '40rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) => {
							if (detail?.is_employee) {
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								const {name, phone_number, store, ...rest} = data
								updateCustomer(rest).then(async () => {
									resetEdit()
									removeParams('modal', 'updateId')
									await refetch()
								})
							} else {
								updateCustomer(data).then(async () => {
									resetEdit()
									removeParams('modal', 'updateId')
									await refetch()
								})
							}
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="span-12 grid gap-lg">
							<div className="span-4">
								<Input
									id="name"
									label="Full name"
									disabled={!!detail?.is_employee}
									error={editErrors.name?.message}
									{...registerEdit('name')}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="phone_number"
									control={controlEdit}
									render={({field}) => (
										<MaskInput
											id="phone_number"
											label="Phone number"
											disabled={!!detail?.is_employee}
											error={editErrors.phone_number?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="region"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="region"
											label="Region"
											options={regionsOptions}
											onBlur={onBlur}
											error={editErrors.region?.message}
											value={getSelectValue(regionsOptions, value)}
											defaultValue={getSelectValue(regionsOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>

						<div className="span-12 grid gap-lg">
							<div className="span-4">
								<Controller
									name="store"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="store"
											label="Store"
											disabled={!!detail?.is_employee}
											options={stores}
											onBlur={onBlur}
											error={editErrors.store?.message}
											value={getSelectValue(stores, value)}
											defaultValue={getSelectValue(stores, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="currency"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="currency"
											label="Currency"
											options={currencyOptions}
											onBlur={onBlur}
											error={editErrors.currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="span-4">
								<Controller
									name="price_type"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="price_type"
											label="Price type"
											options={priceTypes}
											onBlur={onBlur}
											error={editErrors.price_type?.message}
											value={getSelectValue(priceTypes, value)}
											defaultValue={getSelectValue(priceTypes, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>
						<div className="span-12">
							<Input
								id="address"
								label="Address"
								error={editErrors.address?.message}
								{...registerEdit('address')}
							/>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Index