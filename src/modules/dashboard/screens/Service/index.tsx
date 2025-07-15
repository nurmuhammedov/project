import {yupResolver} from '@hookform/resolvers/yup'
import {Exchange} from 'assets/icons'
import {Button, Card, Form, Info, Input, Loader, MaskInput, NumberFormattedInput, PageTitle, Select} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {currencyOptions} from 'constants/options'
import {useAdd, useData, useDetail} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {expenseTransactionSchemaNoCustomer} from 'modules/dashboard/helpers/yup'
import {IBalance, IRecord, ITransaction, ITransactionDetail} from 'modules/dashboard/interfaces'
import {calculateTotalByRecords} from 'modules/dashboard/utilities/Exchange'
import React, {FC, useEffect, useState} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {convertCurrency, decimalToPrice, findName, getBalanceAsString, getSelectValue, noop} from 'utilities/common'
import {transformTransactions} from 'utilities/currency'
import {getDate} from 'utilities/date'


interface IProperties {
	detail?: boolean
}

const ExpenseTransaction: FC<IProperties> = ({detail: retrieve = false}) => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	const [isLoading, setIsLoading] = useState(false)
	const {exchangeId = undefined} = useParams()
	const {store} = useTypedSelector(state => state.stores)

	const {
		data: serviceTypes = []
	} = useData<ISelectOption[]>('service-types/select')

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			store: store?.value ? Number(store?.value) : undefined,
			records: [],
			currency: undefined,
			service_type: undefined,
			first_amount: '0',
			type: 3 as const,
			description: '',
			date: getDate()
		},
		resolver: yupResolver(expenseTransactionSchemaNoCustomer)
	})

	const {fields} = useFieldArray({
		control,
		name: 'records' as never
	})

	const {
		data: storeBalance = [],
		refetch: storeBalanceRefetch
	} = useData<IBalance[]>(`stores/${watch('store')}/balance`, !!watch('store') && !retrieve)


	const {
		data: transactions = [],
		refetch: transactionsRefetch
	} = useData<ITransaction[]>(`exchange-rates/transaction`, !!watch('currency') && !retrieve, {currency: watch('currency')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITransactionDetail>(`transactions/`, exchangeId, !!exchangeId && retrieve)

	const {mutateAsync: addTransaction, isPending: isAdding} = useAdd(`transactions`)

	useEffect(() => {
		reset({
			store: store?.value ? Number(store?.value) : undefined,
			records: [],
			currency: undefined,
			service_type: undefined,
			first_amount: '0',
			type: 3 as const,
			description: '',
			date: getDate()
		})
	}, [store?.value])


	useEffect(() => {
		if (watch('currency') && !retrieve) {
			setValue('records', transformTransactions(transactions, watch('currency'))?.map(item => ({
				store_currency: item?.store_currency?.id,
				store_amount: '0',
				customer_amount: '0'
			})))
		}
	}, [transactions, retrieve, watch, setValue])

	useEffect(() => {
		if (detail && retrieve) {
			reset({
				store: detail?.store?.id,
				service_type: detail?.service_type?.id?.toString(),
				records: detail?.records?.filter(item => item?.store_currency !== item?.customer_currency)?.map(item => ({
					store_currency: item?.store_currency,
					store_amount: Math.abs(Number(item?.store_amount || 0)).toString(),
					customer_amount: Math.abs(Number(item?.customer_amount || 0)).toString()
				})),
				currency: detail?.currency,
				first_amount: Math.abs(Number(detail?.records?.find(item => item?.store_currency === item?.customer_currency)?.customer_amount || 0)).toString(),
				type: 3 as const,
				description: detail?.description,
				date: detail?.date ? getDate(detail.date) : new Date().toISOString().split('T')[0]
			})
		}
	}, [detail, retrieve, reset])


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

	if (isDetailLoading && retrieve) {
		return (<Loader/>)
	}

	return (
		<>
			<PageTitle
				title={t('Expense')}
			>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						{t('Back')}
					</Button>
				</div>
			</PageTitle>
			<Card style={{padding: '.5rem 1.5rem 1.5rem'}} screen={true}>
				<Form
					onSubmit={
						handleSubmit((data) => {
							setIsLoading(true)
							const payload = {
								store: data.store as number,
								records: data.records,
								currency: data.currency as string,
								service_type: data.service_type as string,
								first_amount: data.first_amount,
								type: 3,
								date: data.date,
								description: data.description || ''
							}
							addTransaction(payload)
								.then(() => {
									transactionsRefetch()
										.then(() => {
											reset(prevState => {
												return {
													...prevState,
													records: transformTransactions(transactions, watch('currency'))?.map(item => ({
														store_currency: item?.store_currency?.id,
														store_amount: '0',
														customer_amount: '0'
													})),
													first_amount: '0',
													description: '',
													date: getDate()
												}
											})
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
							<div className="flex gap-xl span-12" style={{marginTop: '1rem'}}>
								<Info title={t('Checkout')} text={getBalanceAsString(storeBalance, t)}/>
							</div>
						}

						<div className="flex gap-lg span-12" style={retrieve ? {marginTop: '1rem'} : {}}>
							<div className="flex-2">
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
							</div>
							<div className="flex-2">
								<Controller
									name="currency"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="currency"
											label={t('Currency')}
											onBlur={onBlur}
											isDisabled={retrieve}
											options={currencyOptions}
											error={errors.currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
							<div className="flex-2">
								<Input
									id="total"
									label={`${t('Total')} (${t('Expense')?.toLowerCase()})`}
									disabled={true}
									value={`${decimalToPrice(calculateTotalByRecords(watch('first_amount'), watch('records') as unknown as IRecord[]))} ${t(findName(currencyOptions, watch('currency'), 'code'))}`}
								/>
							</div>
							<div className="flex-3">
								<Input
									id="description"
									label={t('Comment')}
									disabled={retrieve}
									error={errors?.description?.message}
									{...register(`description`)}
								/>
							</div>
							<div className="flex-1">
								<Controller
									name="date"
									control={control}
									render={({field}) => (
										<MaskInput
											id="date"
											label="Date"
											placeholder={getDate()}
											mask="99.99.9999"
											disabled={retrieve}
											error={errors?.date?.message}
											{...field}
										/>
									)}
								/>
							</div>
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
													id="first_amount"
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
															id={`records.${index}.store_amount`}
															maxLength={15}
															disableGroupSeparators={false}
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
												/>
											</div>

											<div className="flex-1">
												<Controller
													control={control}
													name={`records.${index}.customer_amount`}
													render={({field}) => (
														<NumberFormattedInput
															{...field}
															id={`records.${index}.customer_amount`}
															maxLength={15}
															disableGroupSeparators={false}
															allowDecimals={true}
															disabled={retrieve}
															label={`${t(findName(currencyOptions, watch(`currency`)))} (${t('Expense')?.toLowerCase()})`}
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
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.SUBMIT}
							theme={BUTTON_THEME.ALERT_DANGER}
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

export default ExpenseTransaction