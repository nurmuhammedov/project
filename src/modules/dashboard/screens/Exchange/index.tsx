import {Exchange} from 'assets/icons'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {
	Button,
	Card,
	CardTab,
	Form,
	Input, Loader,
	NumberFormattedInput,
	PageTitle,
	Select
} from 'components'
import {ISelectOption} from 'interfaces/form.interface'
import {currencyExchangeOptions, exchangeOptions} from 'modules/dashboard/helpers/options'
import {currencyExchangeSchema} from 'modules/dashboard/helpers/yup'
import {IBalance, ICustomerShortData, ITransaction, ITransactionDetail} from 'modules/dashboard/interfaces'
import React, {FC, useEffect, useState} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {convertCurrency, findName, getBalanceAsString, getSelectValue, noop} from 'utilities/common'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {useNavigate, useParams} from 'react-router-dom'
import {InferType} from 'yup'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	const [isLoading, setIsLoading] = useState(false)
	const {paramsObject: {tab = currencyExchangeOptions[0]?.value, customerId = undefined}} = useSearchParams()
	const {id: storeId = undefined, exchangeId = undefined} = useParams()
	const {data: stores = []} = useData<ISelectOption[]>('stores/select')

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			customer: customerId ? Number(customerId) : undefined,
			store: storeId ? Number(storeId) : undefined,
			records: [],
			currency: undefined,
			first_amount: '',
			type: Number(tab),
			description: ''
		},
		resolver: yupResolver(currencyExchangeSchema)
	})

	const {fields} = useFieldArray({
		control,
		name: 'records' as never
	})


	const {data: serviceTypes = []} = useData<ISelectOption[]>('service-types/select', watch('type') == exchangeOptions[2].value)
	const {data: customers = []} = useData<ISelectOption[]>('customers/select', !!watch('store'), {store: watch('store')})
	const {data: currencies = []} = useData<ISelectOption[]>('currencies/select', !!watch('customer'))

	const {
		data: storeBalance = [],
		refetch: storeBalanceRefetch
	} = useData<IBalance[]>(`stores/${watch('store')}/balance`, !!watch('store'))
	const {
		data: customerBalance = [],
		refetch: customerBalanceRefetch
	} = useData<IBalance[]>(`customers/${watch('customer')}/balance`, !!watch('customer'))
	const {data: customer = undefined} = useData<ICustomerShortData>(`customers/${watch('customer')}/short-data`, !!watch('customer'))
	const {
		data: transactions = [],
		refetch: transactionsRefetch
	} = useData<ITransaction[]>(`exchange-rate/transaction`, !!watch('currency'), {currency: watch('currency')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITransactionDetail>(`transactions/`, exchangeId, !!exchangeId && retrieve)

	const {mutateAsync: add, isPending: isAdding} = useAdd(`transactions`)

	useEffect(() => {
		setValue('type', Number(tab))
		if (tab != exchangeOptions[2]?.value) {
			setValue('service_type', undefined as unknown as number)
		}
		if (watch('customer')) {
			customerBalanceRefetch().then(noop)
		}

		if (watch('store')) {
			storeBalanceRefetch().then(noop)
		}
	}, [tab])

	useEffect(() => {
		if (customer?.currency?.id) {
			setValue('currency', Number(customer?.currency?.id))
		}

		if (watch('customer')) {
			customerBalanceRefetch().then(noop)
		}

		if (watch('store')) {
			storeBalanceRefetch().then(noop)
		}
	}, [customer])

	useEffect(() => {
		if (transactions && transactions?.length && !retrieve) {
			setValue('records', transactions?.map(item => ({
				store_currency: item?.store_currency?.id,
				store_amount: '',
				customer_amount: ''
			})))
		}
	}, [transactions])

	useEffect(() => {
		if (detail && retrieve) {
			reset({
				customer: detail?.customer?.id,
				store: detail?.store?.id,
				records: detail?.records?.map(item => ({
					store_currency: item?.store_currency?.id,
					store_amount: item?.store_amount,
					customer_amount: item?.customer_amount
				})),
				currency: detail?.currency?.id,
				first_amount: detail?.amount,
				service_type: detail?.service_type?.id,
				type: detail?.type,
				description: detail?.description
			})
		}
	}, [detail])

	const handleDoubleClick = (
		index: number,
		fieldName: 'store_amount' | 'customer_amount'
	) => {
		const records = watch('records')
		const record = records[index]
		if (!record || !record.store_currency) return
		let result

		if (fieldName === 'customer_amount') {
			const storeAmount = parseFloat(record.store_amount || '0')
			result = convertCurrency(storeAmount, 'toStore', record.store_currency, transactions)
			setValue(`records.${index}.customer_amount`, result.toString())
		} else {
			const customerAmount = parseFloat(record.customer_amount || '0')
			result = convertCurrency(customerAmount, 'fromStore', record.store_currency, transactions)
			setValue(`records.${index}.store_amount`, result.toString())
		}
	}

	if (isDetailLoading) {
		return (<Loader/>)
	}
	return (
		<>
			<PageTitle title="Currency exchange">
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<Card screen={true}>
				{
					!retrieve &&
					<CardTab
						disabled={retrieve}
						style={{marginBottom: '1.5rem'}}
						fallbackValue={currencyExchangeOptions[0]?.value}
						tabs={currencyExchangeOptions}
					/>
				}

				<Form
					onSubmit={
						handleSubmit((data) => {
							setIsLoading(true)
							add(data)
								.then(() => {
									transactionsRefetch()
										.then(({data}) => {
											reset(prevState => {
												return {
													...prevState,
													records: data?.map(item => ({
														store_currency: item?.store_currency?.id,
														store_amount: '',
														customer_amount: ''
													})),
													first_amount: '',
													description: ''
												} as InferType<typeof currencyExchangeSchema>
											})
											customerBalanceRefetch().then(noop)
											storeBalanceRefetch().then(noop)
										})
										.finally(() => {
											setIsLoading(false)
										})
								})
								.catch(() => {
									setIsLoading(false)
								})
						})
					}
				>
					<div className="grid gap-lg span-12">
						<div className="grid gap-lg span-12">
							<div className="span-6">
								<Input
									id="Checkout"
									label="Checkout"
									disabled={true}
									placeholder=" "
									value={getBalanceAsString(storeBalance)}
								/>
							</div>
							<div className="span-6">
								<Input
									id="Checkout"
									label="Customer"
									disabled={true}
									placeholder=" "
									value={getBalanceAsString(customerBalance)}
								/>
							</div>
						</div>

						<div className="flex gap-lg span-12">
							<div className="flex-1">
								<Controller
									name="type"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="type"
											label="Type"
											isDisabled={true}
											onBlur={onBlur}
											options={exchangeOptions}
											error={errors.type?.message}
											value={getSelectValue(exchangeOptions, value)}
											defaultValue={getSelectValue(exchangeOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							{
								tab == exchangeOptions[2].value ?
									<div className="flex-1">
										<Controller
											name="service_type"
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													id="service_type"
													label="Expense type"
													options={serviceTypes}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors.service_type?.message}
													value={getSelectValue(serviceTypes, value)}
													defaultValue={getSelectValue(serviceTypes, value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div> : null
							}
							<div className="flex-1">
								<Controller
									name="store"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="store"
											label="Store"
											options={stores}
											onBlur={onBlur}
											isDisabled={retrieve}
											error={errors.store?.message}
											value={getSelectValue(stores, value)}
											defaultValue={getSelectValue(stores, value)}
											handleOnChange={(e) => {
												setValue('customer', undefined as unknown as number)
												onChange(e as string)
											}}
										/>
									)}
								/>
							</div>
							<div className="flex-1">
								<Controller
									name="customer"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="customer"
											label="Customer"
											onBlur={onBlur}
											options={customers}
											isDisabled={retrieve}
											error={errors.customer?.message}
											value={getSelectValue(customers, value)}
											defaultValue={getSelectValue(customers, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="flex-1">
								<Controller
									name="currency"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="currency"
											label="Currency"
											onBlur={onBlur}
											isDisabled={retrieve}
											options={currencies}
											error={errors.currency?.message}
											value={getSelectValue(currencies, value)}
											defaultValue={getSelectValue(currencies, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>
						{
							watch('currency') ?

								<div className="grid span-12 gap-lg">
									<div className="span-6">
										<Controller
											control={control}
											name="first_amount"
											render={({field}) => (
												<NumberFormattedInput
													{...field}
													id="first_amount"
													maxLength={12}
													disableGroupSeparators={false}
													allowDecimals={true}
													disabled={retrieve}
													label={`${findName(currencies, watch(`currency`))} (${t('Checkout')?.toLowerCase()})`}
													error={errors?.first_amount?.message}
												/>
											)}
										/>
									</div>
									<div className="span-6">
										<Input
											id="comment"
											label={`Comment`}
											disabled={retrieve}
											error={errors?.description?.message}
											{...register(`description`)}
										/>
									</div>
								</div> : null
						}
						<div
							style={{gridTemplateColumns: 'repeat(15, 1fr)', display: 'grid'}}
							className="span-12 gap-lg"
						>

							{
								(fields && fields.length && watch('currency')) ? fields?.map((field, index) => (
									<React.Fragment key={field.id}>
										{
											index % 2 == 1 && (
												<div className="span-1"></div>
											)
										}
										<div className="flex gap-lg span-7">
											<div className="flex-1">
												<Controller
													control={control}
													name={`records.${index}.store_amount`}
													render={({field}) => (
														<NumberFormattedInput
															{...field}
															id={`records.${index}.store_amount`}
															maxLength={12}
															disableGroupSeparators={false}
															allowDecimals={true}
															disabled={retrieve}
															label={`${findName(currencies, watch(`records.${index}.store_currency`))} (${t('Checkout')?.toLowerCase()})`}
															error={errors?.records?.[index]?.store_amount?.message}
															onDoubleClick={() => handleDoubleClick(index, 'store_amount')}
														/>
													)}
												/>
											</div>

											<div className="span-1 flex justify-center">
												<Exchange style={{transform: 'translateY(2.5rem)', height: '1.7rem'}}/>
											</div>

											<div className="flex-1">
												<Controller
													control={control}
													name={`records.${index}.customer_amount`}
													render={({field}) => (
														<NumberFormattedInput
															{...field}
															id={`records.${index}.customer_amount`}
															maxLength={12}
															disableGroupSeparators={false}
															allowDecimals={true}
															disabled={retrieve}
															label={`${findName(currencies, watch(`currency`))} (${t('Customer')?.toLowerCase()})`}
															error={errors?.records?.[index]?.customer_amount?.message}
															onDoubleClick={() => handleDoubleClick(index, 'customer_amount')}
														/>
													)}
												/>
											</div>
										</div>

									</React.Fragment>
								)) : null
							}
						</div>
					</div>
					{
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.SUBMIT}
							disabled={isAdding || isLoading}
						>
							Save
						</Button>
					}
				</Form>
			</Card>
		</>
	)
}

export default Index