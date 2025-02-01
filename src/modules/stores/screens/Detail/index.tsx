import {Box, Cart, Currency, Status, Store} from 'assets/icons'
import {Button, Loader, PageInfo, Select} from 'components'
import HorizontalTab from 'components/HorizontalTab'
import {BUTTON_THEME} from 'constants/fields'
import {useDetail, useSearchParams} from 'hooks'
import {ISelectOption} from 'interfaces/form.interface'
import {getSelectValue} from 'utilities/common'
import SalesHistory from 'modules/stores/components/SalesHistory'
import Warehouse from 'modules/stores/components/Warehouse'
import Employees from 'modules/stores/components/Employees'
import {IStoreItemDetail} from 'interfaces/stores.interface'
import {useParams} from 'react-router-dom'
import {storesTypeOptions} from 'helpers/options'
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
	const {data: detail, isPending: isDetailLoading} = useDetail<IStoreItemDetail>('stores/', id)


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg">
				<PageInfo
					title={detail?.name}
					subTitle={t(storesTypeOptions.find(i => i.value == detail?.store_type)?.label?.toString() ?? '')}
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

			<div className="flex align-center" style={{marginTop: '2.25rem', gap: '2.25rem'}}>
				<div className="flex-1">
					<Select
						id="clients"
						options={[]}
						label="Clients"
						value={getSelectValue([], undefined)}
						defaultValue={getSelectValue([], undefined)}
						handleOnChange={(e) => console.log(e as string)}
					/>
				</div>
				<div className="flex-1">
					<Select
						id="priceType"
						options={[]}
						label="Price type"
						value={getSelectValue([], undefined)}
						defaultValue={getSelectValue([], undefined)}
						handleOnChange={(e) => console.log(e as string)}
					/>
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