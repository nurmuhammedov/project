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
		},
		children: [
			{
				id: 'admin/home/product-exchange?tab=purchase',
				label: 'Trade (income)',
				href: '/admin/home/product-exchange?tab=purchase',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 1}
			},
			{
				id: 'admin/home/product-exchange?tab=sale',
				label: 'Trade (loss)',
				href: '/admin/home/product-exchange?tab=sale',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 1}
			},
			{
				id: 'admin/home/currency-exchange?tab=1',
				label: 'Currency exchange (income)',
				href: '/admin/home/currency-exchange?tab=1',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: 'admin/home/currency-exchange?tab=2',
				label: 'Currency exchange (loss)',
				href: '/admin/home/currency-exchange?tab=2',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: 'admin/home/service',
				label: 'Service',
				href: '/admin/home/service',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			}
		]
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
			},
			{
				id: '/admin/reports/by-temporaries',
				label: 'Temporaries (by purchase)',
				href: '/admin/reports/by-temporaries',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/by-sale-temporaries',
				label: 'Temporaries (by sale)',
				href: '/admin/reports/by-sale-temporaries',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			}
		]
	}
]
