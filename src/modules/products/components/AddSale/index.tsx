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
	DeleteButton, Input
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
import {IPurchasesItem, ITemporaryListItem, IValidationData} from 'modules/products/interfaces/purchase.interface'
import React, {FC, useEffect, useMemo, useState} from 'react'
import {Controller, useFieldArray, useForm, UseFormSetFocus, UseFormTrigger} from 'react-hook-form'
import {Column} from 'react-table'
import {showMessage} from 'utilities/alert'
import {cleanParams, decimalToInteger, decimalToNumber, decimalToPrice, getSelectValue} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import {ISearchParams} from 'interfaces/params.interface'
import {InferType} from 'yup'
import {getDate} from 'utilities/date'


interface IProperties {
	clientId?: number | string;
	refetchTemporaryList?: () => void;
	focus?: UseFormSetFocus<InferType<typeof saleItemSchema>>;
	isTemporaryListFetching: boolean;
	temporaryList: ITemporaryListItem[];
	trigger?: UseFormTrigger<InferType<typeof saleItemSchema>>;
	currency?: string | number;
	// priceType?: string | number;
}

const Index: FC<IProperties> = ({
	                                clientId,
	                                refetchTemporaryList,
	                                trigger,
	                                focus,
	                                temporaryList,
	                                isTemporaryListFetching
                                }) => {
	const {t} = useTranslation()
	const [series, setSeries] = useState('')
	const {store} = useTypedSelector(state => state.stores)
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()
	const {mutateAsync: del, isPending: isDelete} = useDelete('sale-temporaries/')

	const {data: products = []} = useData<ISelectOption[]>('products/select')

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
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton onDelete={() => !isDelete && del(row?.id).then(() => refetchTemporaryList?.())}/>
					</div>
				)
			}
		],
		[isDelete]
	)

	const {
		handleSubmit,
		watch,
		reset,
		control,
		setValue,
		setFocus: setFormFocus,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			price: '',
			unit_quantity: '1',
			serial_numbers: [],
			product: undefined
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
									disabled={!!updateId}
									{...field}
									id={`temp_quantity_input_${row.id}`}
									placeholder={t('Quantity')}
									allowDecimals={measurementUnits?.find(i => i.id == validationData?.measure)?.type == 'float'} // Adjust as needed
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
		[control, updateId]
	)


	const {mutateAsync} = useAdd('sale-temporaries')
	const {mutateAsync: update} = useUpdate('sale-temporaries/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<ITemporaryListItem>('sale-temporaries/', updateId)

	const {
		data: purchases = [],
		isFetching
	} = useDetail<IPurchasesItem>(`residues/${watch('product')}/`, 'purchase-items', !!watch('product'), {store: store?.value})

	const {
		data: productCount
	} = useDetail<{ quantity: number }>(`residues/`, `${watch('product')}`, !!watch('product'), {store: store?.value})

	const {
		data: validationData,
		isPending: isValidationDataLoading,
		isFetching: isValidationDataFetching
	} = useDetail<IValidationData>('products/val-data/', watch('product'))

	useEffect(() => {
		if (detail && !isDetailLoading) {
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
	}, [detail, isDetailLoading])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				unit_quantity: '1',
				serial_numbers: []
			}))
		}
	}, [validationData, isValidationDataLoading])

	useEffect(() => {
		if (!updateId) {
			reset({
				price: '',
				unit_quantity: '1',
				serial_numbers: [],
				product: undefined
			})
		}
	}, [updateId])

	useEffect(() => {
		if (clientId) {
			setTimeout(() => {
				setFormFocus('product')
			}, 0)
		}
	}, [clientId])


	useEffect(() => {
		if (!isValidationDataFetching) {
			setTimeout(() => {
				setFormFocus('unit_quantity')
			}, 0)
		}
	}, [isValidationDataFetching])

	const onSubmit = () => {
		handleSubmit((data) => {
				if (!clientId) {
					trigger?.(['customer'])
					focus?.('customer')
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
						reset({price: '', unit_quantity: '', serial_numbers: [], product: undefined, temp_quantities: []})
						setTimeout(() => { setFormFocus('product') }, 0)
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
						reset({price: '', unit_quantity: '', serial_numbers: [], product: undefined, temp_quantities: []})
						setTimeout(() => { setFormFocus('product') }, 0)
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
		if (e?.key === 'Enter') {
			if (series.trim()?.toString() == '') return
			const serialNumbers = watch('serial_numbers')
			if (!serialNumbers?.includes(series?.trim()?.toString())) {
				append(series)
				setSeries('')
			} else {
				showMessage(t('Serial number already exist', {number: series?.trim()?.toString()}))
			}
		}
	}

	useEffect(() => {
		if (purchases && Array.isArray(purchases) && !isFetching && watch('product') && !updateId) {
			const newTempQuantities = purchases?.map((purchase: IPurchasesItem) => {
				return {
					purchase_item: purchase.id,
					quantity: ''
				}
			})
			setValue('temp_quantities', newTempQuantities)
		} else if (!watch('product') && !updateId) {
			setValue('temp_quantities', [])
		}
	}, [isFetching, watch('product')])

	return (
		<div className="grid gap-lg">
			<div className={validationData?.is_serial ? 'span-8' : 'span-8'}>
				<div className="grid gap-lg">

					<div className="flex gap-lg span-12">
						<div className="flex-5">
							<Controller
								name="product"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="product"
										label={`${t('Product')}${productCount?.quantity ? ` (${t('Total')?.toLowerCase()} - ${productCount?.quantity})` : ''}`}
										redLabel={true}
										onBlur={onBlur}
										options={products}
										isDisabled={!!updateId}
										error={errors.product?.message}
										value={getSelectValue(products, value)}
										defaultValue={getSelectValue(products, value)}
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
													label="Price"
													onKeyDown={handleKeyDown}
													error={errors?.price?.message}
													{...field}
												/>
											)}
										/>
									</div>
									<div className="gap-md flex align-start" style={{paddingTop: '1.5rem'}}>
										<Button
											icon={updateId ? <Edit/> : <Plus/>}
											mini={true}
											onClick={() => onSubmit()}
										/>
										<Button
											theme={BUTTON_THEME.DANGER_OUTLINE}
											icon={<Delete/>}
											mini={true}
											onClick={() => {
												if (updateId) {
													removeParams('updateId', 'modal')
												} else {
													reset({
															price: '',
															unit_quantity: '',
															serial_numbers: [],
															product: undefined
														}
													)
												}
											}}
										/>

									</div>
								</div>
								{/*<div className="flex-1 flex items-end">*/}
								{/*	<Button*/}
								{/*		icon={<Plus/>}*/}
								{/*		type="button"*/}
								{/*		onClick={onSubmit}*/}
								{/*		disabled={!watch('product') || (validationData?.is_serial && !watch('serial_numbers')?.length)}*/}
								{/*	>*/}
								{/*		{updateId ? t('Edit') : t('Add')}*/}
								{/*	</Button>*/}
								{/*</div>*/}
							</>
						) : (
							<div style={{flex: '7'}}></div>
						)}
					</div>


					<div className="span-12">
						<div className={styles.title}>{t('Products')}</div>
						{/*<HR style={{marginBottom: '1rem'}}/>*/}
						<ReactTable columns={columns} data={temporaryList} isLoading={isTemporaryListFetching}/>
						<HR style={{marginBottom: '1rem'}}/>
					</div>
				</div>
			</div>

			<div className="span-4">


				<div className="grid gap-lg">
					<div className="span-12" style={{maxHeight: '25rem', overflowY: 'auto'}}>
						<div className={styles.title}>{t('Parties')}</div>
						{/*<HR style={{marginBottom: '1rem'}}/>*/}
						<ReactTable
							columns={purchaseColumns}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							data={purchases as unknown as IPurchasesItem}
						/>
						{/*<HR style={{marginBottom: '1rem'}}/>*/}
					</div>

					{
						validationData?.is_serial &&
						<>
							<div className="flex gap-lg span-12">
								<Input
									className="flex-1"
									id="serial_numbers"
									label="Series"
									disabled={!validationData?.is_serial}
									redLabel={true}
									value={series}
									onChange={(e) => {
										setSeries(e.target.value)
									}}
									onKeyDown={handleSeriesKeyDown}
								/>

								<div className="gap-md flex align-start" style={{paddingTop: '1.5rem'}}>
									<Button
										disabled={!series?.trim()}
										icon={<Plus/>}
										mini={true}
										onClick={() => {
											if (series.trim() == '') return
											const serialNumbers = watch('serial_numbers')
											if (!serialNumbers?.includes(series?.trim()?.toString())) {
												append(series)
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
											/>
										}
										type="txt"
										handleOnChange={(arr) => setValue('serial_numbers', Array.isArray(arr) ? Array.from(new Set(arr)) : [])}
										value={undefined}
										id="series"
									/>
								</div>
							</div>

							<div className="span-12" style={{maxHeight: '25rem', overflowY: 'auto'}}>
								<div className={styles.title}>{t('Series')}</div>
								{/*<HR style={{marginBottom: '1rem'}}/>*/}
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
	)
}

export default Index