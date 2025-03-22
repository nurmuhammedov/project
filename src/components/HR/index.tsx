import styles from './styles.module.scss'
import {CSSProperties, FC} from 'react'


interface IProperties {
	style?: CSSProperties
}

const Index: FC<IProperties> = ({style}) => <div className={styles.root} style={style}></div>

export default Index