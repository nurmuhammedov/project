import {yupResolver} from '@hookform/resolvers/yup'
import {
	Button,
	Input,
	MaskInput,
	Modal,
	Form,
	Select
} from 'components'
import {FIELD} from 'constants/fields'
import {currencyOptions, regionsOptions} from 'constants/options'
import {
	useAdd, useData,
	useSearchParams
} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {customerSchema} from 'modules/clients/helpers/yup'
import {useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {getSelectValue} from 'utilities/common'
import {InferType} from 'yup'
import {useQueryClient} from '@tanstack/react-query'


const Index = () => {
	const {store} = useTypedSelector(state => state.stores)
	const queryClient = useQueryClient()

	const {
		removeParams,
		paramsObject: {modal = undefined}
	} = useSearchParams()

	const {
		data: stores = []
	} = useData<ISelectOption[]>('stores/select', modal === 'customer' || modal === 'edit')
	const {
		data: priceTypes = [],
		isPending: isPriceTypesLoading
	} = useData<ISelectOption[]>('price-types/select', modal === 'customer' || modal === 'edit')

	const {mutateAsync: addCustomer, isPending: isAdding} = useAdd('customers')

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

	return (
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
						queryClient?.invalidateQueries({queryKey: ['customers/select']})
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
	)
}

export default Index