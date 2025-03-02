import {FC} from 'react'
import styles from './styles.module.scss'
import {SelectIcon} from 'assets/icons'
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'


interface IProperties {
	title?: string
}

const Index: FC<IProperties> = ({title}) => {
	const navigate = useNavigate()
	const {t} = useTranslation()
	return (
		<div className={styles.root}>
			<div className={styles.icon} onClick={() => navigate(-1)}>
				<SelectIcon/>
			</div>
			<div className={styles.title}>
				{t(title || '')}
			</div>
			<div></div>
		</div>
	)
}

export default Index