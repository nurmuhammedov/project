import {yupResolver} from '@hookform/resolvers/yup'
import {
	Button,
	Input,
	MaskInput,
	FileUploader,
	Form,
	Select,
	NumberFormattedInput,
	Loader
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {
	useAdd,
	useData,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import {measurementUnits} from 'modules/database/helpers/options'
import {temporaryItemSchema} from 'modules/products/helpers/yup'
import {ITemporaryListItem, IValidationData} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {cleanParams, decimalToNumber, getSelectValue} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {getDate} from 'utilities/date'
import {Plus} from 'assets/icons'
import {useTranslation} from 'react-i18next'
import {showMessage} from 'utilities/alert'
import {ISearchParams} from 'interfaces/params.interface'


interface IProperties {
	clientId?: number | string
	refetchTemporaryList?: () => void
}

const Index: FC<IProperties> = ({clientId, refetchTemporaryList}) => {
	const {t} = useTranslation()
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()

	const {data: products = []} = useData<ISelectOption[]>('products/select')

	const {
		handleSubmit,
		watch,
		reset,
		register,
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
			expiry_date: ''
		},
		resolver: yupResolver(temporaryItemSchema)
	})


	const {mutateAsync, isPending: isAdding} = useAdd('temporary/create')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('temporary/update/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>('temporary/detail/', updateId)

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'))

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset({
				product: detail.product.id,
				expiry_date: detail.expiry_date ? getDate(detail.expiry_date) : getDate(),
				price: detail.price,
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
				expiry_date: ''
			})
		}
	}, [updateId])


	const {fields, append, remove} = useFieldArray({
		control,
		name: 'serial_numbers' as never
	})

	return (
		<Form
			onSubmit={handleSubmit((data) => {
					if (!clientId) {
						showMessage('Client ID required')
					} else if (updateId) {
						const newData = {
							product: data?.product,
							expiry_date: validationData?.expiry ? data?.expiry_date : null,
							price: data?.price,
							serial_numbers: validationData?.is_serial ? data?.serial_numbers : null,
							unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
							supplier: clientId
						}
						update(cleanParams(newData as ISearchParams)).then(async () => {
							removeParams('updateId', 'modal')
							reset({
								price: '',
								unit_quantity: '',
								serial_numbers: [],
								product: undefined,
								expiry_date: ''
							})
							refetchTemporaryList?.()
						})
					} else {
						const newData = {
							product: data?.product,
							expiry_date: validationData?.expiry ? data?.expiry_date : null,
							price: data?.price,
							serial_numbers: validationData?.is_serial ? data?.serial_numbers : null,
							unit_quantity: validationData?.is_serial ? null : data?.unit_quantity,
							supplier: clientId
						}
						mutateAsync(cleanParams(newData as ISearchParams)).then(async () => {
							reset({
								price: '',
								unit_quantity: '',
								serial_numbers: [],
								product: undefined,
								expiry_date: ''
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

									{
										validationData.expiry &&
										<div className="flex-1">
											<Controller
												name="expiry_date"
												control={control}
												render={({field}) => (
													<MaskInput
														id="expiry_date"
														label="Expiry date"
														placeholder={getDate()}
														mask="99.99.9999"
														error={errors?.expiry_date?.message}
														{...field}
													/>
												)}
											/>
										</div>
									}
								</div>

								{
									validationData.is_serial &&
									<>
										<div className="grid span-12 gap-lg">
											{
												fields?.map((field, index) => (
													<div className="span-6" key={field.id}>
														<Input
															id={`serial_numbers.${index}`}
															label={t('Product serial number', {index: index + 1})}
															handleDelete={() => {
																setValue('unit_quantity', String(fields?.length - 1))
																remove(index)
															}}
															error={errors.serial_numbers?.[index]?.message}
															{...register(`serial_numbers.${index}`)}
														/>
													</div>
												))
											}
										</div>
										<div className="span-12 flex gap-lg">
											<Button
												theme={BUTTON_THEME.OUTLINE}
												type="button"
												disabled={(watch('serial_numbers')?.length !== 0 && watch('serial_numbers')?.[(watch('serial_numbers')?.length ?? 1) - 1]?.toString()?.trim() === '')}
												icon={<Plus/>}
												onClick={() => {
													setValue('unit_quantity', String(fields?.length + 1))
													append('')
												}}
											>
												Add series
											</Button>
											<FileUploader
												type="txt"
												handleOnChange={(arr) => setValue('serial_numbers', Array.isArray(arr) ? Array.from(new Set([...(watch('serial_numbers') || []), ...arr])) : [])}
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