import {
	Button,
	Card,
	CardTab, DeleteButton,
	DeleteModal, EditButton, EditModal,
	Form,
	Input,
	MaskInput, Modal,
	NumberFormattedInput, ReactTable,
	Select
} from 'components'
import {currencyOptions} from 'helpers/options'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import {measurementUnits} from 'modules/database/helpers/options'
import AddSale from 'modules/products/components/AddSale'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {Column} from 'react-table'
import {decimalToInteger, decimalToPrice, findName, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {purchaseItemSchema} from 'helpers/yup'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {FC, useEffect, useMemo} from 'react'
import styles from '../Purchase/styles.module.scss'
import classNames from 'classnames'
import HR from 'components/HR'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {removeParams} = useSearchParams()
	const {id: clientId = undefined, productId = undefined} = useParams()
	const {mutateAsync, isPending: isAdding} = useAdd('sale/create')
	const {data: stores = []} = useData<ISelectOption[]>('stores/select')

	const {
		data: purchase,
		isPending: isPurchaseLoading
	} = useDetail<IPurchaseItem>('sale/detail/', productId, !!(productId && retrieve))

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
				accessor: row => row?.product?.name
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
						<DeleteButton id={row.id}/>
					</div>
				)
			}
		],
		[]
	)

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			cost_currency: undefined,
			cost_amount: '',
			comment: '',
			store: undefined,
			price_type: undefined,
			currency: undefined,
			supplier: clientId ? Number(clientId) : undefined,
			purchase_date: getDate()
		},
		resolver: yupResolver(purchaseItemSchema)
	})
	const {data: clients = []} = useData<ISelectOption[]>('customers/select', !!watch('store'), {store: watch('store')})

	const {data: priceTypes = []} = useData<ISelectOption[]>('price-types/select', !!watch('supplier'))

	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<ITemporaryListItem[]>('sale-temporary/list', !!watch('supplier') && !retrieve, {supplier: watch('supplier')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useData<ICustomerShortData>(`customers/${watch('supplier')}/short-data`, !!watch('supplier') && !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset((prevValues) => ({
				...prevValues,
				cost_currency: detail?.currency ?? undefined,
				price_type: detail?.price_type?.id ?? undefined,
				currency: detail?.currency ?? undefined,
				purchase_date: getDate(),
				cost_amount: '0'
			}))
		}
	}, [detail])

	useEffect(() => {
		if (purchase && !isPurchaseLoading) {
			reset((prevValues) => ({
				...prevValues,
				supplier: purchase?.supplier?.id ?? undefined,
				cost_currency: purchase?.currency ?? undefined,
				store: purchase?.store?.id ?? undefined,
				price_type: purchase?.price_type?.id ?? undefined,
				currency: purchase?.currency ?? undefined,
				purchase_date: purchase?.purchase_date ? getDate(purchase.purchase_date) : getDate(),
				cost_amount: purchase?.cost_amount ?? undefined,
				comment: purchase?.comment ?? undefined
			}))
		}
	}, [purchase])


	return (
		<div className={classNames(styles.root, 'grid gap-lg  flex-1')}>
			<Card shadow={true} style={{padding: '2.25rem'}}>
				<CardTab
					disabled={retrieve}
					style={{marginBottom: '1.5rem'}}
					fallbackValue={productExchangeTabOptions[1]?.value}
					tabs={productExchangeTabOptions}
				/>

				<Form
					onSubmit={
						handleSubmit((data) => {
							mutateAsync({
								...data,
								temporary_items: temporaryList?.map(i => i?.id)
							}).then(async () => {
								await refetchTemporaryList()
								removeParams('updateId', 'type')
								setValue('comment', '')
							})
						})}
				>
					<div className="grid gap-lg span-12">

						<div className="span-3">
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
										isDisabled={retrieve}
										error={errors.store?.message}
										value={getSelectValue(stores, value)}
										defaultValue={getSelectValue(stores, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-3">
							<Controller
								name="supplier"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										isDisabled={!!clientId || retrieve}
										id="supplier"
										label="Customer"
										onBlur={onBlur}
										options={clients}
										error={errors.supplier?.message}
										value={getSelectValue(clients, value)}
										defaultValue={getSelectValue(clients, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>


						<div className="span-3">
							<Controller
								name="currency"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="currency"
										label="Currency"
										options={currencyOptions}
										onBlur={onBlur}
										isDisabled={retrieve}
										error={errors.currency?.message}
										value={getSelectValue(currencyOptions, value)}
										defaultValue={getSelectValue(currencyOptions, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-3">
							<Controller
								name="purchase_date"
								control={control}
								render={({field}) => (
									<MaskInput
										id="purchase_date"
										disabled={retrieve}
										label="Date"
										placeholder={getDate()}
										mask="99.99.9999"
										error={errors?.purchase_date?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="span-3">
							<Controller
								name="price_type"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="price_type"
										label="Price type"
										options={priceTypes}
										onBlur={onBlur}
										isDisabled={retrieve}
										error={errors.price_type?.message}
										value={getSelectValue(priceTypes, value)}
										defaultValue={getSelectValue(priceTypes, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>


						<div className="span-3">
							<Controller
								name="cost_currency"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="cost_currency"
										label="Expense currency"
										options={currencyOptions}
										onBlur={onBlur}
										isDisabled={retrieve}
										error={errors.cost_currency?.message}
										value={getSelectValue(currencyOptions, value)}
										defaultValue={getSelectValue(currencyOptions, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-3">
							<Controller
								control={control}
								name="cost_amount"
								render={({field}) => (
									<NumberFormattedInput
										id="cost_amount"
										maxLength={13}
										disableGroupSeparators={false}
										disabled={retrieve}
										allowDecimals={true}
										label={watch('cost_currency') ? t('Expense quantity in', {currency: t(findName(currencyOptions, watch('cost_currency'))).toLowerCase() ?? ''}) : 'Expense quantity'}
										error={errors?.cost_amount?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="span-3">
							<Input
								id="comment"
								label={`Comment`}
								disabled={retrieve}
								error={errors?.comment?.message}
								{...register(`comment`)}
							/>
						</div>

						<div className="span-12" style={{paddingBottom: '.5rem'}}>
							<div className={styles.title}>{t('Products')}</div>
							<HR style={{marginBottom: '1rem'}}/>
							<ReactTable columns={columns} data={temporaryList} isLoading={isTemporaryListFetching}/>
							<HR style={{marginBottom: '1rem'}}/>
						</div>


					</div>

					<div className={styles.footer}>
						<div className={styles['price-wrapper']}>
							<div className={styles.price}>
								<p>{t('Products')}:</p>
								{
									retrieve ?
										<span>{decimalToPrice(sumDecimals(purchase?.items?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == purchase?.currency)?.label?.toString() || '')?.toLowerCase() ?? ''}</span> :
										<span>{decimalToPrice(sumDecimals(temporaryList?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == watch('currency'))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
								}
							</div>
							<div className={styles.price}>
								<p>{t('Expense quantity')}:</p>
								{
									retrieve ?
										<span>{decimalToPrice(purchase?.cost_amount || '0')} {t(currencyOptions?.find(i => i?.value == purchase?.cost_currency)?.label?.toString() || '')?.toLowerCase() ?? ''}</span> :
										<span>{decimalToPrice(watch('cost_amount') || '0')} {t(currencyOptions?.find(i => i?.value == watch('cost_currency'))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
								}
							</div>
						</div>
					</div>


					{
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.SUBMIT}
							theme={BUTTON_THEME.ALERT_DANGER}
							disabled={isAdding || temporaryList?.length < 1}
						>
							Save
						</Button>
					}
				</Form>
			</Card>


			<Modal title="Add a new product" id="product" style={{height: '45rem', width: '60rem'}}>
				<AddSale clientId={watch('supplier')} refetchTemporaryList={refetchTemporaryList}/>
			</Modal>
			<EditModal isLoading={false}>
				<AddSale clientId={watch('supplier')} refetchTemporaryList={refetchTemporaryList}/>
			</EditModal>

			{
				!retrieve &&
				<DeleteModal
					endpoint="sale-temporary/delete/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
		</div>
	)
}

export default Index