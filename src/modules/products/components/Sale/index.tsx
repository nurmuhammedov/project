import {
	Button,
	Card,
	CardTab,
	DeleteModal,
	Input, Loader,
	MaskInput,
	Select
} from 'components'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import AddSale from 'modules/products/components/AddSale'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {saleItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {decimalToInteger, decimalToPrice, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {FC, useEffect} from 'react'
import styles from '../Purchase/styles.module.scss'
import classNames from 'classnames'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {removeParams} = useSearchParams()
	const {id: productId = undefined} = useParams()
	const {mutateAsync, isPending: isAdding} = useAdd('sales')
	const {store} = useTypedSelector(state => state.stores)
	const {data: clients = []} = useData<ISelectOption[]>('customers/select', !!store?.value, {store: store?.value})

	const {
		data: saleDetail,
		isPending: isSaleDetailLoading
	} = useDetail<IPurchaseItem>('sales/', productId, !!(productId && retrieve))


	const {
		watch,
		reset,
		control,
		register,
		handleSubmit,
		setFocus,
		trigger,
		formState: {errors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			comment: '',
			price_type: undefined,
			currency: undefined,
			customer: undefined,
			sale_date: getDate()
		},
		resolver: yupResolver(saleItemSchema)
	})

	const {data: priceTypes = []} = useData<ISelectOption[]>('price-types/select', !!watch('customer') && !retrieve)

	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<ITemporaryListItem[]>('sale-temporaries', !!watch('customer') && !retrieve, {customer: watch('customer')})

	const {
		data: customerDetail,
		isPending: isCustomerDetailLoading
	} = useData<ICustomerShortData>(`customers/${watch('customer')}/short-data`, !!watch('customer') && !retrieve)

	useEffect(() => {
		if (customerDetail && !isCustomerDetailLoading && !retrieve) {
			reset((prevValues) => ({
				...prevValues,
				price_type: customerDetail?.price_type?.id ?? prevValues.price_type,
				currency: customerDetail?.currency ?? prevValues.currency,
				sale_date: getDate()
			}))
		}
	}, [customerDetail, isCustomerDetailLoading, retrieve])

	useEffect(() => {
		if (saleDetail && !isSaleDetailLoading && retrieve) {
			reset((prevValues) => ({
				...prevValues,
				customer: saleDetail?.customer?.id ?? undefined,
				price_type: saleDetail?.price_type?.id ?? undefined,
				currency: saleDetail?.currency ?? undefined,
				sale_date: saleDetail?.sale_date ? getDate(saleDetail.sale_date) : getDate(),
				comment: saleDetail?.comment ?? undefined
			}))
		}
	}, [saleDetail, isSaleDetailLoading, retrieve])

	useEffect(() => {
		if (store?.value && !retrieve) {
			setTimeout(() => {
				setFocus('customer')
			}, 0)
			reset({
				comment: '',
				price_type: undefined,
				currency: undefined,
				customer: undefined,
				sale_date: getDate()
			})
		}
	}, [store?.value, retrieve])

	if (isSaleDetailLoading && retrieve) {
		return <Loader/>
	}

	return (
		<>
			<Card
				shadow={true}
				screen={true}
				style={{padding: '.5rem 1.5rem 1.5rem'}}
				className={classNames(styles.root)}
			>
				<div className={classNames('grid gap-lg')}>

					<div className="span-12">
						<CardTab
							disabled={retrieve}
							fallbackValue={productExchangeTabOptions[1]?.value}
							tabs={productExchangeTabOptions}
						/>
					</div>

					<div className="flex gap-lg span-12 flex-wrap">

						<div className="flex-5" style={{minWidth: '200px'}}>
							<Controller
								name="customer"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										isDisabled={retrieve}
										redLabel={true}
										id="customer"
										label="Customer"
										onBlur={onBlur}
										options={clients}
										error={errors.customer?.message}
										value={getSelectValue(clients, value)}
										defaultValue={getSelectValue(clients, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="flex-3" style={{minWidth: '150px'}}>
							<Controller
								name="currency"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="currency"
										label="Currency"
										redLabel={true}
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

						<div className="flex-3" style={{minWidth: '150px'}}>
							<Controller
								name="price_type"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="price_type"
										label="Price type"
										options={priceTypes}
										redLabel={true}
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

						<div className="flex-3" style={{minWidth: '150px'}}>
							<Controller
								name="sale_date"
								control={control}
								render={({field}) => (
									<MaskInput
										id="sale_date"
										disabled={retrieve}
										label="Date"
										redLabel={true}
										placeholder={getDate()}
										mask="99.99.9999"
										error={errors?.sale_date?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="flex-4" style={{minWidth: '200px'}}>
							<Input
								id="comment"
								label={`Comment`}
								redLabel={true}
								disabled={retrieve}
								error={errors?.comment?.message}
								{...register(`comment`)}
							/>
						</div>
					</div>


					<div className="span-12">
						<AddSale
							clientId={watch('customer')}
							trigger={trigger}
							focus={setFocus}
							detail={retrieve}
							detailItems={saleDetail?.items}
							temporaryList={temporaryList}
							isTemporaryListFetching={retrieve ? isSaleDetailLoading : isTemporaryListFetching}
							refetchTemporaryList={refetchTemporaryList}
							currency={watch('currency')}
						/>
					</div>

				</div>

				<div className={styles.footer} style={{direction: 'rtl'}}>

					{
						!retrieve &&
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.BUTTON}
							theme={BUTTON_THEME.ALERT_DANGER}
							onClick={
								handleSubmit((data) => {
									mutateAsync({
										...data,
										store: store?.value ? Number(store?.value) : null,
										sale_temporary_items: temporaryList?.map(i => i?.id)
									}).then(async () => {
										removeParams('updateId', 'type')
										reset({
											comment: '',
											price_type: undefined,
											currency: undefined,
											customer: undefined,
											sale_date: getDate()
										})
										await refetchTemporaryList()
									})
								})}
							disabled={isAdding || retrieve || temporaryList?.length < 1}
						>
							{t(productExchangeTabOptions[1]?.label)}
						</Button>
					}

					<div className={styles['price-wrapper']} style={{direction: 'ltr'}}>
						<div className={styles.price}>
							<p>{`${t('Total')} ${t('Count')?.toLowerCase()}`}:</p>
							<span>{decimalToInteger(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_quantity ?? '0.00') ?? []))}</span>
						</div>
						<div className={styles.price}>
							<p>{t('Products')}:</p>
							<span>{decimalToPrice(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == (retrieve ? saleDetail?.currency : watch('currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>
						</div>
					</div>
				</div>
			</Card>

			{
				!retrieve && temporaryList?.length > 0 &&
				<DeleteModal
					endpoint="sale-temporaries/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
		</>
	)
}

export default Index