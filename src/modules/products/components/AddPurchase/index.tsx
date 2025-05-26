import {yupResolver} from '@hookform/resolvers/yup'
import {Delete, Edit, FileUploader as FileUploaderIcon, Plus} from 'assets/icons'
import {
	MaskInput,
	FileUploader,
	Form,
	Select,
	NumberFormattedInput,
	Loader, ReactTable, EditButton, DeleteButton, Input,
	Button
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
import {ITemporaryListItem, IValidationData} from 'modules/products/interfaces/purchase.interface'
import React, {FC, useEffect, useMemo, useState} from 'react'
import {Controller, useFieldArray, useForm, UseFormSetFocus, UseFormTrigger} from 'react-hook-form'
import {Column} from 'react-table'
import {showMessage} from 'utilities/alert'
import {cleanParams, decimalToInteger, decimalToNumber, decimalToPrice, getSelectValue} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {getDate} from 'utilities/date'
import {useTranslation} from 'react-i18next'
import {ISearchParams} from 'interfaces/params.interface'
import {InferType} from 'yup'


interface IProperties {
	clientId?: number | string
	refetchTemporaryList?: () => void,
	focus?: UseFormSetFocus<InferType<typeof purchaseItemSchema>>,
	isTemporaryListFetching: boolean,
	detail?: boolean,
	detailItems?: ITemporaryListItem[],
	temporaryList?: ITemporaryListItem[],
	trigger?: UseFormTrigger<InferType<typeof purchaseItemSchema>>,
}

const Index: FC<IProperties> = ({
	                                clientId,
	                                refetchTemporaryList,
	                                trigger,
	                                focus: parentFocus,
	                                detail: retrieve = false,
	                                detailItems,
	                                temporaryList,
	                                isTemporaryListFetching
                                }) => {
	const {t} = useTranslation()
	const [series, setSeries] = useState('')
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()

	const {data: products = []} = useData<ISelectOption[]>('products/select')

	const {mutateAsync: del, isPending: isDeleteLoading} = useDelete('temporaries/')

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
				accessor: row => `${row?.product?.name}`
			},
			{
				Header: t('Price'),
				accessor: row => decimalToPrice(row.price)
			},
			{
				Header: t('Total'),
				accessor: row => `${decimalToInteger(row?.total_quantity)} ${t(measurementUnits.find(i => i.id == row.product.measure)?.label?.toString() || '')}`
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
							onDelete={() => !isDeleteLoading && del(row?.id).then(() => refetchTemporaryList?.())}/>
					</div>
				),
				style: {
					width: '5rem'
				}
			}] : [])
		],
		[isDeleteLoading, retrieve, t, refetchTemporaryList, del]
	)

	const {
		handleSubmit,
		watch,
		reset,
		control,
		setValue,
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

	const {mutateAsync} = useAdd('temporaries')
	const {mutateAsync: update} = useUpdate('temporaries/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>('temporaries/', updateId, !retrieve)

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'), !retrieve)

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
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<DeleteButton onDelete={() => remove(Number(row.id))}/>
					</div>
				),
				style: {
					width: '3rem'
				}
			}
		],
		[]
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

	const handleSeriesKeyDown = (e: unknown) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (e.key === 'Enter') {
			if (series.trim()?.toString() == '') return
			const serialNumbers = watch('serial_numbers') || []
			if (!serialNumbers?.includes(series?.trim()?.toString())) {
				append(series.trim())
				setSeries('')
			} else {
				showMessage(t('Serial number already exist', {number: series?.trim()?.toString()}))
			}
		}
	}

	return (
		<Form onSubmit={(e) => e.preventDefault()}>
			<div className="grid gap-lg">
				<div className={validationData?.is_serial && !retrieve ? 'span-9' : 'span-12'}>
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
												options={products}
												isDisabled={!!updateId || retrieve}
												error={errors.product?.message}
												value={getSelectValue(products, value)}
												defaultValue={getSelectValue(products, value)}
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
							<div className={styles.title}>{t('Products')}</div>
							<ReactTable
								columns={columns} data={retrieve ? detailItems ?? [] : temporaryList ?? []}
								isLoading={isTemporaryListFetching}
							/>
							<HR style={{marginBottom: '1rem'}}/>
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
									disabled={!validationData?.is_serial || retrieve}
									value={series}
									onChange={(e) => {
										setSeries(e.target.value)
									}}
									onKeyDown={handleSeriesKeyDown}
								/>
								<div className="gap-md flex align-start" style={{paddingTop: '1.5rem'}}>
									<Button
										disabled={!series?.trim() || retrieve}
										icon={<Plus/>}
										type="button"
										mini={true}
										onClick={() => {
											if (series.trim() == '') return
											const serialNumbers = watch('serial_numbers') || []
											if (!serialNumbers?.includes(series?.trim()?.toString())) {
												append(series.trim())
												setSeries('')
											} else {
												showMessage(t('Serial number already exist', {number: series?.trim()?.toString()}))
											}
										}}
									/>
									<FileUploader
										content={
											<Button
												icon={<FileUploaderIcon style={{maxWidth: '1.2rem'}}/>}
												mini={true}
												type="button"
												disabled={retrieve}
											/>
										}
										type="txt"
										handleOnChange={(arr) => {
											const currentSerials = watch('serial_numbers') || []
											const newSerials = Array.isArray(arr) ? Array.from(new Set([...currentSerials, ...arr.map(s => s.trim()).filter(Boolean)])) : currentSerials
											setValue('serial_numbers', newSerials as never[])
										}
										}
										value={undefined}
										id="series_file_uploader"
									/>
								</div>
							</div>
							<div className="span-12"
							     style={{paddingBottom: '.5rem', maxHeight: '25rem', overflowY: 'auto'}}>
								<div className={styles.title}>{t('Series')}</div>
								<ReactTable
									columns={seriesColumns}
									data={
										watch('serial_numbers')?.filter(i => !!i)?.map((i, index) => ({
											name: String(i),
											id: index
										})) || []
									}
								/>
								<HR style={{marginBottom: '1rem'}}/>
							</div>
						</div>
					</div>
				}
			</div>
		</Form>
	)
}

export default Index