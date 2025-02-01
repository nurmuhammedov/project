import {Product} from 'assets/icons'
import {ISelectOption} from 'interfaces/form.interface'
import styles from './styles.module.scss'
import {CSSProperties, FC} from 'react'
import {useSearchParams} from 'hooks'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'


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


	const handleTabChange = (value: string | number) => {
		addParams({[query]: String(value)}, 'updateId', 'deleteId', 'modal')
	}

	return (
		<div className={styles.root} style={style}>
			{
				tabs?.map(item => {
					return (
						<button
							key={item.value}
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