import useActions from 'hooks/useActions'
import {useEffect} from 'react'
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
	Home,
	CurrencyExchangeHistory,
	ProductExchangeHistory,
	StoreWarehouseDetail,
	ClientWarehouseDetail,
	ProductsWarehouseReport,
	StocksByPriceReport,
	StockByPurchaseReport,
	SaleByCustomerReport,
	SalesTotalReport,
	Service,
	SaleTemporaries,
	Temporaries,
	DailyCurrencyHistory, TransferReport
} from 'modules'
import Transfer from 'modules/products/components/Transfer'


function useAppRoutes() {
	const {user} = useAppContext()
	const {fetchStores} = useActions()

	useEffect(() => {
		fetchStores()
	}, [])

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
										path: 'service',
										element: <Service/>
									},
									{
										path: 'product-exchange',
										children: [
											{
												index: true,
												element: <ProductExchange/>
											},
											{
												path: 'history',
												children: [
													{
														index: true,
														element: <ProductExchangeHistory/>
													},
													{
														path: ':id',
														element: <ProductExchange detail={true}/>
													},
													{
														path: 'edit',
														children: [
															{
																path: ':id',
																element: <ProductExchange edit={true}/>
															}
														]
													}
												]
											}
										]
									},
									{
										path: 'daily-currency',
										children: [
											{
												index: true,
												element: <DailyCurrency/>
											},
											{
												path: 'history',
												children: [
													{
														index: true,
														element: <DailyCurrencyHistory/>
													}
												]
											}
										]
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
											},
											{
												path: 'expense/:exchangeId',
												children: [
													{
														index: true,
														element: <Service detail={true}/>
													}
												]
											}
										]
									}
								]
							},
							{
								path: 'trade',
								children: [
									{
										index: true,
										element: <ProductExchange/>
									},
									{
										path: 'service',
										element: <Service/>
									},
									{
										path: 'product-exchange',
										children: [
											{
												index: true,
												element: <ProductExchange/>
											}
										]
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
										children: [
											{
												index: true,
												element: <ProductExchange/>
											}
										]
									}
								]
							},
							{
								path: 'reports',
								children: [
									{
										index: true,
										element: <ProductsWarehouseReport/>
									},
									{
										path: 'by-warehouse',
										element: <ProductsWarehouseReport/>
									},
									{
										path: 'by-price',
										element: <StocksByPriceReport/>
									},
									{
										path: 'by-purchase',
										element: <StockByPurchaseReport/>
									},
									{
										path: 'by-customer',
										element: <SaleByCustomerReport/>
									},
									{
										path: 'by-total',
										element: <SalesTotalReport/>
									},
									{
										path: 'by-sale-temporaries',
										element: <SaleTemporaries/>
									},
									{
										path: 'by-temporaries',
										element: <Temporaries/>
									},
									{
										path: 'by-transfer',
										children: [
											{
												index: true,
												element: <TransferReport/>
											},
											{
												path: ':id',
												children: [
													{
														index: true,
														element: <Transfer detail={true}/>
													}
												]
											},
											{
												path: 'edit/:id',
												children: [
													{
														index: true,
														element: <Transfer edit={true}/>
													}
												]
											}
										]
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
										children: [
											{
												index: true,
												element: <StoreDetail/>
											},
											{
												path: ':productId',
												element: <StoreWarehouseDetail/>
											}
										]
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
												path: 'product-exchange',
												children: [
													{
														path: 'history',
														children: [
															{
																path: ':id',
																element: <ProductExchange detail={true}/>
															},
															{
																path: 'edit',
																children: [
																	{
																		path: ':id',
																		element: <ProductExchange edit={true}/>
																	}
																]
															}
														]
													}
												]
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
											},
											{
												path: 'warehouse/:productId',
												element: <ClientWarehouseDetail/>
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