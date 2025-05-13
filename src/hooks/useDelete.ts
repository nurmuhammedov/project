import {CommonService} from 'services/common.service'
import {useMutation} from '@tanstack/react-query'
import {showMessage} from 'utilities/alert'
import {noopAsync} from 'utilities/common'


const useDelete = (
	endpoint: string,
	id?: string | number | boolean | null,
	successMessage: string = 'Deleted successfully'
) => {
	return useMutation({
		mutationFn: (ID?: number) => {
			if (id || ID) {
				return CommonService.deleteData(endpoint, id?.toString() || ID?.toString() || '')
			} else {
				showMessage('ID is required to perform delete operation', 'error')
				return noopAsync()
			}
		},
		onSuccess: () => showMessage(successMessage, 'success')
	})
}

export default useDelete
