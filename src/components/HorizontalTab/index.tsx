import {ISelectOption} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {CSSProperties, FC} from 'react'
import {useSearchParams} from 'hooks'
import {Product} from 'assets/icons'
import classNames from 'classnames'


interface IProperties {
	fallbackValue: string | number | boolean
	tabs: ISelectOption[]
	query?: string
	style?: CSSProperties
}

const Index: FC<IProperties> = ({tabs, fallbackValue, query = 'tab', style}) => {
	const {paramsObject, addParams} = useSearchParams()
	const status = paramsObject[query] || fallbackValue
	const {t} = useTranslation()


	const handleTabChange = (value: string | number | boolean) => {
		addParams({[query]: String(value)}, 'updateId', 'deleteId', 'modal', 'page', 'limit')
	}

	return (
		<div className={styles.root} style={style}>
			{
				tabs?.map(item => {
					return (
						<button
							key={item.value?.toString()}
							className={classNames(styles.tab, {[styles.active]: item.value === status})}
							onClick={() => handleTabChange(item.value)}
						>
							<div className={styles['icon-wrapper']}>
								{item?.icon ?? <Product/>}
							</div>
							{t(item.label as string)}
						</button>
					)
				})
			}
		</div>
	)
}

export default Index