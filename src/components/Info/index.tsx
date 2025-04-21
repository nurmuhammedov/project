import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'


interface IProperties {
	title: string
	text?: string
}

const Index: FC<IProperties> = ({title = '', text = null}) => {
	const {t} = useTranslation()
	return (
		<div className={styles.root}>
			<p>{t(title)}:</p>
			{
				text &&
				<div className={styles.text} dangerouslySetInnerHTML={{__html: text}}></div>
			}
		</div>
	)
}

export default Index