import {BUTTON_THEME} from 'constants/fields'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {Button, Card, PageTitle} from 'components'
import {useSearchParams} from 'hooks'
import ProductIncome from 'modules/dashboard/screens/ProductIncome'
import ProductLoss from 'modules/dashboard/screens/ProductLoss'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'


const Index = () => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	const {paramsObject: {tab = exchangeOptions[0]?.value}} = useSearchParams()

	return (
		<>
			<PageTitle
				title={tab == '1' ? t('Product exchange history (income)') : t('Product exchange history (sale)')}>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>

			<Card screen={true} className="span-12 gap-md flex-1">
				{/*<CardTab*/}
				{/*	// style={{marginBottom: '1rem'}}*/}
				{/*	fallbackValue={exchangeOptions[0]?.value}*/}
				{/*	tabs={exchangeOptions}*/}
				{/*/>*/}
				{
					tab == '1' ? <ProductIncome/> :
						tab == '2' ? <ProductLoss/> :
							null
				}
			</Card>
		</>
	)
}

export default Index