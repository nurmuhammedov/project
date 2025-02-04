import styles from './styles.module.scss'
import {FC} from 'react'


interface IProperties {
	title?: string | number | boolean | null
}

const Index: FC<IProperties> = ({title = ''}) => {
	return (
		<div className={styles.root}>
			{title ?? null}
		</div>
	)
}

export default Index