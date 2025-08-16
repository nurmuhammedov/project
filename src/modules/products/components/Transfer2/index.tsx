import {yupResolver} from '@hookform/resolvers/yup'
import classNames from 'classnames'
import {
	Button,
	Card,
	Form,
	Input,
	Loader,
	MaskInput,
	NumberFormattedInput,
	PageTitle,
	ReactTable,
	Select
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {useAdd, useData, useDetail, useSearchParams, useUpdate} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {StockItemSchema} from 'modules/products/helpers/yup'
import {
	IPurchaseItem
} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {
	decimalToInteger,
	getSelectValue, sumDecimals
} from 'utilities/common'
import {getDate} from 'utilities/date'
import styles from '../Purchase/styles.module.scss'
import {Column} from 'react-table'
import Filter from 'components/Filter'
import {IStockItem} from 'modules/products/interfaces'


interface IProperties {
	detail?: boolean;
	edit?: boolean;
}

const Index: FC<IProperties> = ({detail: retrieve = false, edit = false}) => {
	const {t} = useTranslation()
	const {removeParams, paramsObject} = useSearchParams()
	const {id: transferId = undefined} = useParams()
	const navigate = useNavigate()
	const {mutateAsync, isPending: isAdding} = useAdd('movements/parties/create-purchase-item')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('movements/parties/', transferId, 'put')
	const {store} = useTypedSelector((state) => state.stores)
	const {data: stores = []} = useData<ISelectOption[]>('stores/select', true)

	const {data: transferDetail, isPending: isTransferDetailLoading} =
		useDetail<IPurchaseItem>('movements/parties/', transferId, !!(transferId && (retrieve || edit)))


	const {
		data: purchases = [],
		isFetching,
		refetch
	} = useDetail<IStockItem[]>(`stores/${store?.value}/`, 'purchase-items/residues', !!store?.value, {
		...paramsObject,
		type: paramsObject?.product_type,
		supplier: paramsObject?.customer
	})

	const {
		reset,
		control,
		register,
		handleSubmit,
		setFocus,
		watch,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			comment: '',
			to_store: undefined,
			date: getDate(),
			data: []
		},
		resolver: yupResolver(StockItemSchema)
	})

	const columns: Column<IStockItem>[] = useMemo(
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
				Header: t('Full name'),
				accessor: row => row?.supplier_name,
				ordering: 'supplier_name'
			},
			{
				Header: t('Product'),
				accessor: row => `${row?.product_name}${row?.brand_name ? ` (${row?.brand_name})` : ``}`,
				ordering: 'product_name'
			},
			{
				Header: t('Type'),
				accessor: row => row?.type_name || '',
				ordering: 'type_name'
			},
			{
				Header: t('Date'),
				accessor: row => getDate(row?.purchase_date),
				ordering: 'purchase_date'
			},
			{
				Header: t('Quantity'),
				accessor: (row: IStockItem, index: number) => {
					return (
						<Controller
							control={control}
							name={`data.${index}.quantity`}
							render={({field, fieldState: {error}}) => (
								<NumberFormattedInput
									disabled={retrieve}
									{...field}
									id={`temp_quantity_input_${row.id}`}
									placeholder={t('Quantity')}
									allowDecimals={false}
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
				accessor: (row, index) => edit ? decimalToInteger(Number(row?.quantity || 0) + Number(watch('data')?.[index]?.quantity || 0)) : decimalToInteger(row?.quantity),
				style: {
					whiteSpace: 'nowrap'
				},
				ordering: 'quantity'
			}
		],
		[watch('data'), edit]
	)

	useEffect(() => {
		if (transferDetail && (retrieve || edit)) {
			reset({
				comment: transferDetail?.comment ?? '',
				to_store: transferDetail?.to_store?.id ?? undefined,
				date: getDate(transferDetail.date)
			})
		}
	}, [transferDetail, retrieve, edit, reset])

	useEffect(() => {
		if (store?.value && !retrieve && !edit) {
			setTimeout(() => {
				setFocus('to_store')
			}, 0)
			reset({
				comment: '',
				to_store: undefined,
				date: getDate()
			})
		}
	}, [store?.value, retrieve, edit, setFocus, reset])


	useEffect(() => {
		if (purchases?.length) {
			reset((prev) => ({
				...prev,
				data: purchases?.map(i => ({
					purchase_item: i?.id,
					quantity: ''
				}))
			}))
		}
	}, [purchases, isFetching])

	if (isTransferDetailLoading && (retrieve || edit)) {
		return <Loader/>
	}

	return (
		<>
			<PageTitle title={edit ? t('Edit') : t('Swap')}>
				<div className="flex align-center gap-lg">
					<Button onClick={() => navigate(-1)} theme={BUTTON_THEME.DANGER_OUTLINE}>
						{t('Back')}
					</Button>
				</div>
			</PageTitle>
			<Card
				shadow={true}
				screen={true}
				style={{padding: '.5rem 1.5rem 1.5rem'}}
				className={classNames(styles.root)}
			>
				<div className={classNames('grid gap-lg')} style={{paddingTop: '.5rem', marginBottom: '1rem'}}>
					<div className="flex gap-lg span-12 flex-wrap">
						<div className="flex-5" style={{minWidth: '200px'}}>
							<Controller
								name="to_store"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										isDisabled={retrieve}
										id="to_store"
										label="To store"
										redLabel
										onBlur={onBlur}
										options={stores.filter((s) => s.value !== store?.value)}
										error={errors.to_store?.message}
										value={getSelectValue(stores, value)}
										defaultValue={getSelectValue(stores, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="flex-3" style={{minWidth: '150px'}}>
							<Controller
								name="date"
								control={control}
								render={({field}) => (
									<MaskInput
										id="date"
										disabled={retrieve}
										label="Date"
										redLabel
										placeholder={getDate()}
										mask="99.99.9999"
										error={errors?.date?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="flex-4" style={{minWidth: '200px'}}>
							<Input
								id="comment"
								label="Comment"
								redLabel={true}
								disabled={retrieve}
								error={errors?.comment?.message}
								{...register(`comment`)}
							/>
						</div>
					</div>

					<div className="span-12">
						<Form onSubmit={(e) => e.preventDefault()}>
							<div className="grid gap-lg">
								<div className="span-12">
									<Filter fieldsToShow={['search', 'product_type', 'brand', 'customer']}/>
								</div>
								<div className="span-12">
									<div className="flex gap-lg align-center justify-between">
										<div className={styles['price-wrapper']}>
											<div className={styles.price}>
												<p>{`${t('Products all count')}`}:</p>
												<span>{decimalToInteger(sumDecimals(((edit || retrieve) ? [] : watch('data'))?.map(i => i?.quantity ?? '0.00') ?? []))}</span>
											</div>
										</div>
									</div>
									<ReactTable
										columns={columns}
										data={purchases}
										isLoading={isFetching}

									/>
								</div>
							</div>
						</Form>
					</div>
				</div>

				<div className={styles.footer}>
					{!retrieve && (
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.BUTTON}
							theme={BUTTON_THEME.PRIMARY}
							onClick={handleSubmit((data) => {
								if (edit) {
									update({
										...data,
										from_store: store?.value ? Number(store.value) : null,
										to_store: transferDetail?.to_store?.id
									}).then(async () => {
										navigate(-1)
										await refetch?.()
									})
								} else {
									// eslint-disable-next-line @typescript-eslint/no-unused-vars
									const {data: m, ...rest} = data
									mutateAsync({
										...rest,
										quantities: data?.data?.filter(i => !!i?.quantity),
										from_store: store?.value ? Number(store.value) : null
									}).then(async () => {
										removeParams('updateId', 'type')
										reset({
											comment: '',
											data: [],
											to_store: undefined,
											date: getDate()
										})
										await refetch?.()
									})
								}
							})}
							disabled={isAdding || isUpdating || ((watch('data')?.length || 0) < 1 && !edit)}
						>
							{edit ? t('Edit') : t('Swap')}
						</Button>
					)}
				</div>
			</Card>
		</>
	)
}

export default Index