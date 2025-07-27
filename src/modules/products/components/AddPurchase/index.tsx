import {yupResolver} from '@hookform/resolvers/yup'
import {Delete, Edit, FileUploader as FileUploaderIcon, Plus} from 'assets/icons'
import {
	MaskInput,
	FileUploader,
	Form,
	Select,
	NumberFormattedInput,
	Loader,
	ReactTable,
	EditButton,
	DeleteButton,
	Input,
	Button, DetailButton
} from 'components'
import HR from 'components/HR'
import {BUTTON_THEME}
	from 'constants/fields'
import {
	useAdd,
	useData, useDelete,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import {measurementUnits} from 'modules/database/helpers/options'
import styles from 'modules/products/components/Purchase/styles.module.scss'
import {purchaseItemSchema, temporaryItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem, IValidationData} from 'modules/products/interfaces/purchase.interface'
import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import {Controller, useFieldArray, useForm, UseFormSetFocus, UseFormTrigger} from 'react-hook-form'
import {Column} from 'react-table'
import {showMessage} from 'utilities/alert'
import {
	cleanParams,
	decimalToNumber,
	decimalToInteger,
	decimalToPrice, getSelectOptionsWithBrandName,
	getSelectValue,
	sumDecimals
} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {ISearchParams} from 'interfaces/params.interface'
import {InferType} from 'yup'
import {currencyOptions} from 'constants/options'
import {useQueryClient} from '@tanstack/react-query'


interface IProperties {
	clientId?: number | string
	refetchTemporaryList?: () => void,
	focus?: UseFormSetFocus<InferType<typeof purchaseItemSchema>>,
	isTemporaryListFetching: boolean,
	detail?: boolean,
	edit?: boolean,
	detailItems?: ITemporaryListItem[],
	purchase?: IPurchaseItem,
	parentWatch?: (t: string) => string,
	temporaryList?: ITemporaryListItem[],
	trigger?: UseFormTrigger<InferType<typeof purchaseItemSchema>>,
}

const Index: FC<IProperties> = ({
	                                clientId,
	                                refetchTemporaryList,
	                                trigger,
	                                focus: parentFocus,
	                                detail: retrieve = false,
	                                edit = false,
	                                detailItems,
	                                parentWatch,
	                                purchase,
	                                temporaryList,
	                                isTemporaryListFetching
                                }) => {
	const {t} = useTranslation()
	const [series, setSeries] = useState('')
	const queryClient = useQueryClient()

	const {
		removeParams,
		addParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()

	const {data: products = []} = useData<ISelectOption[]>('products/select')

	const {mutateAsync: del, isPending: isDeleteLoading} = useDelete(edit ? 'purchase-items/' : 'temporaries/')

	const columns: Column<ITemporaryListItem>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_, index: number) => (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: row => `${row?.product?.name}${row?.product?.brand_name ? ` (${row?.product?.brand_name})` : ``}`
			},
			{
				Header: t('Code'),
				accessor: row => row?.product.code || ''
			},
			{
				Header: t('Total'),
				accessor: row => `${decimalToInteger(row?.total_quantity)} ${t(measurementUnits.find(i => i.id == row.product.measure)?.label?.toString() || '')}`
			},
			{
				Header: t('Price'),
				accessor: row => decimalToPrice(row.price)
			},
			{
				Header: `${t('Total')} ${t('Price')?.toLowerCase()}`,
				accessor: row => decimalToPrice(row.total_price)
			},
			...(!retrieve ? [{
				Header: t('Actions'),
				accessor: (row: ITemporaryListItem) => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton
							onDelete={() => !isDeleteLoading && del(row?.id).then(() => refetchTemporaryList?.())}
						/>
					</div>
				),
				style: {
					width: '5rem'
				}
			}] : [{
				Header: t('Actions'),
				accessor: (row: ITemporaryListItem) => (
					<div className="flex items-start gap-lg">
						{
							row.product?.is_serial &&
							<DetailButton
								handle={() => addParams({updateId: row.id})}
							/>
						}
					</div>
				),
				style: {
					width: '5rem'
				}
			}])
		],
		[isDeleteLoading, retrieve, refetchTemporaryList, del]
	)

	const {
		handleSubmit,
		watch,
		reset,
		control,
		setValue,
		getValues,
		setFocus,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			price: '',
			unit_quantity: '1',
			serial_numbers: [],
			product: undefined,
			expiry_date: getDate()
		},
		resolver: yupResolver(temporaryItemSchema)
	})

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'), !retrieve)

	const unitQuantity = watch('unit_quantity')
	const serialNumbers = watch('serial_numbers') || []
	const prevQuantityRef = useRef<number>()

	const quantityAsNumber = useMemo(() => Number(decimalToNumber(unitQuantity || '0')), [unitQuantity])
	const isSerialLimitReached = useMemo(() => serialNumbers.length >= quantityAsNumber, [serialNumbers.length, quantityAsNumber])
	const isSerialInputDisabled = useMemo(() => quantityAsNumber <= 0 || isSerialLimitReached || !validationData?.is_serial || retrieve, [quantityAsNumber, isSerialLimitReached, validationData?.is_serial, retrieve])

	useEffect(() => {

		const currentQuantity = Number(decimalToNumber(unitQuantity || '0'))
		const previousQuantity = prevQuantityRef.current

		if (serialNumbers.length > 0 && previousQuantity !== undefined && currentQuantity < previousQuantity && !updateId) {
			setValue('serial_numbers', [])
			setSeries('')
			showMessage(t('Serial numbers have been cleared due to quantity change'))
		}

		prevQuantityRef.current = currentQuantity
	}, [unitQuantity, serialNumbers.length])

	const {mutateAsync, isPending: isAdding} = useAdd('temporaries')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate(edit ? 'purchase-items/' : 'temporaries/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>((edit || retrieve) ? 'purchase-items/' : 'temporaries/', updateId)


	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve) {
			reset({
				product: detail.product.id,
				expiry_date: detail.expiry_date ? getDate(detail.expiry_date) : getDate(),
				price: detail.price,
				serial_numbers: detail.serial_numbers || [],
				unit_quantity: measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int' ? decimalToNumber(detail.unit_quantity) : detail.unit_quantity
			})
		}
	}, [detail, retrieve])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId && !retrieve) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				unit_quantity: '1',
				expiry_date: getDate()
			}))
		}
	}, [validationData, retrieve])


	useEffect(() => {
		if (!updateId && !retrieve) {
			reset({
				price: '',
				unit_quantity: '1',
				serial_numbers: [],
				product: undefined,
				expiry_date: ''
			})
		}
	}, [updateId, retrieve])


	const {append, remove} = useFieldArray({
		control,
		name: 'serial_numbers' as never
	})


	const seriesColumns: Column<{ name: string, id: number | string }>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_, index: number) => `${(index + 1)})`,
				style: {
					width: '1rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: row => `${row?.name}`
			},
			...(!retrieve ? [
				{
					Header: t('Actions'),
					accessor: (row: { name: string, id: number | string }) => (
						<div className="flex items-start gap-lg">
							<DeleteButton onDelete={() => remove(Number(row.id))}/>
						</div>
					),
					style: {
						width: '3rem'
					}
				}
			] : [])
		],
		[retrieve]
	)

	useEffect(() => {
		if (clientId && !retrieve) {
			setTimeout(() => {
				setFocus('product')
			}, 0)
		}
	}, [clientId, retrieve, setFocus])

	useEffect(() => {
		if (!isValidationDataFetching && !retrieve) {
			setTimeout(() => {
				setFocus('unit_quantity')
			}, 0)
		}
	}, [isValidationDataFetching, retrieve, setFocus])

	const onSubmit = () => {
		handleSubmit((data) => {
				if (!clientId) {
					trigger?.(['supplier'])
					parentFocus?.('supplier')
				} else if (updateId) {
					const newData = {
						product: data?.product,
						expiry_date: validationData?.expiry ? data?.expiry_date : null,
						price: data?.price,
						serial_numbers: validationData?.is_serial ? data?.serial_numbers ?? [] : [],
						unit_quantity: data?.unit_quantity,
						supplier: clientId
					}
					update(cleanParams(newData as unknown as ISearchParams)).then(async () => {
						removeParams('updateId')
						setSeries('')
						reset({
							price: '',
							unit_quantity: '1',
							serial_numbers: [],
							product: undefined,
							expiry_date: ''
						})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						refetchTemporaryList?.()
						await queryClient.invalidateQueries({queryKey: ['purchases/']})
					})
				} else {
					const newData = {
						product: data?.product,
						expiry_date: validationData?.expiry ? data?.expiry_date : null,
						price: data?.price,
						serial_numbers: validationData?.is_serial ? data?.serial_numbers ?? [] : [],
						unit_quantity: data?.unit_quantity,
						supplier: clientId
					}
					mutateAsync(cleanParams(newData as unknown as ISearchParams)).then(async () => {
						setSeries('')
						reset({
							price: '',
							unit_quantity: '1',
							serial_numbers: [],
							product: undefined,
							expiry_date: ''
						})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						removeParams('modal')
						refetchTemporaryList?.()
					})
				}
			}
		)()
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSubmit()
		}
	}

	const handleAddSerial = () => {
		if (series.trim() === '') return

		if (isSerialLimitReached) {
			showMessage(t('You cannot add more than {{count}} serials', {count: quantityAsNumber}))
			return
		}

		if (!serialNumbers.includes(series.trim())) {
			append(series.trim())
			setSeries('')
		} else {
			showMessage(t('Serial number already exist', {number: series.trim()}))
		}
	}

	const handleSeriesKeyDown = (e: React.KeyboardEvent<HTMLInputElement> & React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddSerial()
		}
	}


	return (
		<Form onSubmit={(e) => e.preventDefault()}>
			<div className="grid gap-lg">
				<div
					className={((validationData?.is_serial && !retrieve) || (!!updateId && retrieve)) ? 'span-9' : 'span-12'}>
					<div className="grid gap-lg">
						{
							!retrieve &&
							<div className="flex gap-lg span-12">
								<div className={validationData?.is_serial ? 'flex-5' : 'flex-3'}>
									<Controller
										name="product"
										control={control}
										render={({field: {value, ref, onChange, onBlur}}) => (
											<Select
												ref={ref}
												id="product"
												label="Product"
												onBlur={onBlur}
												options={getSelectOptionsWithBrandName(products)}
												isDisabled={!!updateId || retrieve || edit}
												error={errors.product?.message}
												value={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												defaultValue={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)
										}
									/>
								</div>

								{
									(isValidationDataFetching) ?
										<div style={{flex: '6'}}>
											<Loader/>
										</div> : validationData ?
											<>
												<div className="flex-3">
													<Controller
														control={control}
														name="unit_quantity"
														render={({field}) => (
															<NumberFormattedInput
																id="unit_quantity"
																disableGroupSeparators={false}
																disabled={retrieve}
																allowDecimals={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'float'}
																maxLength={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? 6 : 9}
																onKeyDown={handleKeyDown}
																error={errors?.unit_quantity?.message}
																label={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? t('Count') + ' ' + `(${t(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})` : t('Quantity') + ' ' + `(${(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})`}
																{...field}
															/>
														)}
													/>
												</div>


												{
													validationData.expiry &&
													<div className="flex-3">
														<Controller
															name="expiry_date"
															control={control}
															render={({field}) => (
																<MaskInput
																	id="expiry_date"
																	label="Expiry date"
																	placeholder={getDate()}
																	onKeyDown={handleKeyDown}
																	mask="99.99.9999"
																	disabled={retrieve}
																	error={errors?.expiry_date?.message}
																	{...field}
																/>
															)}
														/>
													</div>
												}

												<div className="flex-3 flex gap-lg">
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
																	disabled={retrieve}
																	onKeyDown={handleKeyDown}
																	error={errors?.price?.message}
																	{...field}
																/>
															)}
														/>
													</div>
													{
														!retrieve &&
														<div className="gap-md flex align-start"
														     style={{paddingTop: '1.5rem'}}>
															<Button
																icon={updateId ? <Edit/> : <Plus/>}
																mini={true}
																type="submit"
																disabled={isAdding || isUpdating || retrieve}
																onClick={() => onSubmit()}
															/>
															<Button
																theme={BUTTON_THEME.DANGER_OUTLINE}
																icon={<Delete/>}
																type="button"
																mini={true}
																onClick={() => {
																	if (updateId) {
																		removeParams('updateId')
																	}
																	reset({
																			price: '',
																			unit_quantity: '1',
																			serial_numbers: [],
																			product: undefined,
																			expiry_date: ''
																		}
																	)
																}}
															/>
														</div>
													}
												</div>
											</> :
											<div style={{flex: '6'}}></div>
								}
							</div>
						}

						<div className="span-12">
							<div className="flex gap-lg align-center justify-between">
								<div className={styles['price-wrapper']}>
									<div className={styles.price}>
										<p>{`${t('Products all count')}`}:</p>
										<span>{decimalToInteger(sumDecimals(((edit || retrieve) ? purchase?.items : temporaryList)?.map(i => i?.unit_quantity ?? '0.00') ?? []))}</span>
									</div>
									<div className={styles.price}>
										<p>{t('Summa')}:</p>
										<span>{decimalToPrice(sumDecimals(((edit || retrieve) ? purchase?.items : temporaryList)?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == ((edit || retrieve) ? purchase?.currency : parentWatch?.('currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
									</div>
									<div className={styles.price}>
										<p>{t('Expense quantity')}:</p>
										<span>{decimalToPrice((edit || retrieve) ? purchase?.cost_amount || '0' : parentWatch?.('cost_amount') || '0')} {t(currencyOptions?.find(i => i?.value == ((edit || retrieve) ? purchase?.cost_currency : parentWatch?.('cost_currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
									</div>
								</div>
							</div>

							<ReactTable
								columns={columns} data={(edit || retrieve) ? detailItems ?? [] : temporaryList ?? []}
								isLoading={isTemporaryListFetching}
							/>
						</div>
					</div>
				</div>
				{
					validationData?.is_serial && !retrieve &&
					<div className="span-3">
						<div className="grid gap-lg">
							<div className="flex gap-lg span-12">
								<Input
									className="flex-1"
									id="serial_numbers_input"
									label="Series"
									disabled={isSerialInputDisabled}
									value={series}
									onChange={(e) => {
										setSeries(e.target.value)
									}}
									onKeyDown={handleSeriesKeyDown}
								/>
								<div className="gap-md flex align-start" style={{paddingTop: '1.5rem'}}>
									<Button
										disabled={!series?.trim() || retrieve || isSerialInputDisabled}
										icon={<Plus/>}
										type="button"
										mini={true}
										onClick={handleAddSerial}
									/>
									<FileUploader
										content={
											<Button
												icon={<FileUploaderIcon style={{maxWidth: '1.2rem'}}/>}
												mini={true}
												type="button"
												disabled={retrieve || isSerialInputDisabled}
											/>
										}
										type="txt"
										handleOnChange={(arr) => {
											const latestQuantityValue = getValues('unit_quantity') || '0'
											const latestQuantityAsNumber = Number.parseInt(decimalToInteger(latestQuantityValue))

											const newSerials = Array.isArray(arr) ? arr.map(s => s.trim()).filter(Boolean) : []
											if (newSerials.length > 0) {
												const combined = Array.from(new Set([...serialNumbers, ...newSerials]))
												const sliced = combined.slice(0, latestQuantityAsNumber)
												setValue('serial_numbers', sliced as never[])

												if (combined.length > latestQuantityAsNumber) {
													showMessage(t('Only {{count}} serials were added due to the limit', {count: sliced.length - serialNumbers.length}))
												}
											}
										}}
										value={undefined}
										id="series_file_uploader"
									/>
								</div>
							</div>
							<div className="span-12"
							     style={{maxHeight: '25rem', overflowY: 'auto'}}>
								<div
									className={styles.title}>{t('Series')} ({serialNumbers.length}/{quantityAsNumber})
								</div>
								<ReactTable
									columns={seriesColumns}
									data={
										serialNumbers?.filter(i => !!i)?.map((i, index) => ({
											name: String(i),
											id: index
										})) || []
									}
								/>
								<HR/>
							</div>
						</div>
					</div>
				}
				{
					retrieve && !!updateId &&
					<div className="span-3" style={{maxHeight: '30rem', overflowY: 'auto'}}>
						<div
							className={styles.title}>{t('Series')} ({detail?.serial_numbers?.length || 0}/{Number.parseInt(detail?.unit_quantity || '0')})
						</div>
						<ReactTable
							columns={seriesColumns}
							isLoading={isDetailLoading}
							data={
								detail?.serial_numbers?.map((i, index) => ({
									name: String(i),
									id: index
								})) || []
							}
						/>
						<HR/>
					</div>
				}
			</div>
		</Form>
	)
}

export default Index