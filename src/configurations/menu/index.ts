import {IMenuItem} from 'interfaces/configuration.interface'
import {ROLE_LIST} from 'constants/roles'


export const menu: IMenuItem[] = [
	{
		id: '/home',
		label: 'Home',
		href: '/admin/home',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		}
	},
	{
		id: '/clients',
		label: 'Customers',
		href: '/admin/clients',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		}
	},
	{
		id: '/products',
		label: 'Products',
		href: '/admin/products',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		}
	},
	{
		id: '/stores',
		label: 'Stores',
		href: '/admin/stores',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		}
	},
	{
		id: '/database',
		label: 'Database',
		href: '/admin/database',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		}
	},
	{
		id: '/admin/reports',
		label: 'Reports',
		href: '/admin/reports',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		},
		children: [
			{
				id: '/admin/reports/by-warehouse',
				label: 'Products warehouse',
				href: '/admin/reports/by-warehouse',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 1}
			},
			{
				id: '/admin/reports/by-price',
				label: 'Remaining stock (by price)',
				href: '/admin/reports/by-price',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/by-purchase',
				label: 'Product balance (by purchase)',
				href: '/admin/reports/by-purchase',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/by-customer',
				label: 'Sales (by customer)',
				href: '/admin/reports/by-customer',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/by-total',
				label: 'Sales (total)',
				href: '/admin/reports/by-total',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			}
		]
	}
]
