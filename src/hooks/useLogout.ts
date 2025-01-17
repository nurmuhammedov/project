import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {AuthenticationService} from 'services/authentication.service'

export default function Index() {
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