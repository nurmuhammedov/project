import {Delete} from 'assets/icons'
import {useSearchParams} from 'hooks'
import styles from './styles.module.scss'


interface IProperties {
	id: string | number
}

const Index = ({id}: IProperties) => {
	const {addParams} = useSearchParams()
	return (
		<div className={styles.root} onClick={() => addParams({modal: 'delete', deletionId: id})}>
			<Delete/>
		</div>
	)
}

export default Index