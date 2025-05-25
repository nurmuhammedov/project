import {yupResolver} from '@hookform/resolvers/yup'
import {Exchange} from 'assets/icons'
import {Button, Card, CardTab, Form, Info, Input, Loader, NumberFormattedInput, PageTitle, Select} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {currencyOptions} from 'constants/options'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {currencyExchangeOptions, exchangeOptions} from 'modules/dashboard/helpers/options'
import {currencyExchangeSchema} from 'modules/dashboard/helpers/yup'
import {IBalance, ICustomerShortData, IRecord, ITransaction, ITransactionDetail} from 'modules/dashboard/interfaces'
import {calculateTotalByRecords} from 'modules/dashboard/utilities/Exchange'
import React, {FC, useEffect, useState} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {convertCurrency, decimalToPrice, findName, getBalanceAsString, getSelectValue, noop} from 'utilities/common'
import {transformTransactions} from 'utilities/currency'
import {InferType} from 'yup'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	const [isLoading, setIsLoading] = useState(false)
	const {paramsObject: {tab = currencyExchangeOptions[0]?.value}} = useSearchParams()
	const {exchangeId = undefined} = useParams()
	const {store} = useTypedSelector(state => state.stores)
	// const {data: stores = [], isPending: isStoresLoading} = useData<ISelectOption[]>('stores/select')

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		setFocus,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			customer: undefined,
			store: store?.value ? Number(store?.value) : undefined,
			records: [],
			currency: undefined,
			first_amount: '0',
			type: Number(tab),
			description: ''
		},
		resolver: yupResolver(currencyExchangeSchema)
	})

	const {fields} = useFieldArray({
		control,
		name: 'records' as never
	})

	// const {
	// 	data: serviceTypes = [],
	// 	isPending: isServiceTypesLoading
	// } = useData<ISelectOption[]>('service-types/select', expanse)

	const {
		data: customers = [],
		isPending: isCustomersLoading
	} = useData<ISelectOption[]>('customers/select', !!watch('store'), {store: watch('store')})

	const {
		data: storeBalance = [],
		refetch: storeBalanceRefetch
	} = useData<IBalance[]>(`stores/${watch('store')}/balance`, !!watch('store') && !retrieve)

	const {
		data: customerBalance = [],
		refetch: customerBalanceRefetch
	} = useData<IBalance[]>(`customers/${watch('customer')}/balance`, !!watch('customer') && !retrieve)

	const {data: customer = undefined} = useData<ICustomerShortData>(`customers/${watch('customer')}/short-data`, !!watch('customer') && !retrieve, {}, [watch('customer')])

	const {
		data: transactions = [],
		refetch: transactionsRefetch
	} = useData<ITransaction[]>(`exchange-rates/transaction`, !!watch('currency') && !retrieve, {currency: watch('currency')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITransactionDetail>(`transactions/`, exchangeId, !!exchangeId && retrieve)

	const {mutateAsync: add, isPending: isAdding} = useAdd(`transactions`)

	useEffect(() => {
		setFocus('customer')

		reset({
			customer: undefined,
			store: store?.value ? Number(store?.value) : undefined,
			records: [],
			currency: undefined,
			first_amount: '0',
			type: Number(tab),
			description: ''
		})
	}, [tab, store?.value])

	useEffect(() => {
		if (customer?.currency) {
			setValue('currency', customer?.currency)
			setTimeout(() => {
				setFocus('first_amount')
			}, 0)
		}
	}, [customer])

	// useEffect(() => {
	// 	if (stores?.length && !isStoresLoading && stores?.find((store) => store?.is_main)?.value) {
	// 		reset((prevValues: InferType<typeof currencyExchangeSchema>) => ({
	// 			...prevValues,
	// 			store: stores?.find((store) => store?.is_main)?.value as unknown as number ?? undefined
	// 		}))
	// 	}
	//
	// }, [stores])

	useEffect(() => {
		if (watch('currency') && !retrieve) {
			setValue('records', transformTransactions(transactions, watch('currency'))?.map(item => ({
				store_currency: item?.store_currency?.id,
				store_amount: '0',
				customer_amount: '0'
			})))
		}
	}, [transactions])

	useEffect(() => {
		if (detail && retrieve) {
			reset({
				customer: detail?.customer?.id,
				store: detail?.store?.id,
				records: detail?.records?.filter(item => item?.store_currency != item?.customer_currency)?.map(item => ({
					store_currency: item?.store_currency,
					store_amount: Math.abs(Number(item?.store_amount || 0)) as unknown as string,
					customer_amount: Math.abs(Number(item?.customer_amount || 0)) as unknown as string
				})),
				currency: detail?.currency,
				first_amount: Math.abs(Number(detail?.records?.find(item => item?.store_currency == item?.customer_currency)?.customer_amount || 0)) as unknown as string,
				// service_type: detail?.service_type?.id,
				type: detail?.type,
				description: detail?.description
			})
		}
	}, [detail])

	const handleDoubleClick = (index: number, fieldName: 'store_amount' | 'customer_amount') => {
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

	if ((isDetailLoading || isCustomersLoading) && retrieve) {
		return (<Loader/>)
	}

	return (
		<>
			<PageTitle
				title={`${t(exchangeOptions?.find(i => i?.value == tab)?.label?.toString() || 'Currency exchange')}`}
			>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<Card style={{padding: '.5rem 1.5rem 1.5rem'}} screen={true}>
				{
					!retrieve &&
					<CardTab
						disabled={retrieve}
						style={{marginBottom: '1rem'}}
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
										.then(() => {
											reset(prevState => {
												return {
													...prevState,
													// records: [],
													// customer: undefined as unknown as number,
													// currency: undefined as unknown as string,
													records: transformTransactions(transactions, watch('currency'))?.map(item => ({
														store_currency: item?.store_currency?.id,
														store_amount: '0',
														customer_amount: '0'
													})),
													first_amount: '0',
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
						{
							!retrieve &&
							<div className="flex gap-xl span-12">
								<Info title="Checkout" text={getBalanceAsString(storeBalance, t)}/>
								<Info title="Customer" text={getBalanceAsString(customerBalance, t)}/>
							</div>
						}

						<div className="flex gap-lg span-12">
							{/*<div className="flex-1">*/}
							{/*	<Controller*/}
							{/*		name="type"*/}
							{/*		control={control}*/}
							{/*		render={({field: {value, ref, onChange, onBlur}}) => (*/}
							{/*			<Select*/}
							{/*				ref={ref}*/}
							{/*				id="type"*/}
							{/*				label="Type"*/}
							{/*				isDisabled={true}*/}
							{/*				onBlur={onBlur}*/}
							{/*				options={exchangeOptions}*/}
							{/*				error={errors.type?.message}*/}
							{/*				value={getSelectValue(exchangeOptions, value)}*/}
							{/*				defaultValue={getSelectValue(exchangeOptions, value)}*/}
							{/*				handleOnChange={(e) => onChange(e as string)}*/}
							{/*			/>*/}
							{/*		)}*/}
							{/*	/>*/}
							{/*</div>*/}
							{/*{*/}
							{/*	expanse ?*/}
							{/*		<div className="flex-1">*/}
							{/*			<Controller*/}
							{/*				name="service_type"*/}
							{/*				control={control}*/}
							{/*				render={({field: {value, ref, onChange, onBlur}}) => (*/}
							{/*					<Select*/}
							{/*						ref={ref}*/}
							{/*						id="service_type"*/}
							{/*						label="Expense type"*/}
							{/*						options={serviceTypes}*/}
							{/*						onBlur={onBlur}*/}
							{/*						isDisabled={retrieve}*/}
							{/*						error={errors.service_type?.message}*/}
							{/*						value={getSelectValue(serviceTypes, value)}*/}
							{/*						defaultValue={getSelectValue(serviceTypes, value)}*/}
							{/*						handleOnChange={(e) => onChange(e as string)}*/}
							{/*					/>*/}
							{/*				)}*/}
							{/*			/>*/}
							{/*		</div> : null*/}
							{/*}*/}
							{/*<div className="flex-1">*/}
							{/*	<Controller*/}
							{/*		name="store"*/}
							{/*		control={control}*/}
							{/*		render={({field: {value, ref, onChange, onBlur}}) => (*/}
							{/*			<Select*/}
							{/*				ref={ref}*/}
							{/*				id="store"*/}
							{/*				label="Store"*/}
							{/*				options={stores}*/}
							{/*				onBlur={onBlur}*/}
							{/*				isDisabled={retrieve}*/}
							{/*				error={errors.store?.message}*/}
							{/*				value={getSelectValue(stores, value)}*/}
							{/*				defaultValue={getSelectValue(stores, value)}*/}
							{/*				handleOnChange={(e) => {*/}
							{/*					setValue('customer', undefined as unknown as number)*/}
							{/*					onChange(e as string)*/}
							{/*				}}*/}
							{/*			/>*/}
							{/*		)}*/}
							{/*	/>*/}
							{/*</div>*/}
							<div className="flex-1">
								<Controller
									name="customer"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="customer"
											label="Customer"
											redLabel={exchangeOptions[1].value == tab}
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
											redLabel={exchangeOptions[1].value == tab}
											placeholder=" "
											isDisabled={true}
											options={currencyOptions}
											error={errors.currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>


							<div className="flex-1">
								<Input
									id="total"
									label={`Total`}
									redLabel={exchangeOptions[1].value == tab}
									disabled={true}
									value={`${decimalToPrice(calculateTotalByRecords(watch('first_amount'), watch('records') as unknown as IRecord[]))} ${t(findName(currencyOptions, watch('currency'), 'code'))}`}
								/>
							</div>

							<div style={{flex: '2'}}>
								<Input
									id="comment"
									redLabel={exchangeOptions[1].value == tab}
									label={`Comment`}
									disabled={retrieve}
									error={errors?.description?.message}
									{...register(`description`)}
								/>
							</div>
							{/*<div className="flex-1">*/}
							{/*	<Controller*/}
							{/*		control={control}*/}
							{/*		name="total"*/}
							{/*		render={({field}) => (*/}
							{/*			<NumberFormattedInput*/}
							{/*				{...field}*/}
							{/*				onChange={(e) => {*/}
							{/*					setValue('first_amount', e)*/}
							{/*					setValue('records', watch('records')?.map(item => ({*/}
							{/*						store_currency: item?.store_currency,*/}
							{/*						store_amount: '0',*/}
							{/*						customer_amount: '0'*/}
							{/*					})) ?? [])*/}
							{/*					field.onChange(e)*/}
							{/*				}}*/}
							{/*				id="total"*/}
							{/*				maxLength={15}*/}
							{/*				disableGroupSeparators={false}*/}
							{/*				allowDecimals={true}*/}
							{/*				disabled={retrieve}*/}
							{/*				label={`${t('Total')}`}*/}
							{/*				error={errors?.total?.message}*/}
							{/*			/>*/}
							{/*		)}*/}
							{/*	/>*/}
							{/*</div>*/}
						</div>
						<div className="span-12 grid gap-2xl">
							{
								watch('currency') ?
									<div className="span-3">
										<Controller
											control={control}
											name="first_amount"
											render={({field}) => (
												<NumberFormattedInput
													{...field}
													// onChange={(e) => {
													// 	if ((Number(watch('total') || 0) - Number(e)) > 0) {
													// 		setValue(`records.0.customer_amount`, String(Number(watch('total') || 0) - Number(e)))
													// 		setValue(`records.0.store_amount`, convertCurrency(Number(watch('total') || 0) - Number(e), 'fromStore', watch(`records.0.store_currency`), transactions)?.toString())
													// 	} else {
													// 		setValue('records', watch('records')?.map(item => ({
													// 			store_currency: item?.store_currency,
													// 			store_amount: '0',
													// 			customer_amount: '0'
													// 		})) ?? [])
													// 		setValue('total', e)
													// 	}
													// 	field.onChange(e)
													// }}
													id="first_amount"
													redLabel={exchangeOptions[1].value == tab}
													maxLength={15}
													disableGroupSeparators={false}
													allowDecimals={true}
													disabled={retrieve}
													label={`${t(findName(currencyOptions, watch(`currency`)))} (${t('Checkout')})`}
													error={errors?.first_amount?.message}
												/>
											)}
										/>
									</div>
									// {
									// 	retrieve &&
									// 	<div className="flex-1">
									// 		<Input
									// 			id="all"
									// 			disabled={true}
									// 			placeholder=" "
									// 			label={`${t(findName(currencyOptions, watch(`currency`)))?.toLowerCase()} (${t('Checkout')})`}
									// 			value={decimalToPrice(detail?.amount || 0)}
									// 		/>
									// 	</div>
									// }
									: null
							}


							{
								(fields && fields.length && watch('currency')) ? fields?.map((field, index) => (
									<React.Fragment key={field.id}>
										<div className="flex gap-xs span-3">
											<div className="flex-1">
												<Controller
													control={control}
													name={`records.${index}.store_amount`}
													render={({field}) => (
														<NumberFormattedInput
															{...field}
															// onChange={event => {
															// 	const storeAmount = parseFloat(event || '0')
															// 	setValue(`records.${index}.customer_amount`, convertCurrency(storeAmount, 'toStore', watch(`records.${index}.store_currency`), transactions)?.toString()
															// 	)
															// 	field.onChange(event as string)
															// }}
															id={`records.${index}.store_amount`}
															maxLength={15}
															disableGroupSeparators={false}
															redLabel={exchangeOptions[1].value == tab}
															allowDecimals={true}
															disabled={retrieve}
															label={`${t(findName(currencyOptions, watch(`records.${index}.store_currency`)))} (${t('Checkout')?.toLowerCase()})`}
															error={errors?.records?.[index]?.store_amount?.message}
															onDoubleClick={() => handleDoubleClick(index, 'customer_amount')}
														/>
													)}
												/>
											</div>

											<div className="span-1 flex justify-center">
												<Exchange
													style={{
														transform: 'translateY(2.5rem)',
														height: '1.7rem',
														cursor: 'pointer'
													}}
													// onClick={() => handleDoubleClick(index, 'customer_amount')}
												/>
											</div>

											<div className="flex-1">
												<Controller
													control={control}
													name={`records.${index}.customer_amount`}
													render={({field}) => (
														<NumberFormattedInput
															{...field}
															// onChange={(e) => {
															// 	if (index === 0 && (watch('records')?.length || 0) - 1 > index) {
															// 		if ((Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(e))) > 0) {
															// 			setValue(`records.1.customer_amount`, String(Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(e))))
															// 			setValue(`records.1.store_amount`, convertCurrency(Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(e)), 'fromStore', watch(`records.1.store_currency`), transactions)?.toString())
															// 			// setValue('total', String(Number(watch('first_amount') || 0) + Number(e)))
															// 		} else {
															// 			setValue(`records.1.customer_amount`, '0')
															// 			setValue(`records.2.customer_amount`, '0')
															// 			setValue(`records.1.store_amount`, '0')
															// 			setValue(`records.2.store_amount`, '0')
															// 			setValue('total', String(Number(watch('first_amount') || 0) + Number(e)))
															// 		}
															// 	} else if (index === 1 && (watch('records')?.length || 0) - 1 > index) {
															// 		if ((Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(e))) > 0) {
															// 			setValue(`records.2.customer_amount`, String(Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(e))))
															// 			setValue(`records.2.store_amount`, convertCurrency(Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(e)), 'fromStore', watch(`records.2.store_currency`), transactions)?.toString())
															// 		} else {
															// 			setValue(`records.2.customer_amount`, '0')
															// 			setValue(`records.2.store_amount`, '0')
															// 			setValue('total', String(Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(e)))
															// 		}
															// 	} else if (index === 2 && (watch('records')?.length || 0) - 1 >= index) {
															// 		if (!((Number(watch('total') || 0) - (Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(watch(`records.1.customer_amount`) || 0) + Number(e))) > 0)) {
															// 			setValue('total', String(Number(watch('first_amount') || 0) + Number(watch(`records.0.customer_amount`) || 0) + Number(watch(`records.1.customer_amount`) || 0) + Number(e)))
															// 		}
															// 	}
															// 	field.onChange(e)
															// }}
															id={`records.${index}.customer_amount`}
															maxLength={15}
															disableGroupSeparators={false}
															redLabel={exchangeOptions[1].value == tab}
															allowDecimals={true}
															disabled={retrieve}
															label={`${t(findName(currencyOptions, watch(`currency`)))} (${t('Customer')?.toLowerCase()})`}
															error={errors?.records?.[index]?.customer_amount?.message}
															onDoubleClick={() => handleDoubleClick(index, 'store_amount')}
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

						!retrieve && tab == exchangeOptions[1].value ?
							<Button
								style={{marginTop: 'auto'}}
								type={FIELD.SUBMIT}
								theme={BUTTON_THEME.ALERT_DANGER}
								disabled={isAdding || isLoading}
							>
								{t(findName(currencyExchangeOptions, String(tab)))}
							</Button> : !retrieve ?
								<Button
									style={{marginTop: 'auto'}}
									type={FIELD.SUBMIT}
									theme={BUTTON_THEME.PRIMARY}
									disabled={isAdding || isLoading}
								>
									{t(findName(currencyExchangeOptions, String(tab)))}
								</Button> : null
					}
				</Form>
			</Card>
		</>
	)
}

export default Index