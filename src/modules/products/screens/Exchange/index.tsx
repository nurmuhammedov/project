import Purchase from 'modules/products/components/Purchase'
import Sale from 'modules/products/components/Sale'
import {useSearchParams} from 'hooks'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {FC} from 'react'
import Transfer2 from 'modules/products/components/Transfer2'
import {AddClientModal} from 'components'


interface IProperties {
	detail?: boolean
	edit?: boolean
}

const Index: FC<IProperties> = ({detail = false, edit = false}) => {
	const {paramsObject: {tab: tab = productExchangeTabOptions[0]?.value}} = useSearchParams()

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
					tab === 'sale' ? <Sale edit={edit} detail={detail}/> :
						tab === 'transfer' ? <Transfer2 detail={detail}/> :
							null
			}
			{
				(!edit && !detail) && <>
					<AddClientModal/>
				</>
			}
		</>
	)
}

export default Index