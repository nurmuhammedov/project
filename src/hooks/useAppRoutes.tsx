import {Navigate, Outlet, useRoutes} from 'react-router-dom'
import {routeByRole} from 'utilities/authentication'
import {ROLE_LIST} from 'constants/roles'
import {AdminLayout} from 'components'
import {useAppContext} from 'hooks'
import {
	CurrencyExchange,
	ProductExchange,
	ProductsTable,
	DatabaseTable,
	DailyCurrency,
	ClientDetail,
	ClientsTable,
	StoreDetail,
	StoresTable,
	Login,
	Home, CurrencyExchangeHistory
} from 'modules'


function useAppRoutes() {
	const {user} = useAppContext()

	const routes = {
		[ROLE_LIST.ADMIN]: [
			{
				path: '/',
				element: <AdminLayout/>,
				children: [
					{
						index: true,
						element: <Navigate to={routeByRole(user?.role)} replace/>
					},
					{
						path: 'admin',
						children: [
							{
								index: true,
								element: <Navigate to={routeByRole(user?.role)} replace/>
							},
							{
								path: 'home',
								children: [
									{
										index: true,
										element: <Home/>
									},
									{
										path: 'product-exchange',
										element: <ProductExchange/>
									},
									{
										path: 'daily-currency',
										element: <DailyCurrency/>
									},
									{
										path: 'currency-exchange',
										children: [
											{
												index: true,
												element: <CurrencyExchange/>
											},
											{
												path: 'history',
												element: <CurrencyExchangeHistory/>
											},
											{
												path: ':exchangeId',
												children: [
													{
														index: true,
														element: <CurrencyExchange detail={true}/>
													}
												]
											}
										]
									}
								]
							},
							{
								path: 'products',
								children: [
									{
										index: true,
										element: <ProductsTable/>
									},
									{
										path: 'exchange',
										element: <ProductExchange/>
									}
								]
							},
							{
								path: 'database',
								element: <DatabaseTable/>
							},
							{
								path: 'stores',
								children: [
									{
										index: true,
										element: <StoresTable/>
									},
									{
										path: 'detail/:id',
										element: <StoreDetail/>
									}
								]
							},
							{
								path: 'clients',
								children: [
									{
										index: true,
										element: <ClientsTable/>
									},
									{
										path: 'detail/:customerId',
										children: [
											{
												index: true,
												element: <ClientDetail/>
											},
											{
												path: ':exchangeId',
												children: [
													{
														index: true,
														element: <Navigate to={routeByRole(user?.role)} replace/>
													},
													{
														path: 'currency-exchange',
														element: <CurrencyExchange detail={true}/>
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				path: '*',
				element: <Navigate to={routeByRole(user?.role)} replace/>
			}
		],
		[ROLE_LIST.SELLER]: [
			{
				path: '/',
				element: <Outlet/>,
				children: [
					{
						index: true,
						element: <Navigate to={routeByRole(user?.role)} replace/>
					},
					{
						path: 'seller',
						children: [
							{
								index: true,
								element: <Navigate to={routeByRole(user?.role)} replace/>
							},
							{
								path: 'home',
								element: <h1>Seller dashboard</h1>
							}
						]
					}
				]
			},
			{
				path: '*',
				element: <Navigate to={routeByRole(user?.role)} replace/>
			}
		],
		default: [
			{
				path: '/login',
				element: <Login/>
			},
			{
				path: '*',
				element: <Navigate to="/login" replace/>
			}
		]
	}

	return useRoutes(routes[user?.role ?? 'default'] || routes.default)
}

export default useAppRoutes
