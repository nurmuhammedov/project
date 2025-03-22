import {ISelectOption} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {CSSProperties, FC} from 'react'
import {useSearchParams} from 'hooks'
import classNames from 'classnames'


interface IProperties {
	fallbackValue: string | number | boolean
	tabs: ISelectOption[]
	onTabChange?: () => void
	query?: string
	disabled?: boolean
	style?: CSSProperties
}

const Index: FC<IProperties> = ({tabs, fallbackValue, query = 'tab', style, onTabChange, disabled = false}) => {
	const {paramsObject, addParams} = useSearchParams()
	const status = paramsObject[query] || fallbackValue
	const {t} = useTranslation()


	const handleTabChange = (value: string | number | boolean) => {
		addParams({[query]: String(value)}, 'updateId', 'deleteId', 'modal', 'page', 'limit')
		onTabChange?.()
	}

	return (
		<div className={classNames(styles.root, {[styles.disabled]: disabled})} style={style}>
			{
				tabs?.map(item => {
					return (
						<button
							disabled={disabled}
							key={item.value?.toString()}
							className={classNames(styles.tab, {[styles.active]: item.value === status})}
							onClick={() => handleTabChange(item.value)}
						>
							{t(item.label as string || '')}
						</button>
					)
				})
			}
		</div>
	)
}

export default Index