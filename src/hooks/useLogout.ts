import {AuthenticationService} from 'services/authentication.service'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'


export default function useLogout() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const {mutate: handleLogout, isPending} = useMutation({
		mutationFn: AuthenticationService.logout,
		onSuccess: () => {
			navigate('/login', {replace: true})
			queryClient.clear()
		}
	})

	return {handleLogout, isPending}
}