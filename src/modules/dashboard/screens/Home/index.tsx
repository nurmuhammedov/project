import {Cart, Income, Search} from 'assets/icons'
import {Button, Input, PageTitle} from 'components'
import {BUTTON_THEME} from 'constants/fields'


const Index = () => {
	return (
		<>
			<PageTitle title="Home">
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Cart/>}
					>
						Making trade
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Income/>}
					>
						Making income
					</Button>
					<Input iconPosition='right' icon={<Search/>} id={'search'} placeholder={'Search'}>

					</Input>
				</div>
			</PageTitle>
		</>
	)
}

export default Index