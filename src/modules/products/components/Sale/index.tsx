import {
	Button,
	Card,
	CardTab, DeleteButton,
	DeleteModal, EditButton, EditModal,
	Form,
	Input,
	MaskInput,
	Modal,
	ReactTable,
	Select
} from 'components'
import {currencyOptions} from 'constants/options'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import {measurementUnits} from 'modules/database/helpers/options'
import AddSale from 'modules/products/components/AddSale'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {saleItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {Column} from 'react-table'
import {decimalToInteger, decimalToPrice, getSelectValue, sumDecimals} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
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
	const {data: clients = []} = useData<ISelectOption[]>('customers/select')

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
				accessor: row => `${row?.product?.name} (${row?.product?.brand?.name || ''})`
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
			comment: '',
			price_type: undefined,
			currency: undefined,
			customer: clientId ? Number(clientId) : undefined,
			sale_date: getDate()
		},
		resolver: yupResolver(saleItemSchema)
	})

	const {data: priceTypes = []} = useData<ISelectOption[]>('price-types/select', !!watch('customer'))

	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<ITemporaryListItem[]>('sale-temporary/list', !!watch('customer') && !retrieve, {supplier: watch('customer')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useData<ICustomerShortData>(`customers/${watch('customer')}/short-data`, !!watch('customer') && !retrieve)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			reset((prevValues) => ({
				...prevValues,
				price_type: detail?.price_type?.id ?? undefined,
				currency: detail?.currency ?? undefined,
				sale_date: getDate(),
				cost_amount: '0'
			}))
		}
	}, [detail])

	useEffect(() => {
		if (purchase && !isPurchaseLoading) {
			reset((prevValues) => ({
				...prevValues,
				customer: purchase?.supplier?.id ?? undefined,
				store: purchase?.store?.id ?? undefined,
				price_type: purchase?.price_type?.id ?? undefined,
				currency: purchase?.currency ?? undefined,
				sale_date: purchase?.sale_date ? getDate(purchase.sale_date) : getDate(),
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
								sale_temporary_items: temporaryList?.map(i => i?.id)
							}).then(async () => {
								await refetchTemporaryList()
								removeParams('updateId', 'type')
								setValue('comment', '')
							})
						})}
				>
					<div className="grid gap-lg span-12">

						<div className="flex gap-lg">

							<div className="flex-1">
								<Controller
									name="customer"
									control={control}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											isDisabled={!!clientId || retrieve}
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


							<div className="flex-1">
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

							<div className="flex-1">
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

							<div className="flex-1">
								<Input
									id="comment"
									label={`Comment`}
									disabled={retrieve}
									error={errors?.comment?.message}
									{...register(`comment`)}
								/>
							</div>

							<div className="flex-1">
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
							{t(productExchangeTabOptions[1]?.label)}
						</Button>
					}
				</Form>
			</Card>


			<Modal title="Add a new product" id="product" style={{height: '40rem', width: '50rem'}}>
				<AddSale clientId={watch('customer')} refetchTemporaryList={refetchTemporaryList}/>
			</Modal>
			<EditModal isLoading={false}>
				<AddSale clientId={watch('customer')} refetchTemporaryList={refetchTemporaryList}/>
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