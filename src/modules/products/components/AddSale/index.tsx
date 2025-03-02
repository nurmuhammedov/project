import {yupResolver} from '@hookform/resolvers/yup'
import {
	Button,
	// MaskInput,
	Form,
	Select,
	NumberFormattedInput,
	Loader,
	HR
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {
	useAdd,
	useData,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import {FC, useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {cleanParams, decimalToInteger, decimalToNumber, decimalToPrice, getSelectValue} from 'utilities/common'
import {ISerialNumber, IValidationData, TemporaryListItem} from 'interfaces/products.interface'
import {ISelectOption} from 'interfaces/form.interface'
// import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {showMessage} from 'utilities/alert'
import styles from './styles.module.scss'
import {ISearchParams} from 'interfaces/params.interface'
import {temporarySaleItemSchema} from 'helpers/yup'
import {seriesOptions} from 'helpers/options'
import {getSelectOptions, getSelectOptionsByKey} from 'utilities/select'
import {IIDName} from 'interfaces/configuration.interface'


interface IProperties {
	clientId?: number | string
	store?: number | string
	refetchTemporaryList?: () => void
	detail?: boolean
}

const Index: FC<IProperties> = ({clientId, refetchTemporaryList, detail: retrieve = false, store = undefined}) => {
	const {t} = useTranslation()
	const {
		addParams,
		removeParams,
		paramsObject: {updateId = undefined, type = 'all'}
	} = useSearchParams()

	const {data: types = []} = useData<ISelectOption[]>('product-types/select', !retrieve)
	const {data: stores = []} = useData<IIDName[]>('stores/select/')
	const {data: products = []} = useData<ISelectOption[]>('products/select', true, {
		type: type === 'all' ? undefined : type
	})

	const {
		handleSubmit,
		watch,
		reset,
		// register,
		control,
		setValue,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			price: '',
			package_quantity: '',
			unit_quantity: '',
			is_booked: false,
			is_paid: false,
			store: store ? Number(store) : undefined,
			serial_numbers: [],
			product: undefined
			// expiry_date: ''
		},
		resolver: yupResolver(temporarySaleItemSchema)
	})


	const {mutateAsync, isPending: isAdding} = useAdd('sale-temporary/create')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('sale-temporary/update/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<TemporaryListItem>(retrieve ? 'sale-items/detail/' : 'sale-temporary/detail/', updateId)

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'))

	const {data: series = []} = useData<ISearchParams[]>(`products/free-serial/select/${watch('product')}`, !!watch('product') && !!watch('store') && !!validationData?.is_serial, {store: watch('store')})

	useEffect(() => {
		if (detail && !isDetailLoading) {
			const serial_number = detail.serial_numbers as unknown as ISerialNumber[]
			reset({
				product: detail.product?.id,
				// expiry_date: detail?.expiry_date ? getDate(detail.expiry_date) : getDate(),
				price: detail.price,
				serial_numbers: serial_number?.map(i => i.id) || [],
				unit_quantity: detail?.product?.is_serial ? detail.serial_numbers?.length?.toString() || '0' : detail.product?.measure?.value_type == 'int' ? decimalToNumber(detail.unit_quantity) : detail.unit_quantity,
				package_quantity: detail.package_quantity?.toString() || '0',
				is_booked: detail?.is_booked ?? false,
				is_paid: detail?.is_paid ?? false,
				store: detail?.store?.id ?? undefined
			})
		}
	}, [detail])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				package_quantity: validationData?.package ? '' : '0',
				unit_quantity: validationData?.is_serial ? '0' : '',
				serial_numbers: [],
				// expiry_date: validationData?.expiry ? '' : getDate(),
				is_booked: false,
				store: store ? Number(store) : 0,
				is_paid: false
			}))
		}
	}, [validationData])


	useEffect(() => {
		if (!updateId) {
			reset({
				price: '',
				package_quantity: '',
				unit_quantity: '',
				serial_numbers: [],
				product: undefined,
				// expiry_date: '',
				is_booked: false,
				is_paid: false,
				store: undefined
			})
		}
	}, [type, updateId])


	return (
		<>
			<div className={styles.title}>
				{t('Add product')}
			</div>

			<HR style={{margin: '1.5rem 0'}}/>

			<Form
				onSubmit={handleSubmit((data) => {
						if (!clientId) {
							showMessage('Client ID required')
						} else if (updateId) {
							const newData = {
								product: data?.product,
								// expiry_date: validationData?.expiry ? data?.expiry_date : null,
								price: data?.price,
								serial_numbers: validationData?.is_serial ? data?.serial_numbers : null,
								unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
								package_quantity: validationData?.package ? data?.package_quantity : null,
								store: data?.store ?? null,
								is_booked: data?.is_booked,
								is_paid: data?.is_paid,
								customer: clientId
							}
							update(cleanParams(newData as ISearchParams)).then(async () => {
								removeParams('updateId', 'type')
								reset({
									price: '',
									package_quantity: '',
									unit_quantity: '',
									serial_numbers: [],
									product: undefined,
									// expiry_date: '',
									is_booked: false,
									is_paid: false,
									store: undefined
								})
								refetchTemporaryList?.()
							})
						} else {
							const newData = {
								product: data?.product,
								// expiry_date: validationData?.expiry ? data?.expiry_date : null,
								price: data?.price,
								serial_numbers: validationData?.is_serial ? data?.serial_numbers : null,
								unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
								package_quantity: validationData?.package ? data?.package_quantity : null,
								store: data?.store ?? null,
								is_booked: data?.is_booked,
								is_paid: data?.is_paid,
								customer: clientId
							}
							mutateAsync(cleanParams(newData as ISearchParams)).then(async () => {
								reset({
									price: '',
									package_quantity: '',
									unit_quantity: '',
									serial_numbers: [],
									product: undefined,
									// expiry_date: '',
									is_booked: false,
									is_paid: false,
									store: undefined
								})
								refetchTemporaryList?.()
							})
						}
					}
				)}
			>
				<div className="grid gap-lg">
					<div className="span-12">
						<Select
							id="types"
							label="Product type"
							isDisabled={!!updateId || retrieve}
							options={[{value: 'all', label: 'All'}, ...types]}
							value={getSelectValue([{value: 'all', label: 'All'}, ...types], type)}
							defaultValue={getSelectValue([{value: 'all', label: 'All'}, ...types], type)}
							handleOnChange={(e) => addParams({type: e?.toString()})}
						/>
					</div>

					<div className="span-12">
						<Controller
							name="product"
							control={control}
							render={({field: {value, ref, onChange, onBlur}}) => (
								<Select
									ref={ref}
									id="product"
									label="Product"
									onBlur={onBlur}
									options={products}
									isDisabled={!!updateId || retrieve}
									error={errors.product?.message}
									value={getSelectValue(products, value)}
									defaultValue={getSelectValue(products, value)}
									handleOnChange={(e) => onChange(e as string)}
								/>
							)}
						/>
					</div>

					{
						(isValidationDataFetching) ?
							<Loader/> : validationData ?
								<>
									<div className="span-12">
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

									{/*{*/}
									{/*	validationData.expiry &&*/}
									{/*	<div className="span-12">*/}
									{/*		<Controller*/}
									{/*			name="expiry_date"*/}
									{/*			control={control}*/}
									{/*			render={({field}) => (*/}
									{/*				<MaskInput*/}
									{/*					id="expiry_date"*/}
									{/*					label="Expiry date"*/}
									{/*					disabled={retrieve}*/}
									{/*					placeholder={getDate()}*/}
									{/*					mask="99.99.9999"*/}
									{/*					error={errors?.expiry_date?.message}*/}
									{/*					{...field}*/}
									{/*				/>*/}
									{/*			)}*/}
									{/*		/>*/}
									{/*	</div>*/}
									{/*}*/}

									{
										validationData.package &&
										<div className="span-12">
											<Controller
												control={control}
												name="package_quantity"
												render={({field}) => (
													<NumberFormattedInput
														id="package_quantity"
														maxLength={validationData.package?.measure?.value_type == 'int' ? 5 : 8}
														disabled={retrieve}
														disableGroupSeparators={false}
														allowDecimals={validationData.package?.measure?.value_type == 'float'}
														label={`${t('Package quantity')} (${t('item per package', {
															count: validationData?.package?.measure?.value_type == 'int' ? decimalToInteger(validationData?.package?.quantity || 0) as unknown as number : decimalToPrice(validationData?.package?.quantity) as unknown as number,
															measure: validationData?.package?.measure?.name ?? ''
														})})`}
														error={errors?.package_quantity?.message}
														{...field}
													/>
												)}
											/>
										</div>
									}

									<div className="span-6">
										<Controller
											control={control}
											name="unit_quantity"
											render={({field}) => (
												<NumberFormattedInput
													id="unit_quantity"
													disableGroupSeparators={false}
													maxLength={validationData?.measure?.value_type == 'int' ? 6 : 9}
													disabled={validationData.is_serial || retrieve}
													allowDecimals={validationData?.measure?.value_type == 'float'}
													label={validationData?.measure?.value_type == 'int' ? t('Count') + ' ' + `(${validationData?.measure.name})` : t('Quantity') + ' ' + `(${validationData?.measure.name})`}
													error={errors?.unit_quantity?.message}
													{...field}
												/>
											)}
										/>
									</div>

									<div className="span-6">
										<Controller
											control={control}
											name="price"
											render={({field}) => (
												<NumberFormattedInput
													id="price"
													maxLength={12}
													disableGroupSeparators={false}
													allowDecimals={true}
													disabled={retrieve}
													label="Price"
													error={errors?.price?.message}
													{...field}
												/>
											)}
										/>
									</div>

									{
										validationData.is_serial &&
										<>
											<div className="span-12">
												<Controller
													name="serial_numbers"
													control={control}
													render={({field: {value, ref, onChange, onBlur}}) => (
														<Select
															ref={ref}
															id="serial_numbers"
															label="Series"
															onBlur={onBlur}
															options={getSelectOptionsByKey(series, 'serial')}
															isMulti={true}
															isDisabled={retrieve}
															error={errors.serial_numbers?.message}
															value={getSelectValue(getSelectOptionsByKey(series, 'serial'), value)}
															defaultValue={getSelectValue(getSelectOptionsByKey(series, 'serial'), value)}
															handleOnChange={(e) => {
																const value = e as string[]
																setValue('unit_quantity', String(value?.length || '0'))
																onChange(value as string[])
															}}
														/>
													)}
												/>
											</div>
										</>
									}

									<Controller
										name="is_booked"
										control={control}
										render={({field: {value, ref, onChange, onBlur}}) => (
											<Select
												ref={ref}
												top={true}
												id="is_booked"
												label="Is booked?"
												onBlur={onBlur}
												error={errors.is_booked?.message}
												options={seriesOptions}
												value={getSelectValue(seriesOptions, value)}
												defaultValue={getSelectValue(seriesOptions, value)}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)}
									/>

									<Controller
										name="is_paid"
										control={control}
										render={({field: {value, ref, onChange, onBlur}}) => (
											<Select
												ref={ref}
												top={true}
												id="is_paid"
												label="Is paid?"
												onBlur={onBlur}
												error={errors.is_paid?.message}
												options={seriesOptions}
												value={getSelectValue(seriesOptions, value)}
												defaultValue={getSelectValue(seriesOptions, value)}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)}
									/>

								</> :
								null
					}
				</div>

				{
					!retrieve &&
					<Button
						type={FIELD.SUBMIT}
						disabled={isAdding || isUpdating || retrieve || isValidationDataLoading || isValidationDataFetching || !validationData || (validationData?.is_serial && !watch('serial_numbers')?.length)}
					>
						{updateId ? 'Edit' : 'Save'}
					</Button>
				}

				{
					updateId &&
					<Button
						theme={BUTTON_THEME.DANGER}
						type={FIELD.BUTTON}
						onClick={() => {
							removeParams('updateId', 'type')
							reset({
								price: '',
								package_quantity: '',
								unit_quantity: '',
								serial_numbers: [],
								product: undefined,
								// expiry_date: '',
								is_booked: false,
								is_paid: false,
								store: undefined
							})
						}}
					>
						Cancel
					</Button>
				}
			</Form>
		</>
	)
}

export default Index