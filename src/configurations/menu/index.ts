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
		id: '/trade',
		label: 'Trade',
		href: '/admin/trade',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		},
		children: [
			{
				id: 'admin/trade/product-exchange/purchase?tab=purchase',
				label: 'Trade (income)',
				href: '/admin/trade/product-exchange/purchase?tab=purchase',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 1}
			},
			{
				id: 'admin/trade/product-exchange/sale?tab=sale',
				label: 'Trade (loss)',
				href: '/admin/trade/product-exchange/sale?tab=sale',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 1}
			},
			{
				id: 'admin/trade/currency-exchange/purchase?tab=1',
				label: 'Currency exchange (income)',
				href: '/admin/trade/currency-exchange/purchase?tab=1',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: 'admin/trade/currency-exchange/sale?tab=2',
				label: 'Currency exchange (loss)',
				href: '/admin/trade/currency-exchange/sale?tab=2',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: 'admin/trade/service',
				label: 'Service',
				href: '/admin/trade/service',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: 'admin/trade/product-exchange/transfer?tab=transfer',
				label: 'Swap',
				href: '/admin/trade/product-exchange/transfer?tab=transfer',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 3}
			}
		]
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
		id: '/admin/reports/by-warehouse',
		label: 'Reports(Products)',
		href: '/admin/reports/by-warehouse',
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
			}
		]
	},
	{
		id: '/admin/reports/by-customer',
		label: 'Reports(Trade)',
		href: '/admin/reports/by-customer',
		allowedRoles: [
			ROLE_LIST.ADMIN
		],
		order: {
			[ROLE_LIST.ADMIN]: 1
		},
		children: [
			{
				id: '/admin/reports/product-exchange/history/purchase',
				label: 'Product exchange history (income)',
				href: '/admin/reports/product-exchange/history/purchase',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/product-exchange/history/sale?tab=2',
				label: 'Product exchange history (sale)',
				href: '/admin/reports/product-exchange/history/sale?tab=2',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			},
			{
				id: '/admin/reports/currency-exchange/history?tab=currencies',
				label: 'Currency exchange history',
				href: '/admin/reports/currency-exchange/history?tab=currencies',
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
			},
			{
				id: '/admin/reports/by-transfer',
				label: 'Transfer history',
				href: '/admin/reports/by-transfer',
				allowedRoles: [ROLE_LIST.ADMIN],
				order: {[ROLE_LIST.ADMIN]: 2}
			}
		]
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
		},
		children: [
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
			}
		]
	}
]
