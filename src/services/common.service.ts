import {AxiosResponse} from 'axios'
import {IListResponse} from 'interfaces/configuration.interface'
import {interceptor} from 'libraries'


export const CommonService = {
	getPaginatedData: async <T>(endpoint: string, params = {}): Promise<IListResponse<T>> => {
		const response: AxiosResponse<IListResponse<T>> = await interceptor.get(endpoint, {params})
		return response.data
	},

	async addData<T, TResponse>(endpoint: string, data: T) {
		const res = await interceptor.post<TResponse>(endpoint, data)
		return res.data
	},

	async deleteData(endpoint: string, id: string | number): Promise<void> {
		const res = await interceptor.delete(endpoint + id)
		return res.data
	}
}