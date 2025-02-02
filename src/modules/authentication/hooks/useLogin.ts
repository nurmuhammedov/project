import {ILogin} from 'interfaces/authentication.interface'
import {ILoginForm} from 'interfaces/yup.interface'
import {useLocation, useNavigate} from 'react-router-dom'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {AuthenticationService} from 'services/authentication.service'
import {showMessage} from 'utilities/alert'
import {buildUser, routeByRole} from 'utilities/authentication'
import {useUser} from 'hooks/index'


export function useLogin() {
	const queryClient = useQueryClient()
	const {state} = useLocation()
	const navigate = useNavigate()

	const handleLogin = (userData: ILogin) => {
		const {user, isPending} = useUser()
		// console.log('User Data:', userData)
		// queryClient.setQueryData(['user'], {'username': 'admin2', 'full_name': 'Jo`rabek Xaytboyev', 'role': 'admin'})
		// console.log(queryClient)
		// const redirectPath = state?.from ? state.from : routeByRole(userData.role)
		// navigate(redirectPath)
		// showMessage('Successful', 'success')
	}

	const {isPending, mutate: login} = useMutation({
		mutationFn: (credentials: ILoginForm) => AuthenticationService.login(credentials),
		onSuccess: handleLogin
	})

	return {login, isPending}
}
