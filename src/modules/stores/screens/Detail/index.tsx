import {Box, Cart, Currency, Status, Store} from 'assets/icons'
import {Button, Loader, PageInfo, HorizontalTab} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import {useDetail, useSearchParams} from 'hooks'
import {ISelectOption} from 'interfaces/form.interface'
import {storeTypes} from 'modules/stores/helpers/options'
import SalesHistory from 'modules/stores/components/SalesHistory'
import Warehouse from 'modules/stores/components/Warehouse'
import Employees from 'modules/stores/components/Employees'
import {IStoreDetail} from 'modules/stores/interfaces'
import {useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'


const tabOptions: ISelectOption[] = [
	{
		label: 'Sales history',
		value: 'salesHistory',
		icon: <Cart/>
	},
	{
		label: 'Warehouse',
		value: 'warehouse',
		icon: <Box/>
	},
	{
		label: 'Employees',
		value: 'employees',
		icon: <Status/>
	}
]

const Index = () => {
	const {id = undefined} = useParams()
	const {t} = useTranslation()
	const {paramsObject: {tab = tabOptions[0]?.value}} = useSearchParams()
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
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Currency/>}
					>
						Currency exchange
					</Button>
				</div>
			</div>

			<HorizontalTab
				tabs={tabOptions}
				fallbackValue={tabOptions[0]?.value}
				style={{marginTop: '2.25rem', marginBottom: '0.75rem'}}
			/>
			{
				tab === 'salesHistory' ? <SalesHistory/> :
					tab === 'warehouse' ? <Warehouse/> :
						tab === 'employees' ? <Employees/> :
							null

			}
		</>
	)
}

export default Index