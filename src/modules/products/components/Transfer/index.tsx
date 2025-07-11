import {yupResolver} from '@hookform/resolvers/yup'
import classNames from 'classnames'
import {
	Button,
	Card,
	DeleteModal,
	Input,
	Loader,
	MaskInput,
	Modal,
	PageTitle,
	ReactTable,
	Select
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {useAdd, useData, useDetail, useSearchParams} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import AddTransfer from 'modules/products/components/AddTransfer'
import {transferItemSchema} from 'modules/products/helpers/yup'
import {
	IPurchaseItem,
	ITemporaryListItem
} from 'modules/products/interfaces/purchase.interface'
import {FC, useEffect, useMemo, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {
	decimalToInteger,
	decimalToPrice,
	getSelectValue,
	sumDecimals
} from 'utilities/common'
import {getDate} from 'utilities/date'
import styles from '../Purchase/styles.module.scss'
import {Column} from 'react-table'


interface IProperties {
	detail?: boolean;
}

const Index: FC<IProperties> = ({detail: retrieve = false}) => {
	const {t} = useTranslation()
	const {removeParams} = useSearchParams()
	const {id: transferId = undefined} = useParams()
	const {mutateAsync, isPending: isAdding} = useAdd('movements/parties')
	const {store} = useTypedSelector((state) => state.stores)
	const {data: stores = []} = useData<ISelectOption[]>(
		'stores/select',
		true
	)
	const navigate = useNavigate()
	const [wrongNames, setWrongNames] = useState<ITemporaryListItem[]>([])

	const {data: transferDetail, isPending: isTransferDetailLoading} =
		useDetail<IPurchaseItem>('movements/parties/', transferId, !!(transferId && retrieve))

	const {
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
			to_store: undefined,
			date: getDate()
		},
		resolver: yupResolver(transferItemSchema)
	})

	const {
		data: temporaryList = [],
		isFetching: isTemporaryListFetching,
		refetch: refetchTemporaryList
	} = useData<ITemporaryListItem[]>(
		'movements/temporaries',
		!retrieve,
		{from_store: store?.value}
	)

	useEffect(() => {
		if (store?.value && !retrieve) {
			setTimeout(() => {
				setFocus('to_store')
			}, 0)
			reset({
				comment: '',
				to_store: undefined,
				date: getDate()
			})
		}
	}, [store?.value, retrieve, setFocus, reset])

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
				Header: `${t('Name')}/${t('Code')}`,
				accessor: (row) => `${row?.name}`
			},
			{
				Header: t('Price'),
				accessor: (row) => decimalToPrice(row.price)
			},
			{
				Header: t('Count'),
				accessor: (row) => decimalToInteger(row?.unit_quantity)
			}
		],
		[t]
	)

	if (isTransferDetailLoading && retrieve) {
		return <Loader/>
	}

	return (
		<>
			<PageTitle title="Swap">
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
				<div className={classNames('grid gap-lg')} style={{paddingTop: '.5rem'}}>
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
								label={`Comment`}
								disabled={retrieve}
								error={errors?.comment?.message}
								{...register(`comment`)}
							/>
						</div>
					</div>

					<div className="span-12">
						<AddTransfer
							trigger={trigger}
							focus={setFocus}
							detail={retrieve}
							detailItems={transferDetail?.items}
							temporaryList={temporaryList}
							isTemporaryListFetching={
								retrieve ? isTransferDetailLoading : isTemporaryListFetching
							}
							refetchTemporaryList={refetchTemporaryList}
						/>
					</div>
				</div>

				<div className={styles.footer}>
					{!retrieve && (
						<Button
							style={{marginTop: 'auto'}}
							type={FIELD.BUTTON}
							theme={BUTTON_THEME.PRIMARY}
							onClick={handleSubmit((data) => {
								mutateAsync({
									...data,
									from_store: store?.value ? Number(store?.value) : null,
									temporary_items: temporaryList?.map((i) => i?.id)
								}).then(async () => {
									removeParams('updateId', 'type')
									reset({
										comment: '',
										to_store: undefined,
										date: getDate()
									})
									await refetchTemporaryList()
								})
							})}
							disabled={isAdding || retrieve || temporaryList?.length < 1}
						>
							Swap
						</Button>
					)}

					<div className={styles['price-wrapper']} style={{direction: 'ltr'}}>
						<div className={styles.price}>
							<p>{`${t('Total')} ${t('Count')?.toLowerCase()}`}:</p>
							<span>
                {decimalToInteger(
	                sumDecimals(
		                (retrieve ? transferDetail?.items : temporaryList)?.map(
			                (i) => i?.total_quantity ?? '0.00'
		                ) ?? []
	                )
                )}
              </span>
						</div>
					</div>
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
			{!retrieve && temporaryList?.length > 0 && (
				<DeleteModal
					endpoint="movements/temporaries/"
					onDelete={() => refetchTemporaryList()}
					removedParams={['updateId', 'type']}
				/>
			)}
		</>
	)
}

export default Index