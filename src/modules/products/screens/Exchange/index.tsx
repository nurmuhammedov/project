import Purchase from 'modules/products/components/Purchase'
import Sale from 'modules/products/components/Sale'
import {useSearchParams} from 'hooks'
import {productExchangeTabOptions} from 'modules/products/helpers/options'
import {FC} from 'react'


interface IProperties {
	detail?: boolean
}

const Index: FC<IProperties> = ({detail = false}) => {
	const {paramsObject: {tab: tab = productExchangeTabOptions[0]?.value}} = useSearchParams()


	return (
		<>

			{
				tab === 'purchase' ? <Purchase detail={detail}/> :
					tab === 'sale' ? <Sale detail={detail}/> :
						null
			}

		</>
	)
}

export default Index