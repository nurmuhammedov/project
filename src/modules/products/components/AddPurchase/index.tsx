import {yupResolver} from '@hookform/resolvers/yup'
import {FileUploader as FileUploaderIcon, Plus} from 'assets/icons'
import {
	// Button,
	// Input,
	MaskInput,
	FileUploader,
	Form,
	Select,
	NumberFormattedInput,
	Loader, ReactTable, EditButton, DeleteButton, Input,
	Button
} from 'components'
import HR from 'components/HR'
// import FileUpLoader from 'components/UI/FileUpLoader'
// import {BUTTON_THEME, FIELD} from 'constants/fields'
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
// import {Plus} from 'assets/icons'
import {useTranslation} from 'react-i18next'
// import {showMessage} from 'utilities/alert'
import {ISearchParams} from 'interfaces/params.interface'
import {InferType} from 'yup'


interface IProperties {
	clientId?: number | string
	refetchTemporaryList?: () => void,
	focus?: UseFormSetFocus<InferType<typeof purchaseItemSchema>>,
	isTemporaryListFetching: boolean,
	temporaryList: ITemporaryListItem[],
	trigger?: UseFormTrigger<InferType<typeof purchaseItemSchema>>,
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
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()

	const {data: products = []} = useData<ISelectOption[]>('products/select')

	const {mutateAsync: del, isPending: isDelete} = useDelete('temporaries/')

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
		// register,
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
	} = useDetail<ITemporaryListItem>('temporaries/', updateId)

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
				// unit_quantity: detail?.product?.is_serial ? detail.serial_numbers?.length?.toString() || '1' : measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int' ? decimalToNumber(detail.unit_quantity) : detail.unit_quantity
				unit_quantity: measurementUnits.find(i => i.id == detail.product?.measure)?.type == 'int' ? decimalToNumber(detail.unit_quantity) : detail.unit_quantity
			})
		}
	}, [detail])

	useEffect(() => {
		if (validationData && !isValidationDataLoading && !updateId) {
			reset((prevValues) => ({
				...prevValues,
				price: '',
				unit_quantity: validationData?.is_serial ? '1' : '1',
				// serial_numbers: [],
				expiry_date: getDate()
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
						{/*<EditButton id={row.id}/>*/}
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
		if (clientId) {
			setTimeout(() => {
				setFocus('product')
			}, 0)
		}
	}, [clientId])

	useEffect(() => {
		if (!isValidationDataFetching) {
			setTimeout(() => {
				setFocus('unit_quantity')
			}, 0)
		}
	}, [isValidationDataFetching])

	const onSubmit = () => {
		handleSubmit((data) => {
				if (!clientId) {
					// showMessage('Client ID required')
					trigger?.(['supplier'])
					focus?.('supplier')
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
						removeParams('updateId', 'modal')
						setSeries('')
						reset({
							price: '',
							unit_quantity: '',
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
							unit_quantity: '',
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

	return (
		<Form onSubmit={() => onSubmit()}>
			<div className="grid gap-lg">
				<div className={validationData?.is_serial ? 'span-9' : 'span-12'}>
					<div className="grid gap-lg">
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

											<div className="flex-3">
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
															onKeyDown={handleKeyDown}
															error={errors?.price?.message}
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
																error={errors?.expiry_date?.message}
																{...field}
															/>
														)}
													/>
												</div>
											}


											{/*{*/}
											{/*	validationData.is_serial &&*/}
											{/*	<>*/}
											{/*		<div className="grid span-12 gap-lg">*/}
											{/*			{*/}
											{/*				fields?.map((field, index) => (*/}
											{/*					<div className="span-6" key={field.id}>*/}
											{/*						<Input*/}
											{/*							id={`serial_numbers.${index}`}*/}
											{/*							label={t('Product serial number', {index: index + 1})}*/}
											{/*							handleDelete={() => {*/}
											{/*								// setValue('unit_quantity', String(fields?.length - 1))*/}
											{/*								remove(index)*/}
											{/*							}}*/}
											{/*							error={errors.serial_numbers?.[index]?.message}*/}
											{/*							{...register(`serial_numbers.${index}`)}*/}
											{/*						/>*/}
											{/*					</div>*/}
											{/*				))*/}
											{/*			}*/}
											{/*		</div>*/}
											{/*		<div className="span-12 flex gap-lg">*/}
											{/*			<Button*/}
											{/*				theme={BUTTON_THEME.OUTLINE}*/}
											{/*				type="button"*/}
											{/*				disabled={(watch('serial_numbers')?.length !== 0 && watch('serial_numbers')?.[(watch('serial_numbers')?.length ?? 1) - 1]?.toString()?.trim() === '')}*/}
											{/*				icon={<Plus/>}*/}
											{/*				onClick={() => {*/}
											{/*					// setValue('unit_quantity', String(fields?.length + 1))*/}
											{/*					append('')*/}
											{/*				}}*/}
											{/*			>*/}
											{/*				Add series*/}
											{/*			</Button>*/}
											{/*			<FileUploader*/}
											{/*				type="txt"*/}
											{/*				handleOnChange={(arr) => setValue('serial_numbers', Array.isArray(arr) ? Array.from(new Set(arr)) : [])}*/}
											{/*				value={undefined}*/}
											{/*				id="series"*/}
											{/*			/>*/}
											{/*		</div>*/}
											{/*	</>*/}
											{/*}*/}
										</> :
										<div style={{flex: '6'}}></div>
							}
						</div>

						<div className="span-12">
							<div className={styles.title}>{t('Products')}</div>
							{/*<HR style={{marginBottom: '1rem'}}/>*/}
							<ReactTable columns={columns} data={temporaryList} isLoading={isTemporaryListFetching}/>
							<HR style={{marginBottom: '1rem'}}/>
						</div>
					</div>
				</div>
				{
					validationData?.is_serial &&
					<div className="span-3">
						<div className="grid gap-lg">
							<div className="flex gap-lg span-12">
								<Input
									className="flex-1"
									id="serial_numbers"
									label="Series"
									disabled={!validationData?.is_serial}
									value={series}
									onChange={(e) => {
										setSeries(e.target.value)
									}}
									onKeyDown={handleSeriesKeyDown}
								/>
								<div className="gap-md flex align-end">
									<Button
										style={{marginTop: 'auto'}}
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
												style={{marginTop: 'auto'}}
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
							<div className="span-12"
							     style={{paddingBottom: '.5rem', maxHeight: '25rem', overflowY: 'auto'}}>
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
						</div>
					</div>
				}
			</div>
		</Form>
	)
}

export default Index