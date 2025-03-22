import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {SelectIcon} from 'assets/icons'
import {FC, ReactNode} from 'react'


interface IProperties {
	title?: string
	subTitle?: string
	onClick?: () => void,
	children?: ReactNode
}

const Index: FC<IProperties> = ({title, subTitle, children = null, onClick}) => {
	const {t} = useTranslation()
	return (
		<div className={styles.root}>
			{
				title &&
				<p className={styles.title}>{t(title)}</p>
			}
			{
				subTitle &&
				<p className={styles['sub-title']} onClick={() => onClick?.()}>{t(subTitle)} <SelectIcon/></p>
			}
			{children}
		</div>
	)
}

export default Index