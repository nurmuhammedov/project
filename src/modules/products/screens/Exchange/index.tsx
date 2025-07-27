// import {Button} from 'components/UI'
// import {BUTTON_THEME} from 'constants/fields'
import Purchase from 'modules/products/components/Purchase'
import Sale from 'modules/products/components/Sale'
import {useSearchParams} from 'hooks'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {FC} from 'react'
// import {useNavigate} from 'react-router-dom'
import Transfer from 'modules/products/components/Transfer'

// import edit from 'assets/icons/Edit'


interface IProperties {
	detail?: boolean
	edit?: boolean
}

const Index: FC<IProperties> = ({detail = false, edit = false}) => {
	const {paramsObject: {tab: tab = productExchangeTabOptions[0]?.value}} = useSearchParams()
	// const navigate = useNavigate()

	return (
		<>
			{/*{*/}
			{/*	detail &&*/}
			{/*	<div className="flex justify-start gap-lg" style={{marginBottom: '1rem'}}>*/}
			{/*		<Button*/}
			{/*			onClick={() => navigate(-1)}*/}
			{/*			theme={BUTTON_THEME.DANGER_OUTLINE}*/}
			{/*		>*/}
			{/*			Back*/}
			{/*		</Button>*/}
			{/*	</div>*/}
			{/*}*/}
			{
				tab === 'purchase' ? <Purchase edit={edit} detail={detail}/> :
					tab === 'sale' ? <Sale detail={detail}/> :
						tab === 'transfer' ? <Transfer detail={detail}/> :
							null
			}

		</>
	)
}

export default Index