import {CurrencyExchange} from 'assets/icons'
import {Button, PageTitle} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import ExchangesHistory from 'modules/dashboard/components/ExchangesHistory'
import ProductsExchange from 'modules/dashboard/components/ProductsExchange'
// import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import Currencies from 'modules/dashboard/components/Currencies'
import Cashier from 'modules/dashboard/components/Checkout'


const Index = () => {
	const navigate = useNavigate()
	// const {t} = useTranslation()
	return (
		<>
			<PageTitle title="Home">
				<div className="flex align-center gap-lg">
					{/*<Button*/}
					{/*	theme={BUTTON_THEME.DANGER_OUTLINE}*/}
					{/*	icon={<Currency/>}*/}
					{/*	onClick={() => navigate('service')}*/}
					{/*>*/}
					{/*	Service*/}
					{/*</Button>*/}
					{/*<Button*/}
					{/*	theme={BUTTON_THEME.DANGER_OUTLINE}*/}
					{/*	icon={<Currency/>}*/}
					{/*	onClick={() => navigate('currency-exchange')}*/}
					{/*>*/}
					{/*	Currency exchange*/}
					{/*</Button>*/}
					{/*<Button*/}
					{/*	theme={BUTTON_THEME.DANGER_OUTLINE}*/}
					{/*	onClick={() => navigate('product-exchange?tab=purchase')}*/}
					{/*	icon={<Cart/>}*/}
					{/*>*/}
					{/*	{`${t('Trade')} (${t('Income')?.toLowerCase()})`}*/}
					{/*</Button>*/}
					{/*<Button*/}
					{/*	theme={BUTTON_THEME.DANGER_OUTLINE}*/}
					{/*	onClick={() => navigate('product-exchange?tab=sale')}*/}
					{/*	icon={<Cart/>}*/}
					{/*>*/}
					{/*	{`${t('Trade')} (${t('Loss')?.toLowerCase()})`}*/}
					{/*</Button>*/}
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<CurrencyExchange/>}
						onClick={() => navigate('daily-currency?modal=dailyCurrency')}
					>
						Update currency
					</Button>
				</div>
			</PageTitle>
			<div className="grid gap-lg">
				<div className="grid gap-lg space-12">
					<Cashier className="span-4"/>
					<Currencies className="span-4"/>
				</div>
				<div className="grid gap-lg space-12">
				</div>
				<div className="grid gap-lg space-12">
					<ExchangesHistory className="span-6"/>
					<ProductsExchange className="span-6"/>
				</div>
			</div>
		</>
	)
}

export default Index