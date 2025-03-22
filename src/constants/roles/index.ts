enum ROLE_LIST {
	ADMIN = 'admin',
	SELLER = 'seller'
}

const ROLE_LABEL: Record<ROLE_LIST, string> = {
	[ROLE_LIST.SELLER]: 'Seller',
	[ROLE_LIST.ADMIN]: 'Admin'
}


export {
	ROLE_LIST,
	ROLE_LABEL
}