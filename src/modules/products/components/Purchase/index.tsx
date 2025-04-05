import AddPurchase from 'modules/products/components/AddPurchase'
import {productExchangeTabOptions} from 'helpers/options'
import {
	Button,
	Card,
	CardTab,
	DeleteModal,
	Form,
	Input,
	Loader,
	MaskInput,
	NumberFormattedInput,
	Select,
	TemporaryItem
} from 'components'
import {decimalToPrice, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {purchaseItemSchema} from 'helpers/yup'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {IIDName} from 'interfaces/configuration.interface'
import {getSelectOptions, getSelectOptionsByKey} from 'utilities/select'
import {ISearchParams} from 'interfaces/params.interface'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {IPurchaseListItem, TemporaryListItem} from 'interfaces/products.interface'
import {IClientItemDetail} from 'interfaces/clients.interface'
import {FC, useEffect} from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import HR from 'components/HR'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {addParams, removeParams} = useSearchParams()
	const {id: clientId = undefined, productId = undefined} = useParams()
	const {data: clients = []} = useData<ISearchParams[]>('customer/select/')
	const {mutateAsync, isPending: isAdding} = useAdd('purchase/create')

	const {
		data: purchase,
		isPending: isPurchaseLoading
	} = useDetail<IPurchaseListItem>('purchase/detail/', productId, !!(productId && retrieve))


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
			purchase_date: ''
		},
		resolver: yupResolver(purchaseItemSchema)
	})

	const {data: currencies = []} = useData<IIDName[]>('currency/select/', !!watch('supplier'))
	const {data: stores = []} = useData<IIDName[]>('stores/select/', !!watch('supplier'))
	const {data: priceTypes = []} = useData<IIDName[]>('/organization/price-type/select/', !!watch('supplier'))


	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<TemporaryListItem[]>('temporary/list', !!watch('supplier') && !retrieve, {supplier: watch('supplier')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IClientItemDetail>('customer/detail/', watch('supplier'), !!watch('supplier') && !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset((prevValues) => ({
				...prevValues,
				cost_currency: detail?.currency?.id ?? undefined,
				store: detail?.store?.id ?? undefined,
				price_type: detail?.price_type?.id ?? undefined,
				currency: detail?.currency?.id ?? undefined,
				purchase_date: getDate() ?? undefined,
				cost_amount: '0'
			}))
		}
	}, [detail])

	useEffect(() => {
		if (purchase && !isPurchaseLoading) {
			reset((prevValues) => ({
				...prevValues,
				supplier: purchase?.supplier?.id ?? undefined,
				cost_currency: purchase?.currency?.id ?? undefined,
				store: purchase?.store?.id ?? undefined,
				price_type: purchase?.price_type?.id ?? undefined,
				currency: purchase?.currency?.id ?? undefined,
				purchase_date: purchase?.purchase_date ? getDate(purchase.purchase_date) : getDate(),
				cost_amount: purchase?.cost_amount ?? undefined,
				comment: purchase?.comment ?? undefined
			}))
		}
	}, [purchase])


	return (
		<div className={classNames(styles.root, 'grid gap-lg  flex-1')}>

			<div className="span-8 flex-1">
				<Card shadow={true} style={{padding: '2.25rem'}}>
					<CardTab
						disabled={retrieve}
						style={{marginBottom: '1.5rem'}}
						fallbackValue={productExchangeTabOptions[0]?.value}
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
						<div className="grid gap-lg">
							<div className="span-12">
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
											options={getSelectOptionsByKey(clients, 'full_name')}
											error={errors.supplier?.message}
											value={getSelectValue(getSelectOptionsByKey(clients, 'full_name'), value)}
											defaultValue={getSelectValue(getSelectOptionsByKey(clients, 'full_name'), value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>

							<div className="span-12" style={{paddingBottom: '.5rem'}}>
								<div className={styles.title}>{t('Products')}</div>
								<HR style={{marginBottom: '1rem'}}/>
								{

									retrieve && purchase && purchase.items.length > 0 ?
										<div className="grid gap-lg">
											{
												purchase?.items?.map((item) => (
													<div className="span-12" key={item.id}>
														<TemporaryItem
															handleDetail={() => addParams({updateId: item?.id}, 'type')}
															name={item?.product?.name}
															price={item?.total_price}
															quantity={item?.total_quantity}
															integer={item?.product?.measure?.value_type == 'int'}
															measure={item?.product?.measure?.name}
															expiry={item?.expiry_date || ''}
															currency={currencies?.find(i => i?.id == watch('currency'))?.code}
														/>
													</div>
												))
											}
										</div> :
										isTemporaryListFetching ?
											<div>
												<Loader/>
											</div> :
											temporaryList && temporaryList.length > 0 ?
												<div className="grid gap-lg">
													{
														temporaryList?.map((item) => (
															<div className="span-12" key={item.id}>
																<TemporaryItem
																	name={item?.product?.name}
																	handleDelete={() => addParams({
																		modal: 'delete',
																		deleteId: item?.id
																	})}
																	handleDetail={() => addParams({updateId: item?.id}, 'type')}
																	price={item?.total_price}
																	quantity={item?.total_quantity}
																	integer={item?.product?.measure?.value_type == 'int'}
																	measure={item?.product?.measure?.name}
																	expiry={item?.expiry_date || ''}
																	currency={currencies?.find(i => i?.id == watch('currency'))?.code}
																/>
															</div>
														))
													}
												</div> :
												<div className={styles['not-found']}>{t('Noting found')}</div>
								}
							</div>

							{
								(detail || purchase) &&
								<>
									<div className="span-6">
										<Controller
											name="store"
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													id="store"
													label="Store"
													options={getSelectOptions(stores)}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors.store?.message}
													value={getSelectValue(getSelectOptions(stores), value)}
													defaultValue={getSelectValue(getSelectOptions(stores), value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>

									<div className="span-6">
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

									<div className="span-6">
										<Controller
											name="currency"
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													top={true}
													id="currency"
													label="Currency"
													options={getSelectOptions(currencies)}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors.currency?.message}
													value={getSelectValue(getSelectOptions(currencies), value)}
													defaultValue={getSelectValue(getSelectOptions(currencies), value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>

									<div className="span-6">
										<Controller
											name="price_type"
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													top={true}
													id="price_type"
													label="Price type"
													options={getSelectOptions(priceTypes)}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors.price_type?.message}
													value={getSelectValue(getSelectOptions(priceTypes), value)}
													defaultValue={getSelectValue(getSelectOptions(priceTypes), value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>


									<div className="span-6">
										<Controller
											name="cost_currency"
											control={control}
											render={({field: {value, ref, onChange, onBlur}}) => (
												<Select
													ref={ref}
													top={true}
													id="cost_currency"
													label="Expense currency"
													options={getSelectOptions(currencies)}
													onBlur={onBlur}
													isDisabled={retrieve}
													error={errors.cost_currency?.message}
													value={getSelectValue(getSelectOptions(currencies), value)}
													defaultValue={getSelectValue(getSelectOptions(currencies), value)}
													handleOnChange={(e) => onChange(e as string)}
												/>
											)}
										/>
									</div>

									<div className="span-6">
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
													label={watch('cost_currency') ? t('Expense quantity in', {currency: currencies?.find(i => i?.id == watch('cost_currency'))?.name?.toLowerCase() ?? ''}) : 'Expense quantity'}
													error={errors?.cost_amount?.message}
													{...field}
												/>
											)}
										/>
									</div>

									<div className="span-12">
										<div className="span-12">
											<Input
												id="comment"
												label={`Comment`}
												disabled={retrieve}
												error={errors?.comment?.message}
												{...register(`comment`)}
											/>
										</div>
									</div>

									<HR/>

									<div className={styles.footer}>
										<div className={styles['price-wrapper']}>
											<div className={styles.price}>
												<p>{t('Products')}:</p>
												{
													retrieve ?
														<span>{decimalToPrice(sumDecimals(purchase?.items?.map(i => i?.total_price ?? '0.00') ?? []))} {purchase?.currency?.code || ''}</span> :
														<span>{decimalToPrice(sumDecimals(temporaryList?.map(i => i?.total_price ?? '0.00') ?? []))} {currencies?.find(i => i?.id == watch('currency'))?.code ?? ''}</span>
												}
											</div>
											<div className={styles.price}>
												<p>{t('Expense quantity')}:</p>
												{
													retrieve ?
														<span>{decimalToPrice(purchase?.cost_amount || '0')} {purchase?.cost_currency?.code || ''}</span> :
														<span>{decimalToPrice(watch('cost_amount') || '0')} {currencies?.find(i => i?.id == watch('cost_currency'))?.code ?? ''}</span>
												}
											</div>
										</div>
									</div>
								</>
							}
						</div>
						{
							!retrieve &&
							<Button
								style={{marginTop: 'auto'}}
								type={FIELD.SUBMIT}
								disabled={isAdding || temporaryList?.length < 1}
							>
								Save
							</Button>
						}
					</Form>
				</Card>
			</div>

			<div className="span-4 flex-1">
				<Card shadow={true} style={{padding: '2.25rem'}}>
					<AddPurchase
						detail={retrieve}
						clientId={watch('supplier')}
						refetchTemporaryList={refetchTemporaryList}
					/>
				</Card>
			</div>
			{
				!retrieve &&
				<DeleteModal
					endpoint="temporary/delete/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
		</div>
	)
}

export default Index