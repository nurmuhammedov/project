import {Delete} from 'assets/icons'
import {useSearchParams} from 'hooks'
import styles from './styles.module.scss'


interface IProperties {
	id?: string | number
	withSlash?: boolean
	onDelete?: () => void
}

const Index = ({id, withSlash = false, onDelete}: IProperties) => {
	const {addParams} = useSearchParams()
	return (
		<div
			className={styles.root}
			onClick={() => onDelete ? onDelete() : addParams({modal: 'delete', deleteId: withSlash ? `${id}/` : id})}
		>
			<Delete/>
		</div>
	)
}

export default Index