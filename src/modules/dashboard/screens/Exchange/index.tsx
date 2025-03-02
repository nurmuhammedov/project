import {currencyExchangeOptions} from 'helpers/options'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {
	Button,
	Card,
	CardTab,
	Form,
	MaskInput,
	NumberFormattedInput,
	Select,
	Title
} from 'components'
import React, {FC, useEffect} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {getSelectOptions, getSelectOptionsByKey} from 'utilities/select'
import {getSelectValue} from 'utilities/common'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {currencyExchangeSchema} from 'helpers/yup'
import {ISearchParams} from 'interfaces/params.interface'
import {useParams} from 'react-router-dom'
import {IClientItemDetail} from 'interfaces/clients.interface'
import {IIDName} from 'interfaces/configuration.interface'
import {Plus} from 'assets/icons'
import {ICurrencyExchangeDetail} from 'interfaces/dashboard.interface'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {paramsObject: {tab = currencyExchangeOptions[0]?.value}} = useSearchParams()
	const {productId: currencyId = undefined, id: clientId = undefined} = useParams()
	const {data: clients = []} = useData<ISearchParams[]>('customer/select/')

	const {
		watch,
		reset,
		control,
		// register,
		// setValue,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			customer: clientId ? Number(clientId) : undefined,
			date: '',
			payment: [
				{
					currency: undefined,
					amount: ''
				}
			],
			store: undefined
		},
		resolver: yupResolver(currencyExchangeSchema)
	})

	const {fields, append, remove} = useFieldArray({
		control,
		name: 'payment' as never
	})

	const canAddField = fields.every(field => !!watch(`payment.${fields.indexOf(field)}.currency`) && !!watch(`payment.${fields.indexOf(field)}.amount`))

	const handleRemove = (index: number) => {
		if (fields.length > 1 && !retrieve) {
			remove(index)
		}
	}

	const {data: currencies = []} = useData<IIDName[]>('currency/select/', !!watch('customer'))
	const {data: stores = []} = useData<IIDName[]>('stores/select/', !!watch('customer'))
	const {mutateAsync, isPending: isAdding} = useAdd(`currency/exchange/${watch('customer')}/create/`)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IClientItemDetail>('customer/detail/', watch('customer'), !!watch('customer') && !retrieve)

	const {
		data,
		isPending
	} = useDetail<ICurrencyExchangeDetail>(`currency/exchange/detail/`, currencyId, !!currencyId && retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset((prevValues) => ({
				...prevValues,
				store: detail?.store?.id ?? undefined,
				// customer: Number(clientId),
				date: getDate() ?? ''
			}))
		}
	}, [detail])


	useEffect(() => {
		if (data && !isPending) {
			reset({
				customer: data?.customer?.id ?? undefined,
				date: getDate(data?.date || ''),
				payment: data?.payment?.map(i => ({currency: i?.currency?.id, amount: i?.amount ?? '0'})),
				store: data?.store?.id ?? undefined
			})
		}
	}, [data])

	return (
		<>
			<Title title="Currency exchange"/>
			<Card shadow={true} style={{padding: '2.25rem', maxWidth: '100rem', width: '100%', margin: '.5rem auto'}}>
				<CardTab
					disabled={retrieve}
					style={{marginBottom: '1.5rem'}}
					fallbackValue={currencyExchangeOptions[0]?.value}
					tabs={currencyExchangeOptions}
				/>

				<Form
					onSubmit={
						handleSubmit((data) => {
							mutateAsync({
								...data,
								type: tab == 'income' ? 'kirim' : tab == 'loss' ? 'chiqim' : tab == 'expense' ? 'xarajat' : null
							}).then(() => reset({
								customer: undefined,
								date: '',
								payment: [
									{
										currency: undefined,
										amount: ''
									}
								],
								store: undefined
							}))
						})
					}
				>
					<div className="grid gap-lg">
						<div className="span-4">
							<Controller
								name="customer"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										isDisabled={!!currencyId || retrieve || !!clientId}
										id="customer"
										label="Client"
										onBlur={onBlur}
										options={getSelectOptionsByKey(clients, 'full_name')}
										error={errors.customer?.message}
										value={getSelectValue(getSelectOptionsByKey(clients, 'full_name'), value)}
										defaultValue={getSelectValue(getSelectOptionsByKey(clients, 'full_name'), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-4">
							<Controller
								name="store"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="store"
										label="Store"
										options={getSelectOptions(stores)}
										onBlur={onBlur}
										isDisabled={retrieve}
										error={errors.store?.message}
										value={getSelectValue(getSelectOptions(stores), value)}
										defaultValue={getSelectValue(getSelectOptions(stores), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-4">
							<Controller
								name="date"
								control={control}
								render={({field}) => (
									<MaskInput
										id="date"
										disabled={retrieve}
										label="Date"
										placeholder={getDate()}
										mask="99.99.9999"
										error={errors?.date?.message}
										{...field}
									/>
								)}
							/>
						</div>

						{
							fields?.map((field, index) => (
								<React.Fragment key={field.id}>
									<div className="span-6">
										<Controller
											name={`payment.${index}.currency`}
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													top={true}
													id={`payment.${index}.currency`}
													label="Currency"
													options={getSelectOptions(currencies)}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors?.payment?.[index]?.currency?.message}
													value={getSelectValue(getSelectOptions(currencies), value)}
													defaultValue={getSelectValue(getSelectOptions(currencies), value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>

									<div className="span-6">
										<Controller
											control={control}
											name={`payment.${index}.amount`}
											render={({field}) => (
												<NumberFormattedInput
													id={`payment.${index}.amount`}
													maxLength={12}
													disableGroupSeparators={false}
													allowDecimals={true}
													disabled={retrieve}
													handleDelete={retrieve ? undefined : () => handleRemove(index)}
													label="Amount"
													error={errors?.payment?.[index]?.amount?.message}
													{...field}
												/>
											)}
										/>
									</div>
								</React.Fragment>
							))
						}

						{
							!retrieve && (
								<div className="span-4">
									<Button
										theme={BUTTON_THEME.OUTLINE}
										type="button"
										disabled={!canAddField || retrieve}
										icon={<Plus/>}
										onClick={() => append({currency: undefined, amount: ''})}
									>
										Add
									</Button>
								</div>
							)
						}


					</div>
					{
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.SUBMIT}
							disabled={isAdding}
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