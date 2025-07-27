import {Edit} from 'assets/icons'
import {useSearchParams} from 'hooks'
import styles from '../DeleteButton/styles.module.scss'
import {useNavigate} from 'react-router-dom'


interface IProperties {
	id: string | number
	withSlash?: boolean
	url?: string
}

const Index = ({id, withSlash = false, url = undefined}: IProperties) => {
	const {addParams} = useSearchParams()
	const navigate = useNavigate()
	return (
		<div className={styles.root}
		     onClick={() => url ? navigate(url) : addParams({modal: 'edit', updateId: withSlash ? `${id}/` : id})}>
			<Edit/>
		</div>
	)
}

export default Index