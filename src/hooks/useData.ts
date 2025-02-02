import {ISearchParams} from 'interfaces/params.interface'
import {CommonService} from 'services/common.service'
import {useQuery} from '@tanstack/react-query'
import {useTranslation} from 'react-i18next'


const useData = <T>(
	endpoint: string,
	enabled: boolean = true,
	params?: ISearchParams
) => {
	const {i18n} = useTranslation()

	return useQuery<T, Error>({
		queryKey: [endpoint, params, i18n.language],
		queryFn: () => CommonService.getData<T>(endpoint, params),
		enabled
	})
}

export default useData
