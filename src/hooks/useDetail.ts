import {ISearchParams} from 'interfaces/params.interface'
import {CommonService} from 'services/common.service'
import {useQuery} from '@tanstack/react-query'
import {useTranslation} from 'react-i18next'
import {showMessage} from 'utilities/alert'


const useDetail = <T>(
	endpoint: string,
	id?: string | number | boolean | null,
	enabled: boolean = true,
	params?: ISearchParams
) => {
	const {i18n} = useTranslation()

	const queryMethods = useQuery<T, Error>({
		queryKey: [endpoint, id, params, i18n.language],
		queryFn: async () => {
			if (!id) {
				showMessage(`Unable to fetch data because a valid ID was not provided. Please ensure you pass a valid ID when fetching data from endpoint: ${endpoint}`, 'error')
				return Promise.reject()
			}

			return CommonService.getDetail<T>(endpoint, id.toString(), params)
		},
		enabled: enabled && !!id,
		staleTime: 0
	})

	const {data = undefined} = queryMethods || {}

	return {
		...queryMethods,
		detail: data
	}
}

export default useDetail
