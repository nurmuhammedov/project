import {CommonService} from 'services/common.service'
import {useMutation} from '@tanstack/react-query'
import {showMessage} from 'utilities/alert'


const useUpdate = <TVariables, TData, TError>(
	endpoint: string,
	id?: string | number | boolean | null,
	method: 'put' | 'patch' = 'put',
	successMessage: string = 'Updated successfully'
) => {
	return useMutation<TData, TError, TVariables>({
		mutationFn: async (data: TVariables) => {
			if (!id && id !== 0) {
				showMessage(`The operation cannot be completed because a valid ID was not provided. Please ensure you pass a valid ID when updating data at endpoint: ${endpoint}`, 'error')
				return Promise.reject()
			}

			return method === 'put'
				? CommonService.updateData<TVariables, TData>(endpoint, data, id.toString())
				: CommonService.partialUpdateData<TVariables, TData>(endpoint, data, id.toString())
		},
		onSuccess: () => showMessage(successMessage, 'success')
	})
}

export default useUpdate
