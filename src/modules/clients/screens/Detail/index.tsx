import {BUTTON_THEME} from 'constants/fields'
import Balance from 'modules/clients/components/Balance'
import BalanceChange from 'modules/clients/components/BalanceChange'
import ExchangesHistory from 'modules/clients/components/ExchangesHistory'
import {Button, Loader, PageInfo, VerticalTab} from 'components'
import {useDetail, useSearchParams} from 'hooks'
import ProductIncome from 'modules/clients/components/ProductIncome'
import ProductLoss from 'modules/clients/components/ProductLoss'
import {clientDetailTabs} from 'modules/clients/helpers/options'
import {ICustomerDetail} from 'modules/clients/interfaces'
import {useNavigate, useParams} from 'react-router-dom'


const Index = () => {
	const {customerId = undefined} = useParams()
	const navigate = useNavigate()
	const {data: detail, isPending: isDetailLoading} = useDetail<ICustomerDetail>('customers/', customerId)
	const {paramsObject: {tab = clientDetailTabs[0]?.value}} = useSearchParams()


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg" style={{marginBottom: '1.5rem'}}>
				<PageInfo
					type="user"
					title={detail?.name}
					subTitle={detail?.phone_number}
				/>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</div>

			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={clientDetailTabs[0]?.value} tabs={clientDetailTabs}/>
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