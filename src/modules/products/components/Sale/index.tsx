import {yupResolver} from '@hookform/resolvers/yup'
import classNames from 'classnames'
import {
	Button,
	Card,
	DeleteModal,
	FileUploader,
	Input,
	Loader,
	MaskInput, Modal,
	PageTitle,
	ReactTable,
	Select
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {currencyOptions} from 'constants/options'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import AddSale from 'modules/products/components/AddSale'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {saleItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect, useMemo, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {decimalToInteger, decimalToPrice, getSelectValue, noop} from 'utilities/common'
import {getDate} from 'utilities/date'
import styles from '../Purchase/styles.module.scss'
import {interceptor} from 'libraries/index'
import {showMessage} from 'utilities/alert'
import {Column} from 'react-table'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {removeParams, addParams} = useSearchParams()
	const {id: productId = undefined} = useParams()
	const {mutateAsync, isPending: isAdding} = useAdd('sales')
	const {store} = useTypedSelector(state => state.stores)
	const {data: clients = []} = useData<ISelectOption[]>('customers/select', !!store?.value, {store: store?.value})
	const navigate = useNavigate()
	const [exelLoader, setIsLoading] = useState<boolean>(false)
	const [wrongNames, setWrongNames] = useState<ITemporaryListItem[]>([])
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)

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
				Header: `${t('Name')}/${t('Code')}`,
				accessor: row => `${row?.name}`
			},
			{
				Header: t('Price'),
				accessor: row => decimalToPrice(row.price)
			},
			{
				Header: t('Count'),
				accessor: row => decimalToInteger(row?.unit_quantity)
			}
		],
		[]
	)


	if (isSaleDetailLoading && retrieve) {
		return <Loader/>
	}

	return (
		<>
			<PageTitle
				title={t('Trade (loss)')}
			>
				<div className="flex align-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`temporaries/import?main-column=code`, {
								responseType: 'blob'
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t(`${t('Template')}`)}.xlsx`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						{`${t('Template')} (${t('Code')?.toLowerCase()})`}
					</Button>
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`temporaries/import?main-column=name`, {
								responseType: 'blob'
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t(`${t('Template')}`)}.xlsx`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						{`${t('Template')} (${t('Name')?.toLowerCase()})`}
					</Button>
					{
						!watch('customer') ?
							<Button
								style={{marginTop: 'auto'}}
								disabled={exelLoader}
								mini={true}
								onClick={() => trigger?.(['customer'])}
							>
								Import
							</Button> :
							<FileUploader
								content={
									<Button
										style={{marginTop: 'auto'}}
										disabled={exelLoader}
										mini={true}
									>
										Import
									</Button>
								}
								type="exel"
								handleChange={(files) => {
									const item = files[0]
									setIsLoading(true)
									const formData = new FormData()
									formData.append('xlsx-file', item)
									formData.append('name', item.name)
									interceptor
										.post<{
											wrong_names: ITemporaryListItem[],
											not_enough_quantity: ITemporaryListItem[],
										}>(`sale-temporaries/import?customer=${watch('customer')}&store=${store?.value}`, formData, {
											headers: {
												'Content-Type': 'multipart/form-data'
											}
										})
										.then((response) => {
											refetchTemporaryList().then(noop)
											if (response?.data?.wrong_names?.length) {
												showMessage(`${item.name} ${t('File not accepted')}`, 'error')
												setWrongNames(response?.data?.wrong_names || [])
												addParams({modal: 'wrongNames'})
											} else if (response?.data?.not_enough_quantity?.length) {
												showMessage(`${item.name} ${t('File not accepted')}`, 'error')
												setWrongNames(response?.data?.not_enough_quantity || [])
												addParams({modal: 'wrongNames'})
											} else {
												showMessage(`${t('File successfully accepted')}`, 'success')
											}
										})
										.catch(() => {
											showMessage(`${item.name} ${t('File not accepted')}`, 'error')
										})
										.finally(() => {
											setIsLoading(false)
										})
								}}
								value={undefined}
								id="series"
							/>
					}
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
					{/*		fallbackValue={productExchangeTabOptions[1]?.value}*/}
					{/*		tabs={[{*/}
					{/*			label: 'Making loss',*/}
					{/*			value: 'sale',*/}
					{/*			color: 'var(--red-alert)'*/}
					{/*		}]}*/}
					{/*	/>*/}
					{/*</div>*/}

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
							saleDetail={saleDetail}
							parentWatch={watch}
							detailItems={saleDetail?.items}
							temporaryList={temporaryList}
							isTemporaryListFetching={retrieve ? isSaleDetailLoading : isTemporaryListFetching}
							refetchTemporaryList={refetchTemporaryList}
							currency={watch('currency')}
						/>
					</div>

				</div>

				<div className={styles.footer}>

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

					{/*<div className={styles['price-wrapper']}>*/}
					{/*	<div className={styles.price}>*/}
					{/*		<p>{`${t('Total')} ${t('Count')?.toLowerCase()}`}:</p>*/}
					{/*		<span>{decimalToInteger(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_quantity ?? '0.00') ?? []))}</span>*/}
					{/*	</div>*/}
					{/*	<div className={styles.price}>*/}
					{/*		<p>{t('Products')}:</p>*/}
					{/*		<span>{decimalToPrice(sumDecimals((retrieve ? saleDetail?.items : temporaryList)?.map(i => i?.total_price ?? '0.00') ?? []))} {t(currencyOptions?.find(i => i?.value == (retrieve ? saleDetail?.currency : watch('currency')))?.label?.toString() || '')?.toLowerCase() ?? ''}</span>*/}
					{/*	</div>*/}
					{/*</div>*/}
				</div>
			</Card>
			<Modal
				onClose={() => {
					setWrongNames([])
					removeParams('modal')
				}}
				title="Wrong names"
				id="wrongNames"
				style={{height: '40rem', width: '60rem'}}
			>
				<ReactTable columns={columns} data={wrongNames}/>
			</Modal>
			{
				!retrieve && temporaryList?.length > 0 &&
				<DeleteModal
					endpoint="sale-temporaries/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
			{/*<ScrollButton/>*/}
		</>
	)
}

export default Index