import {BUTTON_THEME} from 'constants/fields'
import {exchangeOptions} from 'modules/dashboard/helpers/options'
import {Button, HorizontalTab, PageTitle} from 'components'
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
			<PageTitle title={t('Trade')}>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</PageTitle>
			<HorizontalTab
				style={{marginBottom: '1rem'}}
				fallbackValue={exchangeOptions[0]?.value}
				tabs={exchangeOptions}
			/>
			<div className="grid gap-md flex-1">
				{
					tab == '1' ? <ProductIncome/> :
						tab == '2' ? <ProductLoss/> :
							null
				}
			</div>
		</>
	)
}

export default Index