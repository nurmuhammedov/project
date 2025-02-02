import {useAppContext} from 'hooks/index'
import {ReactNode} from 'react'
import {Navigate} from 'react-router-dom'
import {routeByRole} from 'utilities/authentication'


interface ProtectedRouteProps {
	allowedRoles?: string[]
	children: ReactNode
}

const ProtectedRoute = ({allowedRoles, children}: ProtectedRouteProps) => {
	const {user} = useAppContext()

	if (!user || (allowedRoles && !allowedRoles.includes(user.role!))) {
		return <Navigate to={routeByRole(user.role)} replace/>
	}

	return children
}

export default ProtectedRoute
