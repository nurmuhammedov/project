import {ILogin} from 'interfaces/authentication.interface'
import {ILoginForm} from 'interfaces/yup.interface'
import {interceptor} from 'libraries'


export const AuthenticationService = {
	async login(credentials: ILoginForm) {
		const response = await interceptor.post<ILogin>('auth/login', credentials)
		return response.data
	},

	async logout() {
		const response = await interceptor.post<never>('auth/logout', null)
		return response.data
	}
}