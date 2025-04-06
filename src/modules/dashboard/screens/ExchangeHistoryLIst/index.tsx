import {BUTTON_THEME} from 'constants/fields'
import BalanceChange from 'modules/dashboard/screens/BalanceChange'
import CurrencyExchangeHistory from 'modules/dashboard/screens/CurrencyExchangeHistory'
import {exchangeTabs} from 'modules/dashboard/helpers/options'
import {Button, PageTitle, VerticalTab} from 'components'
import {useSearchParams} from 'hooks'
import {useNavigate} from 'react-router-dom'


const Index = () => {
	const navigate = useNavigate()
	const {paramsObject: {tab = exchangeTabs[0]?.value}} = useSearchParams()

	return (
		<>
			<PageTitle title={exchangeTabs.find(item => item?.value == tab)?.label?.toString() || ''}>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={exchangeTabs[0]?.value} tabs={exchangeTabs}/>
				</div>
				{
					tab === 'currencies' ? <CurrencyExchangeHistory/> :
						tab === 'balanceChange' ? <BalanceChange/> :
							null
				}
			</div>
		</>
	)
}

export default Index