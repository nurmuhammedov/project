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
	Select, PageTitle, Badge, DetailButton
} from 'components'
import {FIELD} from 'constants/fields'
import {regionsOptions} from 'helpers/options'
import {
	useAdd, useData,
	useDetail,
	usePaginatedData,
	usePagination,
	useSearchParams,
	useUpdate
} from 'hooks'
import {IClientItemDetail} from 'interfaces/clients.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {clientSchema} from 'helpers/yup'
import {getSelectValue} from 'utilities/common'
import {getSelectOptions} from 'utilities/select'
import {IIDName} from 'interfaces/configuration.interface'
import {formatCurrencyData} from 'utilities/date'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {
		addParams,
		removeParams,
		paramsObject: {updateId = undefined, modal = undefined}
	} = useSearchParams()
	const {data: currencies = []} = useData<IIDName[]>('currency/select/', modal === 'client' || modal === 'edit')
	const {data: stores = []} = useData<IIDName[]>('stores/select/', modal === 'client' || modal === 'edit')
	const {data: priceTypes = []} = useData<IIDName[]>('/organization/price-type/select/', modal === 'client' || modal === 'edit')

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IClientItemDetail[]>(
		`customer/`,
		{page: page, page_size: pageSize}
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
			full_name: '',
			code: '',
			phone_number: '',
			address_detail: '',
			address: undefined,
			currency: undefined,
			store: undefined,
			price_type: undefined
		},
		resolver: yupResolver(clientSchema)
	})

	const columns: Column<IClientItemDetail>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: IClientItemDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Full name'),
				accessor: (row: IClientItemDetail) => row.full_name
			},
			{
				Header: t('Client code'),
				accessor: (row: IClientItemDetail) => row.code
			},
			{
				Header: t('Phone number'),
				accessor: (row: IClientItemDetail) => row.phone_number
			},
			{
				Header: t('Region'),
				accessor: (row: IClientItemDetail) => t(regionsOptions?.find(i => i.value == row.address)?.label?.toString() ?? '')
			},
			{
				Header: t('Balance'),
				accessor: (row: IClientItemDetail) =>
					<div dangerouslySetInnerHTML={{__html: formatCurrencyData(row?.customer_balance)}}></div>
			},
			{
				Header: t('Price type'),
				accessor: (row: IClientItemDetail) => <Badge title={row.price_type.name}/>
			},
			{
				Header: t('Currency'),
				accessor: (row: IClientItemDetail) => <Badge title={row.currency.name}/>
			},
			{
				Header: t('Store'),
				accessor: (row: IClientItemDetail) => row.store.name
			},
			{
				Header: t('Actions'),
				accessor: (row: IClientItemDetail) => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DetailButton id={row.id}/>
					</div>
				)
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
		defaultValues: {
			full_name: '',
			code: '',
			phone_number: '',
			address_detail: '',
			address: undefined,
			currency: undefined,
			store: undefined,
			price_type: undefined
		},
		resolver: yupResolver(clientSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('customer/create/')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('customer/update/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IClientItemDetail>('customer/detail/', updateId)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				full_name: detail.full_name,
				code: detail.code,
				phone_number: detail.phone_number,
				address: detail.address,
				currency: detail.currency?.id as number,
				address_detail: detail.address_detail,
				store: detail.store?.id as number,
				price_type: detail.price_type?.id as number
			})
		}
	}, [detail])

	return (
		<>
			<PageTitle title="Clients"/>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius={true} style={{width: 400}}/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'client'})}>
						Add a new client
					</Button>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal title="Add a new client" id="client" style={{height: '60rem', width: '60rem'}}>
				<Form
					onSubmit={handleAddSubmit((data) =>
						mutateAsync(data).then(async () => {
							resetAdd()
							removeParams('modal')
							await refetch()
						})
					)}
				>

					<div className="grid gap-lg">
						<div className="span-12">
							<Input
								id="full_name"
								label="Full name"
								error={addErrors.full_name?.message}
								{...registerAdd('full_name')}
							/>
						</div>

						<div className="span-6">
							<Input
								id="code"
								label="Client code"
								error={addErrors.code?.message}
								{...registerAdd('code')}
							/>
						</div>

						<div className="span-6">
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

						<div className="span-6">
							<Controller
								name="address"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="address"
										label="Region"
										options={regionsOptions}
										onBlur={onBlur}
										error={addErrors.address?.message}
										value={getSelectValue(regionsOptions, value)}
										defaultValue={getSelectValue(regionsOptions, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="store"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="store"
										label="Store"
										options={getSelectOptions(stores)}
										onBlur={onBlur}
										error={addErrors.store?.message}
										value={getSelectValue(getSelectOptions(stores), value)}
										defaultValue={getSelectValue(getSelectOptions(stores), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="currency"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										top={true}
										id="currency"
										label="Currency"
										options={getSelectOptions(currencies)}
										onBlur={onBlur}
										error={addErrors.currency?.message}
										value={getSelectValue(getSelectOptions(currencies), value)}
										defaultValue={getSelectValue(getSelectOptions(currencies), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="price_type"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										top={true}
										id="price_type"
										label="Price type"
										options={getSelectOptions(priceTypes)}
										onBlur={onBlur}
										error={addErrors.price_type?.message}
										value={getSelectValue(getSelectOptions(priceTypes), value)}
										defaultValue={getSelectValue(getSelectOptions(priceTypes), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>
						<div className="span-12">
							<Input
								id="address_detail"
								label="Address"
								error={addErrors.address_detail?.message}
								{...registerAdd('address_detail')}
							/>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '60rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) =>
						update(data).then(async () => {
							resetEdit()
							removeParams('modal', 'updateId')
							await refetch()
						})
					)}
				>
					<Input
						id="full_name"
						label="Full name"
						error={editErrors.full_name?.message}
						{...registerEdit('full_name')}
					/>

					<Input
						id="code"
						label="Client code"
						error={editErrors.code?.message}
						{...registerEdit('code')}
					/>

					<Controller
						name="phone_number"
						control={controlEdit}
						render={({field}) => (
							<MaskInput
								id="phone_number"
								label="Phone number"
								error={editErrors.phone_number?.message}
								{...field}
							/>
						)}
					/>

					<div className="grid gap-lg">

						<div className="span-6">
							<Controller
								name="address"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										top={true}
										id="address"
										label="Region"
										options={regionsOptions}
										onBlur={onBlur}
										error={editErrors.address?.message}
										value={getSelectValue(regionsOptions, value)}
										defaultValue={getSelectValue(regionsOptions, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Input
								id="address_detail"
								label="Address"
								error={editErrors.address_detail?.message}
								{...registerEdit('address_detail')}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="currency"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										top={true}
										id="currency"
										label="Currency"
										options={getSelectOptions(currencies)}
										onBlur={onBlur}
										error={editErrors.currency?.message}
										value={getSelectValue(getSelectOptions(currencies), value)}
										defaultValue={getSelectValue(getSelectOptions(currencies), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="price_type"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										top={true}
										id="price_type"
										label="Price type"
										options={getSelectOptions(priceTypes)}
										onBlur={onBlur}
										error={editErrors.price_type?.message}
										value={getSelectValue(getSelectOptions(priceTypes), value)}
										defaultValue={getSelectValue(getSelectOptions(priceTypes), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

					</div>

					<Controller
						name="store"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="store"
								label="Store"
								options={getSelectOptions(stores)}
								onBlur={onBlur}
								error={editErrors.store?.message}
								value={getSelectValue(getSelectOptions(stores), value)}
								defaultValue={getSelectValue(getSelectOptions(stores), value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Index