import {yupResolver} from '@hookform/resolvers/yup'
import {Delete, Edit, Plus} from 'assets/icons'
import {
	Button,
	Loader,
	ReactTable,
	EditButton,
	DeleteButton,
	Form
} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import {
	useAdd,
	useData,
	useDelete,
	useDetail,
	useSearchParams,
	useUpdate
} from 'hooks'
import styles from 'modules/products/components/Purchase/styles.module.scss'
import {temporaryTransferItemSchema, transferItemSchema} from 'modules/products/helpers/yup'
import {
	ITemporaryListItem,
	IValidationData
} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect, useMemo} from 'react'
import {
	useForm,
	UseFormSetFocus,
	UseFormTrigger
} from 'react-hook-form'
import {Column} from 'react-table'
import {cleanParams, decimalToInteger, getSelectOptionsWithBrandName, getSelectValue} from 'utilities/common'
import {ISelectOption} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import {ISearchParams} from 'interfaces/params.interface'
import {
	Controller
} from 'react-hook-form'
import {
	Select,
	NumberFormattedInput
} from 'components'
import {measurementUnits} from 'modules/database/helpers/options'
import {InferType} from 'yup'
import useTypedSelector from 'hooks/useTypedSelector'


interface IProperties {
	refetchTemporaryList?: () => void;
	isTemporaryListFetching: boolean;
	detailItems?: ITemporaryListItem[];
	temporaryList?: ITemporaryListItem[];
	focus?: UseFormSetFocus<InferType<typeof transferItemSchema>>;
	trigger?: UseFormTrigger<InferType<typeof transferItemSchema>>;
	detail?: boolean;
}

const AddTransfer: FC<IProperties> = ({
	                                      refetchTemporaryList,
	                                      detailItems,
	                                      temporaryList,
	                                      isTemporaryListFetching,
	                                      detail: retrieve = false
                                      }) => {
	const {t} = useTranslation()
	const {
		removeParams,
		paramsObject: {updateId = undefined}
	} = useSearchParams()
	const {mutateAsync: del, isPending: isDeleteLoading} = useDelete(
		'movements/temporaries/'
	)
	const {store} = useTypedSelector(state => state.stores)

	const {data: products = []} = useData<ISelectOption[]>(
		'products/select',
		!retrieve
	)

	const columns: Column<ITemporaryListItem>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_, index: number) => index + 1,
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
				Header: t('Count'),
				accessor: (row) =>
					`${decimalToInteger(row?.total_quantity)} ${t(
						measurementUnits.find((i) => i.id == row.product.measure)?.label?.toString() ||
						''
					)}`
			},
			...(!retrieve
				? [
					{
						Header: t('Actions'),
						accessor: (row: ITemporaryListItem) => (
							<div className="flex items-start gap-lg">
								<EditButton id={row.id}/>
								<DeleteButton
									onDelete={() =>
										!isDeleteLoading &&
										del(row?.id).then(() => refetchTemporaryList?.())
									}
								/>
							</div>
						),
						style: {
							width: '5rem'
						}
					}
				]
				: [])
		],
		[isDeleteLoading, retrieve, t, refetchTemporaryList, del]
	)

	const {
		handleSubmit,
		watch,
		reset,
		control,
		setFocus,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			unit_quantity: '1',
			product: undefined
		},
		resolver: yupResolver(temporaryTransferItemSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('movements/temporaries')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate(
		'movements/temporaries/',
		updateId
	)

	const {data: detail, isPending: isDetailLoading} =
		useDetail<ITemporaryListItem>(
			'movements/temporaries/',
			updateId,
			!retrieve
		)

	const {data: validationData, isFetching: isValidationDataFetching} =
		useDetail<IValidationData>(
			'products/val-data/',
			watch('product'),
			!retrieve
		)

	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve) {
			reset({
				product: detail.product.id,
				unit_quantity: decimalToInteger(detail.total_quantity)
			})
		}
	}, [detail, isDetailLoading, retrieve, reset])

	const onSubmit = () => {
		handleSubmit((data) => {
			if (updateId) {
				const newData = {
					product: data?.product,
					unit_quantity: data?.unit_quantity,
					from_store: store?.value,
					temp_quantities: []
				}
				update(cleanParams(newData as unknown as ISearchParams)).then(
					async () => {
						removeParams('updateId')
						reset({unit_quantity: '1', product: undefined})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						refetchTemporaryList?.()
					}
				)
			} else {
				const newData = {
					product: data?.product,
					unit_quantity: data?.unit_quantity,
					from_store: store?.value,
					temp_quantities: []
				}
				mutateAsync(cleanParams(newData as unknown as ISearchParams)).then(
					async () => {
						reset({unit_quantity: '1', product: undefined})
						setTimeout(() => {
							setFocus('product')
						}, 0)
						removeParams('modal')
						refetchTemporaryList?.()
					}
				)
			}
		})()
	}

	return (
		<Form onSubmit={(e) => e.preventDefault()}>
			<div className="grid gap-lg">
				<div className={'span-12'}>
					<div className="grid gap-lg">
						{!retrieve && (
							<div className="flex gap-lg span-12">
								<div className={'flex-5'}>
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
												value={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												defaultValue={getSelectValue(getSelectOptionsWithBrandName(products), value)}
												isDisabled={!!updateId || retrieve}
												error={errors.product?.message}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)}
									/>
								</div>

								{isValidationDataFetching ? (
									<div style={{flex: '6'}}>
										<Loader/>
									</div>
								) : validationData ? (
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
														allowDecimals={false}
														maxLength={6}
														error={errors?.unit_quantity?.message}
														label={`${t('Count')} (${t(
															measurementUnits
																.find((i) => i.id == validationData?.measure)
																?.label?.toString() || ''
														)})`}
														{...field}
													/>
												)}
											/>
										</div>
										{!retrieve && (
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
															unit_quantity: '1',
															product: undefined
														})
													}}
												/>
											</div>
										)}
									</>
								) : (
									<div style={{flex: '6'}}></div>
								)}
							</div>
						)}

						<div className="span-12">
							<div className={styles.title}>{t('Products')}</div>
							<ReactTable
								columns={columns}
								data={retrieve ? detailItems ?? [] : temporaryList ?? []}
								isLoading={isTemporaryListFetching}
							/>
						</div>
					</div>
				</div>
			</div>
		</Form>
	)
}

export default AddTransfer