import {AuthenticationService} from 'services/authentication.service'
import {useQuery} from '@tanstack/react-query'
import {buildUser} from 'utilities/authentication'


export default function useUser() {
	const {isPending, data} = useQuery({
		queryKey: ['user'],
		queryFn: AuthenticationService.me
	})

	return {isPending, user: buildUser(data?.data)}
}
