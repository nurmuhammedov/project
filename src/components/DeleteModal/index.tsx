import {useDelete, useSearchParams} from 'hooks'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {Button, Modal} from 'components'


interface IProperties {
	endpoint: string
	title?: string
	removedParams?: string[]
	onDelete?: () => void
}

const Index = ({title = 'Should it really be deleted?', endpoint, onDelete, removedParams = []}: IProperties) => {
	const {t} = useTranslation()
	const {paramsObject, removeParams} = useSearchParams()
	const {mutateAsync, isPending} = useDelete(endpoint, paramsObject['deleteId'])

	const handleClose = () => {
		removeParams('modal', 'deleteId', ...removedParams)
	}

	return (
		<Modal animation="flip" id="delete" style={{height: '20rem'}} onClose={handleClose}>
			<h1 className={styles.title}>{t(title)}</h1>
			<div style={{marginTop: 'auto'}} className="flex align-center gap-lg">
				<Button
					style={{flex: 1}}
					disabled={isPending}
					onClick={() => mutateAsync(0).then(() => {
						removeParams('modal', 'deleteId', 'page', 'limit', ...removedParams)
						onDelete?.()
					})}
				>
					Confirm
				</Button>
			</div>
		</Modal>
	)
}

export default Index