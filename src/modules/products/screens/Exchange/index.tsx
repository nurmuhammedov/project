import {Plus} from 'assets/icons'
import {BUTTON_THEME} from 'constants/fields'
import Purchase from 'modules/products/components/Purchase'
import Sale from 'modules/products/components/Sale'
import {useSearchParams} from 'hooks'
import {Button, PageTitle} from 'components'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail = false}) => {
	const {paramsObject: {tab: tab = productExchangeTabOptions[0]?.value}, addParams} = useSearchParams()
	const navigate = useNavigate()
	const {t} = useTranslation()

	return (
		<>
			<PageTitle
				title={`${t('Trade')}`}
			>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'product'})}
						theme={BUTTON_THEME.PRIMARY}
					>
						Add product
					</Button>
				</div>
			</PageTitle>
			{
				tab === 'purchase' ? <Purchase detail={detail}/> :
					tab === 'sale' ? <Sale detail={detail}/> :
						null
			}

		</>
	)
}

export default Index