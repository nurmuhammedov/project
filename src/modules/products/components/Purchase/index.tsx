import {
	Button,
	Card,
	Checkbox,
	DeleteModal,
	FileUploader,
	Input,
	Loader,
	MaskInput,
	Modal,
	NumberFormattedInput,
	PageTitle, ReactTable,
	Select
} from 'components'
import {currencyOptions} from 'constants/options'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import {interceptor} from 'libraries'
import {ICustomerShortData} from 'modules/dashboard/interfaces'
import AddPurchase from 'modules/products/components/AddPurchase'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {purchaseItemSchema} from 'modules/products/helpers/yup'
import {IPurchaseItem, ITemporaryListItem} from 'modules/products/interfaces/purchase.interface'
import {Column} from 'react-table'
import {showMessage} from 'utilities/alert'
import {decimalToInteger, decimalToPrice, findName, getSelectValue, noop} from 'utilities/common'
import {Controller, useForm} from 'react-hook-form'
import {getDate} from 'utilities/date'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {useAdd, useData, useDetail, useSearchParams, useUpdate} from 'hooks'
import {useNavigate, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {FC, useEffect, useMemo, useState} from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'


interface IProperties {
	detail?: boolean
	edit?: boolean
}

const Index: FC<IProperties> = ({detail: retrieve = false, edit = false}) => {
	const {t} = useTranslation()
	const {removeParams, addParams} = useSearchParams()
	const {id = undefined} = useParams()
	const navigate = useNavigate()
	const {mutateAsync, isPending: isAdding} = useAdd('purchases')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('purchases/', id, 'put')
	const {store} = useTypedSelector(state => state.stores)
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const [exelLoader, setIsLoading] = useState<boolean>(false)
	const [wrongNames, setWrongNames] = useState<ITemporaryListItem[]>([])

	const {
		data: purchase,
		isPending: isPurchaseLoading
	} = useDetail<IPurchaseItem>('purchases/', id, !!(id && (retrieve || edit)))

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
	} = useData<ITemporaryListItem[]>('temporaries', !!watch('supplier') && !retrieve && !edit, {supplier: watch('supplier')})

	const {
		data: detail,
		isPending: isDetailLoading
	} = useData<ICustomerShortData>(`customers/${watch('supplier')}/short-data`, !!watch('supplier') && !retrieve && !edit)

	useEffect(() => {
		if (detail && !isDetailLoading && !retrieve && !edit) {
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
		if (store?.value && !retrieve && !edit) {
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
		if (purchase && !isPurchaseLoading && (retrieve || edit)) {
			reset((prevValues) => ({
				...prevValues,
				supplier: purchase?.supplier?.id ?? undefined,
				cost_currency: purchase?.cost_currency ?? undefined,
				store: purchase?.store?.id ?? undefined,
				currency: purchase?.currency ?? undefined,
				purchase_date: purchase?.purchase_date ? getDate(purchase.purchase_date) : getDate(),
				cost_amount: purchase?.cost_amount ?? undefined,
				comment: purchase?.comment ?? undefined,
				isExpanseExist: Number(purchase?.cost_amount) != 0
			}))
		}
	}, [purchase, isPurchaseLoading, retrieve, edit])

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
				Header: t('Count'),
				accessor: row => decimalToInteger(row?.unit_quantity)
			},
			{
				Header: t('Price'),
				accessor: row => decimalToPrice(row.price)
			}
		],
		[]
	)


	if (isPurchaseLoading && retrieve) {
		return <Loader/>
	}


	return (
		<>
			<PageTitle
				title={edit ? 'Edit' : t('Trade (income)')}
			>
				<div className="flex align-center gap-lg">
					{
						!retrieve && !edit &&
						<>
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
								!watch('supplier') ?
									<Button
										style={{marginTop: 'auto'}}
										disabled={exelLoader}
										mini={true}
										onClick={() => trigger?.(['supplier'])}
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
													wrong_names: ITemporaryListItem[]
												}>(`temporaries/import?supplier=${watch('supplier')}`, formData, {
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
						</>
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
				<div className={classNames('grid gap-lg')} style={{paddingTop: '.5rem', marginBottom: '1rem'}}>
					<div className="flex gap-lg span-12">
						<div className="flex-5">
							<Controller
								name="supplier"
								control={control}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="supplier"
										modalId="customer"
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
										isDisabled={retrieve || edit}
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
							!!watch('isExpanseExist') && !retrieve && !edit &&
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
												isDisabled={retrieve || !watch('isExpanseExist') || edit}
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
												disabled={retrieve || !watch('isExpanseExist') || edit}
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
						{
							!edit && !retrieve &&
							<div className="flex-1 flex align-end">
								<Checkbox
									id="isExpanseExist"
									title="Expense"
									disabled={retrieve}
									{...register('isExpanseExist')}
								/>
							</div>
						}
					</div>

					<div className="span-12">
						<AddPurchase
							clientId={watch('supplier')}
							trigger={trigger}
							detail={retrieve}
							focus={setFocus}
							edit={edit}
							purchase={purchase}
							parentWatch={watch}
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
									if (edit) {
										update({
											comment: data?.comment ?? null,
											purchase_date: data?.purchase_date,
											supplier: data?.supplier
										}).then(async () => {
											navigate(-1)
										})
									} else {
										mutateAsync({
											...data,
											cost_amount: data?.cost_amount ?? '0',
											cost_currency: data?.cost_currency ?? data?.currency,
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
											await refetchTemporaryList?.()
										})
									}
								})}
							disabled={isAdding || isUpdating || retrieve || (temporaryList?.length < 1 && (purchase?.items.length || 0) < 1)}
						>
							{edit ? 'Edit' : t(productExchangeTabOptions[0]?.label)}
						</Button>
					}
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
				!retrieve &&
				<DeleteModal
					endpoint="temporaries/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			}
			{/*<ScrollButton/>*/}
		</>
	)
}

export default Index