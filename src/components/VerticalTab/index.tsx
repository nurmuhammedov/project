import {SelectIcon} from 'assets/icons'
import {Card} from 'components'
import {ISelectOption} from 'interfaces/form.interface'
import styles from './styles.module.scss'
import {FC} from 'react'
import {useSearchParams} from 'hooks'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'


interface IProperties {
	fallbackValue: string | number | boolean
	tabs: ISelectOption[]
	query?: string
}

const Index: FC<IProperties> = ({tabs, fallbackValue, query = 'tab'}) => {
	const {paramsObject, addParams} = useSearchParams()
	const status = paramsObject[query] || fallbackValue
	const {t} = useTranslation()


	const handleTabChange = (value: string | number | boolean) => {
		addParams({[query]: String(value)}, 'updateId', 'deleteId', 'modal')
	}

	return (
		<Card className={styles.root}>
			{
				tabs?.map(item => {
					return (
						<button
							key={item.value?.toString()}
							className={classNames(styles.tab, {[styles.active]: item.value === status})}
							onClick={() => handleTabChange(item.value)}
						>
							{t(item.label as string)}
							<SelectIcon/>
						</button>
					)
				})
			}
		</Card>
	)
}

export default Index