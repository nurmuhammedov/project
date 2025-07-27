import {Detail} from 'assets/icons'
import {useNavigate} from 'react-router-dom'
import styles from '../DeleteButton/styles.module.scss'


interface IProperties {
	id?: string | number,
	url?: string
	handle?: () => void
}

const Index = ({id, url = '', handle = undefined}: IProperties) => {
	const navigate = useNavigate()
	return (
		<div className={styles.root} onClick={() => handle ? handle?.() : navigate(url ? url : `detail/${id}`)}>
			<Detail/>
		</div>
	)
}

export default Index