import {
	Button,
	Card,
	Checkbox, DeleteModal,
	Input, Loader,
	MaskInput,
	NumberFormattedInput, PageTitle,
	Select
} from 'components'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import AddPurchase from 'modules/products/components/AddPurchase'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {purchaseItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {decimalToInteger, decimalToPrice, findName, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {useNavigate, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {FC, useEffect} from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {removeParams} = useSearchParams()
	const {id = undefined} = useParams()
	const navigate = useNavigate()
	const {mutateAsync, isPending: isAdding} = useAdd('purchases')
	const {store} = useTypedSelector(state => state.stores)

	const {
		data: purchase,
		isPending: isPurchaseLoading
	} = useDetail<IPurchaseItem>('purchases/', id, !!(id && retrieve))

	const {
		watch,
		reset,
		control,
		register,
		handleSubmit,
		trigger,
		setFocus,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			cost_currency: undefined,
			cost_amount: '',
			comment: '',
			store: store?.value ? Number(store?.value) : undefined,
			currency: undefined,
			supplier: undefined,
			purchase_date: getDate()
		},
		resolver: yupResolver(purchaseItemSchema)
	})
	const {data: clients = []} = useData<ISelectOption[]>('customers/select', !!watch('store'), {store: watch('store')})

	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<ITemporaryListItem[]>('temporaries', !!watch('supplier') && !retrieve, {supplier: watch('supplier')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useData<ICustomerShortData>(`customers/${watch('supplier')}/short-data`, !!watch('supplier') && !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve) {
			reset((prevValues) => ({
				...prevValues,
				cost_currency: detail?.currency ?? undefined,
				price_type: detail?.price_type?.id ?? undefined,
				currency: detail?.currency ?? undefined,
				purchase_date: getDate(),
				cost_amount: '0'
			}))
		}
	}, [detail, retrieve])

	useEffect(() => {
		if (store?.value && !retrieve) {
			setTimeout(() => {
				setFocus('supplier')
			}, 0)
			reset({
				cost_currency: undefined,
				cost_amount: '',
				comment: '',
				store: store?.value ? Number(store?.value) : undefined,
				currency: undefined,
				supplier: undefined,
				purchase_date: getDate()
			})
		}
	}, [store?.value, retrieve])

	useEffect(() => {
		if (purchase && !isPurchaseLoading && retrieve) {
			reset((prevValues) => ({
				...prevValues,
				supplier: purchase?.supplier?.id ?? undefined,
				cost_currency: purchase?.cost_currency ?? undefined,
				store: purchase?.store?.id ?? undefined,
				// price_type: purchase?.price_type?.id ?? undefined,
				currency: purchase?.currency ?? undefined,
				purchase_date: purchase?.purchase_date ? getDate(purchase.purchase_date) : getDate(),
				cost_amount: purchase?.cost_amount ?? undefined,
				comment: purchase?.comment ?? undefined,
				isExpanseExist: !!purchase?.cost_amount
			}))
		}
	}, [purchase, isPurchaseLoading, retrieve])

	if (isPurchaseLoading && retrieve) {
		return <Loader/>
	}

	return (
		<>
			<PageTitle
				title={t('Trade (income)')}
			>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
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
				<div className={classNames('grid gap-lg')} style={{paddingTop: '.5rem'}}>
					{/*<div className="span-12">*/}
					{/*	<CardTab*/}
					{/*		disabled={retrieve}*/}
					{/*		fallbackValue={productExchangeTabOptions[0]?.value}*/}
					{/*		tabs={[{*/}
					{/*			label: 'Making income',*/}
					{/*			value: 'purchase',*/}
					{/*			color: 'var(--teal-green)'*/}
					{/*		}]}*/}
					{/*	/>*/}
					{/*</div>*/}


					<div className="flex gap-lg span-12">

						<div className="flex-5">
							<Controller
								name="supplier"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="supplier"
										label="Customer"
										onBlur={onBlur}
										options={clients}
										isDisabled={retrieve}
										error={errors.supplier?.message}
										value={getSelectValue(clients, value)}
										defaultValue={getSelectValue(clients, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>


						<div className="flex-3">
							<Controller
								name="currency"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="currency"
										label="Currency"
										onBlur={onBlur}
										isDisabled={retrieve}
										options={currencyOptions}
										error={errors.currency?.message}
										value={getSelectValue(currencyOptions, value)}
										defaultValue={getSelectValue(currencyOptions, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>
						{
							!!watch('isExpanseExist') &&
							<>
								<div className="flex-3">
									<Controller
										name="cost_currency"
										control={control}
										render={({field: {value, ref, onChange, onBlur}}) => (
											<Select
												ref={ref}
												id="cost_currency"
												label="Expense currency"
												onBlur={onBlur}
												isDisabled={retrieve || !watch('isExpanseExist')}
												options={currencyOptions}
												error={errors.cost_currency?.message}
												value={getSelectValue(currencyOptions, value)}
												defaultValue={getSelectValue(currencyOptions, value)}
												handleOnChange={(e) => onChange(e as string)}
											/>
										)}
									/>
								</div>

								<div className="flex-3">
									<Controller
										control={control}
										name="cost_amount"
										render={({field}) => (
											<NumberFormattedInput
												id="cost_amount"
												maxLength={13}
												disableGroupSeparators={false}
												disabled={retrieve || !watch('isExpanseExist')}
												allowDecimals={true}
												label={watch('cost_currency') ? t('Expense quantity in', {currency: t(findName(currencyOptions, watch('cost_currency'))).toLowerCase() ?? ''}) : 'Expense quantity'}
												error={errors?.cost_amount?.message}
												{...field}
											/>
										)}
									/>
								</div>

							</>
						}
						<div className="flex-3">
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

						<div className="flex-4">
							<Input
								id="comment"
								label={`Comment`}
								disabled={retrieve}
								error={errors?.comment?.message}
								{...register(`comment`)}
							/>
						</div>
						<div className="flex-1 flex align-end">
							<Checkbox
								id="isExpanseExist"
								title="Expense"
								disabled={retrieve}
								{...register('isExpanseExist')}
							/>
						</div>
					</div>

					<div className="span-12">
						<AddPurchase
							clientId={watch('supplier')}
							trigger={trigger}
							detail={retrieve}
							focus={setFocus}
							detailItems={purchase?.items ?? []}
							temporaryList={temporaryList}
							isTemporaryListFetching={retrieve ? isPurchaseLoading : isTemporaryListFetching}
							refetchTemporaryList={refetchTemporaryList}
						/>
					</div>
				</div>

				<div className={styles.footer}>
					{
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.BUTTON}
							onClick={
								handleSubmit((data) => {
									mutateAsync({
										...data,
										store: store?.value ? Number(store?.value) : null,
										temporary_items: temporaryList?.map(i => i?.id)
									}).then(async () => {
										removeParams('updateId', 'type')
										reset({
											cost_currency: undefined,
											cost_amount: '',
											comment: '',
											store: store?.value ? Number(store?.value) : undefined,
											currency: undefined,
											supplier: undefined,
											purchase_date: getDate()
										})
										await refetchTemporaryList()
									})
								})}
							disabled={isAdding || retrieve || temporaryList?.length < 1}
						>
							{t(productExchangeTabOptions[0]?.label)}
						</Button>
					}

					<div className={styles['price-wrapper']}>
						<div className={styles.price}>
							<p>{`${t('Total')}`}:</p>
							<span>{decimalToInteger(sumDecimals((retrieve ? purchase?.items : temporaryList)?.map(i => i?.unit_quantity ?? '0.00') ?? []))}</span>
						</div>
						<div className={styles.price}>
							<p>{t('Products')}:</p>
							<span>{decimalToPrice(sumDecimals((retrieve ? purchase?.items : temporaryList)?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == (retrieve ? purchase?.currency : watch('currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
						</div>
						<div className={styles.price}>
							<p>{t('Expense quantity')}:</p>
							<span>{decimalToPrice(retrieve ? purchase?.cost_amount || '0' : watch('cost_amount') || '0')} {t(currencyOptions?.find(i => i?.value == (retrieve ? purchase?.cost_currency : watch('cost_currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
						</div>
					</div>
				</div>
			</Card>
			{
				!retrieve &&
				<DeleteModal
					endpoint="temporaries/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
		</>
	)
}

export default Index