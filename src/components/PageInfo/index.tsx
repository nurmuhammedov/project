import {Product} from 'assets/icons'
import {ReactNode} from 'react'
import styles from './styles.module.scss'


interface IProps {
	title: string
	subTitle: string
	icon?: ReactNode
}

const Index = ({subTitle = '', title = '', icon}: IProps) => {
	return (
		<div className={styles.root}>
			<div className={styles['icon-wrapper']}>
				{icon ?? <Product/>}
			</div>
			<div className={styles['title-wrapper']}>
				<div className={styles.title}>{title}</div>
				<div className={styles.subTitle}>{subTitle}</div>
			</div>
		</div>
	)
}

export default Index