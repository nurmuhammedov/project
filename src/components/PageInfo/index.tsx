import {Product, Status} from 'assets/icons'
import {ReactNode} from 'react'
import styles from './styles.module.scss'


interface IProps {
	title?: string
	subTitle?: string
	icon?: ReactNode
	type?: 'user' | 'store'
}

const Index = ({subTitle = '', title = '', icon, type = 'store'}: IProps) => {
	return (
		<div className={styles.root}>
			{
				type === 'store' ? (
					<div className={styles['icon-wrapper']}>
						{icon ?? <Product/>}
					</div>
				) : (
					<div className={styles['user-wrapper']}>
						<Status/>
					</div>
				)
			}

			<div className={styles['title-wrapper']}>
				<div className={styles.title}>{title ?? ''}</div>
				<div className={styles.subTitle}>{subTitle ?? ''}</div>
			</div>
		</div>
	)
}

export default Index