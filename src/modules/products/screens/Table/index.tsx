import {useQueryClient} from '@tanstack/react-query'
import {Box, Cart, Plus} from 'assets/icons'
import {Button, FileUploader, HorizontalTab, PageTitle} from 'components'
import {useSearchParams} from 'hooks'
import useTypedSelector from 'hooks/useTypedSelector'
import {ISelectOption} from 'interfaces/form.interface'
import Products from 'modules/products/components/Products'
import {interceptor} from 'libraries/index'
import ProductWarehouse from 'modules/products/components/ProductWarehouse'
import {showMessage} from 'utilities/alert'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {findName, noop} from 'utilities/common'


const tabOptions: ISelectOption[] = [
	{
		label: 'Products warehouse',
		value: 'warehouse',
		icon: <Box/>
	},
	{
		label: 'Products list',
		value: 'products',
		icon: <Cart/>
	}
]

const Index = () => {
	const {paramsObject: {tab = tabOptions[0]?.value, ...rest}, addParams} = useSearchParams()
	const {t} = useTranslation()
	const query = useQueryClient()
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const [exelLoader, setIsLoading] = useState<boolean>(false)
	const {store} = useTypedSelector(state => state.stores)


	return (
		<>
			<PageTitle title={findName(tabOptions, tab?.toString(), 'label') || ''}>
				{
					tab == tabOptions[1]?.value &&
					<div className="flex align-center gap-lg">
						<Button
							icon={<Plus/>}
							onClick={() => addParams({modal: 'product'})}
						>
							Add a new product
						</Button>
						<Button
							style={{marginTop: 'auto'}}
							disabled={isXMLLoading}
							// icon={<FileUploaderIcon style={{maxWidth: '1.2rem', transform: 'rotate(180deg)'}}/>}
							onClick={() => {
								setIsXMLLoading(true)
								interceptor.get(`products/download/template`, {
									responseType: 'blob',
									params: {
										...rest,
										store: store?.value
									}
								}).then(res => {
									const blob = new Blob([res.data])
									const link = document.createElement('a')
									link.href = window.URL.createObjectURL(blob)
									link.download = `${t(`${t('Products')}`)}.xlsx`
									link.click()
								}).finally(() => {
									setIsXMLLoading(false)
								})
							}}
							mini={true}
						>
							Template
						</Button>
						<Button
							style={{marginTop: 'auto'}}
							disabled={isXMLLoading}
							// icon={<FileUploaderIcon style={{maxWidth: '1.2rem', transform: 'rotate(180deg)'}}/>}
							onClick={() => {
								setIsXMLLoading(true)
								interceptor.get(`products/export`, {
									responseType: 'blob',
									params: {
										...rest,
										store: store?.value
									}
								}).then(res => {
									const blob = new Blob([res.data])
									const link = document.createElement('a')
									link.href = window.URL.createObjectURL(blob)
									link.download = `${t(`${t('Products')}`)}.xlsx`
									link.click()
								}).finally(() => {
									setIsXMLLoading(false)
								})
							}}
							mini={true}
						>
							Export
						</Button>
						<FileUploader
							content={
								<Button
									style={{marginTop: 'auto'}}
									// icon={<FileUploaderIcon style={{maxWidth: '1.2rem'}}/>}
									disabled={exelLoader}
									mini={true}
								>
									Import
								</Button>
							}
							type="exel"
							handleChange={(files) => {
								const item = files[0]
								setIsLoading(true)
								const formData = new FormData()
								formData.append('xlsx-file', item)
								formData.append('name', item.name)
								interceptor
									.post(`products/import/new`, formData, {
										headers: {
											'Content-Type': 'multipart/form-data'
										},
										params: {
											...rest,
											store: store?.value
										}
									})
									.then(() => {
										showMessage(`${t('File successfully accepted')}`, 'success')
										query.invalidateQueries({queryKey: ['products']}).then(noop)
									})
									.catch(() => {
										showMessage(`${item.name} ${t('File not accepted')}`, 'error')
									})
									.finally(() => {
										setIsLoading(false)
									})
							}}
							value={undefined}
							id="series"
						/>
						<FileUploader
							content={
								<Button
									style={{marginTop: 'auto'}}
									// icon={<FileUploaderIcon style={{maxWidth: '1.2rem'}}/>}
									disabled={exelLoader}
									mini={true}
								>
									Edit
								</Button>
							}
							type="exel"
							handleChange={(files) => {
								const item = files[0]
								setIsLoading(true)
								const formData = new FormData()
								formData.append('xlsx-file', item)
								formData.append('name', item.name)
								interceptor
									.post(`products/import`, formData, {
										headers: {
											'Content-Type': 'multipart/form-data'
										},
										params: {
											...rest,
											store: store?.value
										}
									})
									.then(() => {
										showMessage(`${t('File successfully accepted')}`, 'success')
										query.invalidateQueries({queryKey: ['products']}).then(noop)
									})
									.catch(() => {
										showMessage(`${item.name} ${t('File not accepted')}`, 'error')
									})
									.finally(() => {
										setIsLoading(false)
									})
							}}
							value={undefined}
							id="series"
						/>
					</div>
				}
			</PageTitle>
			<HorizontalTab
				tabs={tabOptions}
				fallbackValue={tabOptions[0]?.value}
				style={{marginTop: '1rem', marginBottom: '1rem'}}
			/>
			{
				tab === 'products' ? <Products/> :
					tab === 'warehouse' ? <ProductWarehouse/> :
						null
			}
		</>
	)
}

export default Index