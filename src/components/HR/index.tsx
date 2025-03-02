import {CSSProperties, FC} from 'react'
import styles from './styles.module.scss'


interface IProperties {
	style?: CSSProperties
}

const Index: FC<IProperties> = ({style}) => <div className={styles.root} style={style}></div>

export default Index