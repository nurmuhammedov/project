import {yupResolver} from '@hookform/resolvers/yup'
import {
	Button,
	Form,
	Select,
	NumberFormattedInput,
	Loader, FileUploader
} from 'components'
import {FIELD} from 'constants/fields'
import {
	useAdd,
	useData,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import {measurementUnits} from 'modules/database/helpers/options'
import {temporarySaleItemSchema} from 'modules/products/helpers/yup'
import {ITemporaryListItem, IValidationData} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {cleanParams, decimalToNumber, getSelectValue} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {showMessage} from 'utilities/alert'
import {ISearchParams} from 'interfaces/params.interface'
import {getSelectOptionsByKey} from 'utilities/select'


interface IProperties {
	clientId?: number | string
	refetchTemporaryList?: () => void
}

const Index: FC<IProperties> = ({clientId, refetchTemporaryList}) => {
	const {t} = useTranslation()
	const {data: stores = []} = useData<ISelectOption[]>('stores/select')
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()

	const {data: products = []} = useData<ISelectOption[]>('products/select')

	const {
		handleSubmit,
		watch,
		reset,
		control,
		setValue,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			price: '',
			unit_quantity: '',
			serial_numbers: [],
			product: undefined,
			store: undefined
		},
		resolver: yupResolver(temporarySaleItemSchema)
	})


	const {mutateAsync, isPending: isAdding} = useAdd('sale-temporary/create')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('sale-temporary/update/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>('sale-temporary/detail/', updateId)

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'))

	const {data: series = []} = useData<ISearchParams[]>(`products/free-serial/select/${watch('product')}`, !!watch('product') && !!watch('store') && !!validationData?.is_serial, {store: watch('store')})

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset({
				product: detail.product.id,
				// expiry_date: detail.expiry_date ? getDate(detail.expiry_date) : getDate(),
				price: detail.price,
				store: detail?.store?.id ?? undefined,
				serial_numbers: detail.serial_numbers || [],
				unit_quantity: detail?.product?.is_serial ? detail.serial_numbers?.length?.toString() || '0' : measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int' ? decimalToNumber(detail.unit_quantity) : detail.unit_quantity
			})
		}
	}, [detail])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				unit_quantity: validationData?.is_serial ? '0' : '',
				serial_numbers: [],
				expiry_date: validationData?.expiry ? '' : getDate()
			}))
		}
	}, [validationData])


	useEffect(() => {
		if (!updateId) {
			reset({
				price: '',
				unit_quantity: '',
				serial_numbers: [],
				product: undefined,
				store: undefined
			})
		}
	}, [updateId])

	console.log(errors)

	return (
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
							store: data?.store ?? null,
							unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
							customer: clientId
						}
						update(cleanParams(newData as ISearchParams)).then(async () => {
							removeParams('updateId', 'modal')
							reset({
								price: '',
								unit_quantity: '',
								serial_numbers: [],
								product: undefined,
								store: undefined
								// expiry_date: ''
							})
							refetchTemporaryList?.()
						})
					} else {
						const newData = {
							product: data?.product,
							// expiry_date: validationData?.expiry ? data?.expiry_date : null,
							price: data?.price,
							store: data?.store ?? null,
							serial_numbers: validationData?.is_serial ? data?.serial_numbers : null,
							unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
							customer: clientId
						}
						mutateAsync(cleanParams(newData as ISearchParams)).then(async () => {
							reset({
								price: '',
								unit_quantity: '',
								serial_numbers: [],
								product: undefined,
								store: undefined
								// expiry_date: ''
							})
							removeParams('modal')
							refetchTemporaryList?.()
						})
					}
				}
			)}
		>
			<div className="grid gap-lg">
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
								isDisabled={!!updateId}
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
								<div className="span-12 flex gap-lg">
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
													error={errors.store?.message}
													value={getSelectValue(stores, value)}
													defaultValue={getSelectValue(stores, value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>

									<div className="flex-1">
										<Controller
											control={control}
											name="unit_quantity"
											render={({field}) => (
												<NumberFormattedInput
													id="unit_quantity"
													maxLength={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? 6 : 9}
													disableGroupSeparators={false}
													disabled={validationData.is_serial}
													allowDecimals={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'float'}
													label={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? t('Count') + ' ' + `(${t(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})` : t('Quantity') + ' ' + `(${(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})`}
													error={errors?.unit_quantity?.message}
													{...field}
												/>
											)}
										/>
									</div>

									<div className="flex-1">
										<Controller
											control={control}
											name="price"
											render={({field}) => (
												<NumberFormattedInput
													id="price"
													maxLength={12}
													disableGroupSeparators={false}
													allowDecimals={true}
													label="Price"
													error={errors?.price?.message}
													{...field}
												/>
											)}
										/>
									</div>
								</div>

								{
									validationData.is_serial &&
									<>
										<div className="grip span-12 gap-lg">
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
										<div className="span-12 flex gap-lg">
											<FileUploader
												type="txt"
												handleOnChange={(arr) => setValue('serial_numbers', Array.isArray(arr) ? Array.from(new Set([...(watch('serial_numbers') || []), ...(arr?.filter(item => series?.map(i => i?.serial).includes(item)) || [])])) : [])}
												value={undefined}
												id="series"
											/>
										</div>
									</>
								}
							</> :
							null
				}
			</div>

			<Button
				type={FIELD.SUBMIT}
				style={{marginTop: 'auto'}}
				disabled={isAdding || isUpdating || isValidationDataLoading || isValidationDataFetching || !validationData || (validationData?.is_serial && !watch('serial_numbers')?.length)}
			>
				{updateId ? 'Edit' : 'Save'}
			</Button>
		</Form>
	)
}

export default Index