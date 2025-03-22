import {CommonService} from 'services/common.service'
import {useMutation} from '@tanstack/react-query'
import {showMessage} from 'utilities/alert'


const useAdd = <TVariables, TData, TError>(endpoint: string, successMessage: string = 'Saved successfully') => {
	return useMutation<TData, TError, TVariables>({
		mutationFn: (data: TVariables) => CommonService.addData<TVariables, TData>(endpoint, data),
		onSuccess: () => showMessage(successMessage, 'success')
	})
}

export default useAdd