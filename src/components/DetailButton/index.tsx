import {Detail} from 'assets/icons'
import {useNavigate} from 'react-router-dom'
import styles from '../DeleteButton/styles.module.scss'


interface IProperties {
	id: string | number,
	url?: string
}

const Index = ({id, url = ''}: IProperties) => {
	const navigate = useNavigate()
	return (
		<div className={styles.root} onClick={() => navigate(url ? url : `detail/${id}`)}>
			<Detail/>
		</div>
	)
}

export default Index