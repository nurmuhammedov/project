import AddPurchase from 'modules/products/components/AddSale'
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
	Select,
	TemporaryItem
} from 'components'
import {decimalToPrice, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {saleItemSchema} from 'helpers/yup'
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
	const {mutateAsync, isPending: isAdding} = useAdd('sale/create')

	const {
		data: sale,
		isPending: isPurchaseLoading
	} = useDetail<IPurchaseListItem>('sale/detail/', productId, !!(productId && retrieve))


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
			comment: '',
			price_type: undefined,
			currency: undefined,
			customer: clientId ? Number(clientId) : undefined,
			sale_date: ''
		},
		resolver: yupResolver(saleItemSchema)
	})

	const {data: currencies = []} = useData<IIDName[]>('currency/select/', !!watch('customer'))
	// const {data: stores = []} = useData<IIDName[]>('stores/select/', !!watch('customer'))
	const {data: priceTypes = []} = useData<IIDName[]>('/organization/price-type/select/', !!watch('customer'))


	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<TemporaryListItem[]>('sale-temporary/list', !!watch('customer') && !retrieve, {customer: watch('customer')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useDetail<IClientItemDetail>('customer/detail/', watch('customer'), !!watch('customer') && !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset((prevValues) => ({
				...prevValues,
				store: detail?.store?.id ?? undefined,
				price_type: detail?.price_type?.id ?? undefined,
				currency: detail?.currency?.id ?? undefined,
				sale_date: getDate() ?? undefined
			}))
		}
	}, [detail])

	useEffect(() => {
		if (sale && !isPurchaseLoading) {
			reset((prevValues) => ({
				...prevValues,
				customer: sale?.customer?.id ?? undefined,
				price_type: sale?.price_type?.id ?? undefined,
				currency: sale?.currency?.id ?? undefined,
				sale_date: sale?.purchase_date ? getDate(sale.purchase_date) : getDate(),
				comment: sale?.comment ?? undefined
			}))
		}
	}, [sale])


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
									sale_temporary_items: temporaryList?.map(i => i?.id)
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
									name="customer"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											isDisabled={!!clientId || retrieve}
											id="customer"
											label="Client"
											onBlur={onBlur}
											options={getSelectOptionsByKey(clients, 'full_name')}
											error={errors.customer?.message}
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

									retrieve && sale && sale.items.length > 0 ?
										<div className="grid gap-lg">
											{
												sale?.items?.map((item) => (
													<div className="span-12" key={item.id}>
														<TemporaryItem
															handleDetail={() => addParams({updateId: item?.id}, 'type')}
															name={item?.product?.name}
															quantity={item?.total_quantity}
															integer={item?.product?.measure?.value_type == 'int'}
															price={item?.total_price}
															measure={item?.product?.measure?.name}
															expiry={item?.expiry_date || ''}
															currency={currencies?.find(i => i?.id == watch('currency'))?.label}
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
																	handleDelete={() => addParams({
																		modal: 'delete',
																		deleteId: item?.id
																	})}
																	name={item?.product?.name}
																	handleDetail={() => addParams({updateId: item?.id}, 'type')}
																	price={item?.total_price}
																	quantity={item?.total_quantity}
																	integer={item?.product?.measure?.value_type == 'int'}
																	measure={item?.product?.measure?.name}
																	expiry={item?.expiry_date || ''}
																	currency={currencies?.find(i => i?.id == watch('currency'))?.label}
																/>
															</div>
														))
													}
												</div> :
												<div className={styles['not-found']}>{t('Noting found')}</div>
								}
							</div>

							{
								(detail || sale) &&
								<>
									{/*<div className="span-6">*/}
									{/*	<Controller*/}
									{/*		name="store"*/}
									{/*		control={control}*/}
									{/*		render={({field: {value, ref, onChange, onBlur}}) => (*/}
									{/*			<Select*/}
									{/*				ref={ref}*/}
									{/*				id="store"*/}
									{/*				label="Store"*/}
									{/*				options={getSelectOptions(stores)}*/}
									{/*				onBlur={onBlur}*/}
									{/*				isDisabled={retrieve}*/}
									{/*				error={errors.store?.message}*/}
									{/*				value={getSelectValue(getSelectOptions(stores), value)}*/}
									{/*				defaultValue={getSelectValue(getSelectOptions(stores), value)}*/}
									{/*				handleOnChange={(e) => onChange(e as string)}*/}
									{/*			/>*/}
									{/*		)}*/}
									{/*	/>*/}
									{/*</div>*/}

									<div className="span-4">
										<Controller
											name="sale_date"
											control={control}
											render={({field}) => (
												<MaskInput
													id="sale_date"
													disabled={retrieve}
													label="Date"
													placeholder={getDate()}
													mask="99.99.9999"
													error={errors?.sale_date?.message}
													{...field}
												/>
											)}
										/>
									</div>

									<div className="span-4">
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

									<div className="span-4">
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


									{/*<div className="span-6">*/}
									{/*	<Controller*/}
									{/*		name="cost_currency"*/}
									{/*		control={control}*/}
									{/*		render={({field: {value, ref, onChange, onBlur}}) => (*/}
									{/*			<Select*/}
									{/*				ref={ref}*/}
									{/*				top={true}*/}
									{/*				id="cost_currency"*/}
									{/*				label="Expense currency"*/}
									{/*				options={getSelectOptions(currencies)}*/}
									{/*				onBlur={onBlur}*/}
									{/*				isDisabled={retrieve}*/}
									{/*				error={errors.cost_currency?.message}*/}
									{/*				value={getSelectValue(getSelectOptions(currencies), value)}*/}
									{/*				defaultValue={getSelectValue(getSelectOptions(currencies), value)}*/}
									{/*				handleOnChange={(e) => onChange(e as string)}*/}
									{/*			/>*/}
									{/*		)}*/}
									{/*	/>*/}
									{/*</div>*/}

									{/*<div className="span-6">*/}
									{/*	<Controller*/}
									{/*		control={control}*/}
									{/*		name="cost_amount"*/}
									{/*		render={({field}) => (*/}
									{/*			<NumberFormattedInput*/}
									{/*				id="cost_amount"*/}
									{/*				maxLength={13}*/}
									{/*				disableGroupSeparators={false}*/}
									{/*				disabled={retrieve}*/}
									{/*				allowDecimals={true}*/}
									{/*				label={watch('cost_currency') ? t('Expense quantity in', {currency: currencies?.find(i => i?.id == watch('cost_currency'))?.name?.toLowerCase() ?? ''}) : 'Expense quantity'}*/}
									{/*				error={errors?.cost_amount?.message}*/}
									{/*				{...field}*/}
									{/*			/>*/}
									{/*		)}*/}
									{/*	/>*/}
									{/*</div>*/}

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
												<p>{t('Total')}:</p>
												{
													retrieve ?
														<span>{decimalToPrice(sumDecimals(sale?.items?.map(i => i?.total_price ?? '0.00') ?? []))} {sale?.currency?.label || ''}</span> :
														<span>{decimalToPrice(sumDecimals(temporaryList?.map(i => i?.total_price ?? '0.00') ?? []))} {currencies?.find(i => i?.id == watch('currency'))?.label ?? ''}</span>
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
						store={detail?.store?.id}
						clientId={watch('customer')}
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