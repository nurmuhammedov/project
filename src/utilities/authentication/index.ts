import {ILogin, IRole, IUser} from 'interfaces/authentication.interface'
import {ROLE_LIST} from 'constants/roles'


function buildUser(userData: ILogin | undefined): IUser | null {
	if (!userData) return null
	return {
		fullName: userData?.full_name,
		role: userData?.role ?? ROLE_LIST.ADMIN
	}
}

const routeByRole = (role: IRole = ROLE_LIST.ADMIN): string => {
	switch (role) {
		case ROLE_LIST.SELLER:
			return '/seller/home'
		case ROLE_LIST.ADMIN:
			return '/admin/home'
		default:
			return '/'
	}
}

export {
	buildUser,
	routeByRole
}