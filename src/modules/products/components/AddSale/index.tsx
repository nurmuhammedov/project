import {yupResolver} from '@hookform/resolvers/yup'
import {Delete, Edit, FileUploader as FileUploaderIcon, Plus} from 'assets/icons'
import {
	Button,
	Select,
	NumberFormattedInput,
	Loader,
	FileUploader,
	ReactTable,
	EditButton,
	DeleteButton, Input, Form
} from 'components'
import HR from 'components/HR'
import {BUTTON_THEME} from 'constants/fields'
import {
	useAdd,
	useData, useDelete,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {measurementUnits} from 'modules/database/helpers/options'
import styles from 'modules/products/components/Purchase/styles.module.scss'
import {saleItemSchema, temporarySaleItemSchema} from 'modules/products/helpers/yup'
import {
	IPurchaseItem,
	IPurchasesItem,
	ITemporaryListItem,
	IValidationData
} from 'modules/products/interfaces/purchase.interface'
import React, {FC, useEffect, useMemo, useState} from 'react'
import {Controller, useFieldArray, useForm, UseFormSetFocus, UseFormTrigger} from 'react-hook-form'
import {Column} from 'react-table'
import {showMessage} from 'utilities/alert'
import {
	cleanParams,
	decimalToInteger,
	decimalToNumber,
	decimalToPrice, getSelectOptionsWithBrandName,
	getSelectValue,
	sumDecimals
} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import {ISearchParams} from 'interfaces/params.interface'
import {InferType} from 'yup'
import {getDate} from 'utilities/date'
import {currencyOptions} from 'constants/options'


interface IProperties {
	clientId?: number | string;
	refetchTemporaryList?: () => void;
	focus?: UseFormSetFocus<InferType<typeof saleItemSchema>>;
	trigger?: UseFormTrigger<InferType<typeof saleItemSchema>>;
	isTemporaryListFetching: boolean;
	detailItems?: ITemporaryListItem[];
	parentWatch?: (t: string) => string;
	saleDetail?: IPurchaseItem;
	temporaryList?: ITemporaryListItem[];
	currency?: string | number;
	detail?: boolean;
}

const Index: FC<IProperties> = ({
	                                clientId,
	                                refetchTemporaryList,
	                                trigger,
	                                focus: parentFocus,
	                                detailItems,
	                                parentWatch,
	                                saleDetail,
	                                temporaryList,
	                                isTemporaryListFetching,
	                                detail: retrieve = false
                                }) => {
	const {t} = useTranslation()
	const [series, setSeries] = useState('')
	const {store} = useTypedSelector(state => state.stores)
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()
	const {mutateAsync: del, isPending: isDeleteLoading} = useDelete('sale-temporaries/')

	const {data: products = []} = useData<ISelectOption[]>(`stores/${store?.value}/stock/select`, !retrieve && !!store?.value)

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
				accessor: row => row?.code || ''
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
			serial_numbers: [] as string[],
			product: undefined,
			temp_quantities: [] as { purchase_item: number, quantity: string }[]
		},
		resolver: yupResolver(temporarySaleItemSchema)
	})

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

	const purchaseColumns: Column<IPurchasesItem>[] = useMemo(
		() => [
			{
				Header: t('Quantity'),
				accessor: (row: IPurchasesItem, index: number) => {
					return (
						<Controller
							control={control}
							name={`temp_quantities.${index}.quantity`}
							render={({field, fieldState: {error}}) => (
								<NumberFormattedInput
									disabled={retrieve}
									{...field}
									id={`temp_quantity_input_${row.id}`}
									placeholder={t('Quantity')}
									allowDecimals={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'float'}
									disableGroupSeparators={false}
									error={error?.message}
								/>
							)}
						/>
					)
				}
			},
			{
				Header: t('Remainder'),
				accessor: row => decimalToInteger(row?.quantity)
			},
			{
				Header: t('Full name'),
				accessor: row => row?.supplier_name
			},
			{
				Header: t('Date'),
				accessor: row => getDate(row?.purchase_date)
			}
		],
		[control, updateId, retrieve]
	)


	const {mutateAsync, isPending: isAdding} = useAdd('sale-temporaries')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('sale-temporaries/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>('sale-temporaries/', updateId, !retrieve)

	const {
		data: purchases = [],
		isFetching
	} = useDetail<IPurchasesItem[]>(`residues/${watch('product')}/`, 'purchase-items', !!watch('product') && !retrieve, {store: store?.value})


	// const {
	// 	data: productCount
	// } = useDetail<{
	// 	quantity: number
	// }>(`residues/`, `${watch('product')}`, !!watch('product') && !retrieve, {store: store?.value})

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'), !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve) {
			reset({
				product: detail.product.id,
				price: detail.price,
				serial_numbers: detail.serial_numbers || [],
				temp_quantities: detail.temp_quantities?.map((i) => ({
					...i,
					quantity: decimalToInteger(i.quantity)
				})) || [],
				unit_quantity: measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int'
					? decimalToNumber(detail.total_quantity)
					: detail.total_quantity
			})
		}
	}, [detail, isDetailLoading, retrieve])


	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve && !!purchases?.length) {
			const originalTempQuantities = detail.temp_quantities || []
			const sortedTempQuantities = purchases.map(purchaseItem => {
				const tempItem = originalTempQuantities.find(
					(t) => t.purchase_item === purchaseItem.id
				)

				return {
					purchase_item: purchaseItem.id,
					quantity: tempItem
						? decimalToInteger(tempItem.quantity)
						: ''
				}
			})

			reset({
				product: detail.product.id,
				price: detail.price,
				serial_numbers: detail.serial_numbers || [],
				temp_quantities: sortedTempQuantities,
				unit_quantity: measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int'
					? decimalToNumber(detail.total_quantity)
					: detail.total_quantity
			})
		}
	}, [detail, isDetailLoading, retrieve, purchases])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId && !retrieve) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				unit_quantity: '1',
				serial_numbers: []
			}))
		}
	}, [validationData, isValidationDataLoading, updateId, retrieve])

	useEffect(() => {
		if (!updateId && !retrieve) {
			reset({
				price: '',
				unit_quantity: '1',
				serial_numbers: [],
				product: undefined,
				temp_quantities: []
			})
		}
	}, [updateId, retrieve])

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
					trigger?.(['customer'])
					parentFocus?.('customer')
				} else if (updateId) {
					const newData = {
						product: data?.product,
						price: data?.price,
						serial_numbers: validationData?.is_serial ? data?.serial_numbers ?? [] : [],
						store: store?.value,
						unit_quantity: data?.unit_quantity,
						temp_quantities: data?.temp_quantities?.length ? data?.temp_quantities?.filter(i => !!i?.quantity) : [],
						customer: clientId
					}
					update(cleanParams(newData as unknown as ISearchParams)).then(async () => {
						removeParams('updateId')
						setSeries('')
						reset({price: '', unit_quantity: '1', serial_numbers: [], product: undefined, temp_quantities: []})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						refetchTemporaryList?.()
					})
				} else {
					const newData = {
						product: data?.product,
						price: data?.price,
						store: store?.value,
						serial_numbers: validationData?.is_serial ? data?.serial_numbers ?? [] : [],
						unit_quantity: data?.unit_quantity,
						temp_quantities: data?.temp_quantities?.length ? data?.temp_quantities?.filter(i => !!i?.quantity) : [],
						customer: clientId
					}
					mutateAsync(cleanParams(newData as unknown as ISearchParams)).then(async () => {
						setSeries('')
						reset({price: '', unit_quantity: '1', serial_numbers: [], product: undefined, temp_quantities: []})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						refetchTemporaryList?.()
					})
				}
			}
		)()
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			onSubmit()
		}
	}

	const handleSeriesKeyDown = (e: unknown) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		e?.preventDefault()
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (e?.key === 'Enter') {
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

	useEffect(() => {
		if (purchases && Array.isArray(purchases) && !isFetching && watch('product') && !updateId && !retrieve) {
			const newTempQuantities = purchases?.map((purchase: IPurchasesItem) => {
				return {
					purchase_item: purchase.id,
					quantity: ''
				}
			})
			setValue('temp_quantities', newTempQuantities)
		} else if (!watch('product') && !updateId && !retrieve) {
			setValue('temp_quantities', [])
		}
	}, [isFetching, watch('product'), retrieve])

	return (
		<Form onSubmit={(e) => e.preventDefault()}>
			<div className="grid gap-lg">
				<div className={validationData?.is_serial && !retrieve ? 'span-8' : 'span-8'}>
					<div className="grid gap-lg">
						{
							!retrieve &&
							<div className="flex gap-lg span-12">
								<div className="flex-5">
									<Controller
										name="product"
										control={control}
										render={({field: {value, ref, onChange, onBlur}}) => (
											<Select
												ref={ref}
												id="product"
												label={`${t('Product')} (${t('Total')?.toLowerCase()} ${t('Count')?.toLowerCase()} - ${products?.find(i => i?.value == watch('product'))?.quantity || 0})`}
												redLabel={true}
												onBlur={onBlur}
												isDisabled={!!updateId || retrieve}
												error={errors.product?.message}
												options={getSelectOptionsWithBrandName(products)}
												value={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												defaultValue={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)
										}
									/>
								</div>

								{isValidationDataFetching ? (
									<div style={{flex: '7'}}>
										<Loader/>
									</div>
								) : validationData ? (
									<>
										<div className="flex-4">
											<Controller
												control={control}
												name="unit_quantity"
												render={({field}) => (
													<NumberFormattedInput
														id="unit_quantity"
														disableGroupSeparators={false}
														redLabel={true}
														disabled={retrieve}
														allowDecimals={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'float'}
														maxLength={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? 6 : 9}
														onKeyDown={handleKeyDown}
														error={errors?.unit_quantity?.message}
														label={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'int' ? t('Count') + ` (${t(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})` : t('Quantity') + ` (${t(measurementUnits?.find(i => i.id == validationData?.measure)?.label?.toString() || '')})`}
														{...field}
													/>
												)}
											/>
										</div>

										<div className="flex-4 flex gap-lg">
											<div className="flex-1">
												<Controller
													control={control}
													name="price"
													render={({field}) => (
														<NumberFormattedInput
															id="price"
															maxLength={12}
															redLabel={true}
															disableGroupSeparators={false}
															allowDecimals={true}
															disabled={retrieve}
															label="Price"
															onKeyDown={handleKeyDown}
															error={errors?.price?.message}
															{...field}
														/>
													)}
												/>
											</div>
											{
												!retrieve &&
												<div className="gap-md flex align-start" style={{paddingTop: '1.5rem'}}>
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
																	temp_quantities: []
																}
															)
														}}
													/>
												</div>
											}
										</div>
									</>
								) : (
									<div style={{flex: '7'}}></div>
								)}
							</div>
						}


						<div className="span-12">
							<div className="flex gap-lg align-center justify-between">
								<div className={styles.title}>{t('Products')}:</div>
								<div className={styles['price-wrapper']}>
									<div className={styles.price}>
										<p>{`${t('Products all count')}`}:</p>
										<span>{decimalToInteger(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_quantity ?? '0.00') ?? []))}</span>
									</div>
									<div className={styles.price}>
										<p>{t('Summa')}:</p>
										<span>{decimalToPrice(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == (retrieve ? saleDetail?.currency : parentWatch?.('currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
									</div>
								</div>
							</div>
							<ReactTable
								columns={columns}
								data={retrieve ? detailItems ?? [] : temporaryList ?? []}
								isLoading={isTemporaryListFetching}

							/>
							<HR style={{marginBottom: '1rem'}}/>
						</div>
					</div>
				</div>

				<div className="span-4">
					<div className="grid gap-lg">
						{
							!retrieve &&
							<div className="span-12" style={{maxHeight: '25rem', overflowY: 'auto'}}>
								<div className={styles.title}>{t('Parties')}</div>
								<ReactTable
									columns={purchaseColumns}
									data={purchases as unknown as IPurchasesItem[]}
									isLoading={isFetching}
								/>
								<HR style={{marginBottom: '1rem'}}/>
							</div>
						}

						{
							validationData?.is_serial && !retrieve &&
							<>
								<div className="flex gap-lg span-12">
									<Input
										className="flex-1"
										id="serial_numbers_input"
										label="Series"
										disabled={!validationData?.is_serial || retrieve}
										redLabel={true}
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
											}}
											value={undefined}
											id="series_file_uploader"
										/>
									</div>
								</div>

								<div className="span-12" style={{maxHeight: '25rem', overflowY: 'auto'}}>
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

							</>
						}

					</div>
				</div>
			</div>
		</Form>
	)
}

export default Index