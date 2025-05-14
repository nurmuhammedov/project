import Balance from 'modules/stores/components/Balance'
import {storeDetailTabs, storeTypes} from 'modules/stores/helpers/options'
import ExchangesHistory from 'modules/stores/components/ExchangesHistory'
import BalanceChange from 'modules/stores/components/BalanceChange'
import ProductIncome from 'modules/stores/components/ProductIncome'
import ProductLoss from 'modules/stores/components/ProductLoss'
import {Loader, PageInfo, VerticalTab} from 'components'
import {IStoreDetail} from 'modules/stores/interfaces'
import {useDetail, useSearchParams} from 'hooks'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {Store} from 'assets/icons'


// const tabOptions: ISelectOption[] = [
// 	{
// 		label: 'Sales history',
// 		value: 'salesHistory',
// 		icon: <Cart/>
// 	},
// 	{
// 		label: 'Products',
// 		value: 'warehouse',
// 		icon: <Box/>
// 	},
// 	{
// 		label: 'Employees',
// 		value: 'employees',
// 		icon: <Status/>
// 	}
// ]

const Index = () => {
	const {id = undefined} = useParams()
	const {t} = useTranslation()
	const {paramsObject: {tab = storeDetailTabs[0]?.value}} = useSearchParams()
	const {data: detail, isPending: isDetailLoading} = useDetail<IStoreDetail>('stores/', id)


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg">
				<PageInfo
					title={detail?.name}
					subTitle={t(storeTypes.find(i => i.value == detail?.exchange_type)?.label?.toString() ?? '')}
					icon={<Store/>}
				/>
			</div>

			<div className="grid gap-md flex-1" style={{marginTop: '1rem'}}>
				<div className="span-3">
					<VerticalTab fallbackValue={storeDetailTabs[0]?.value} tabs={storeDetailTabs}/>
				</div>
				{
					tab === 'balance' ? <Balance/> :
						tab === 'currencies' ? <ExchangesHistory/> :
							tab === 'balanceChange' ? <BalanceChange/> :
								tab === 'income' ? <ProductIncome/> :
									tab === 'loss' ? <ProductLoss/> :
										null

				}
			</div>
		</>
	)
}

export default Index