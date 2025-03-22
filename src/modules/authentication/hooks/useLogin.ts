import {AuthenticationService} from 'services/authentication.service'
import {buildUser, routeByRole} from 'utilities/authentication'
import {ILogin} from 'interfaces/authentication.interface'
import {ILoginForm} from 'interfaces/yup.interface'
import {useMutation} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'
import {showMessage} from 'utilities/alert'
import {useAppContext} from 'hooks'


export function useLogin() {
	const {setUser, setIsLoading} = useAppContext()
	const navigate = useNavigate()

	const handleLogin = (userData: ILogin) => {
		setIsLoading(true)
		setUser(buildUser(userData))
		setTimeout(() => setIsLoading(false), 1250)
		navigate(routeByRole(userData.role))
		showMessage('Successful', 'success')
	}

	const {isPending, mutate: login} = useMutation({
		mutationFn: (credentials: ILoginForm) => AuthenticationService.login(credentials),
		onSuccess: handleLogin,
		onError: () => showMessage('Invalid username or password', 'error')
	})

	return {login, isPending}
}
