import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AuthenticationService} from "@app/services";
import {useNavigate} from "react-router-dom";

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