import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {FC} from 'react'


interface IProperties {
	title?: string | number | boolean | null
	type?: 'expense' | 'loss'
}

const Index: FC<IProperties> = ({title = '', type}) => {
	const {t} = useTranslation()
	return title ? (
		<div
			className={classNames(styles.root, {[styles.expense]: type === 'expense', [styles.loss]: type === 'loss'})}>
			{t(title?.toString() || '')}
		</div>
	) : null
}

export default Index