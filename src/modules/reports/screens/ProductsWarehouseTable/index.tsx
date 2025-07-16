import {
	Button,
	PageTitle
} from 'components'
import ProductWarehouse from 'modules/products/components/ProductWarehouse'
import {interceptor} from 'libraries/index'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'


const Stores = () => {
	const [isXMLLoading, setIsXMLLoading] = useState<boolean>(false)
	const {t} = useTranslation()

	return (
		<>
			<PageTitle title="Products warehouse">
				<div className="flex items-center gap-lg">
					<Button
						style={{marginTop: 'auto'}}
						disabled={isXMLLoading}
						onClick={() => {
							setIsXMLLoading(true)
							interceptor.get(`stocks/export`, {
								responseType: 'blob'
							}).then(res => {
								const blob = new Blob([res.data])
								const link = document.createElement('a')
								link.href = window.URL.createObjectURL(blob)
								link.download = `${t('Sales (by customer)')}.xlsx`
								link.click()
							}).finally(() => {
								setIsXMLLoading(false)
							})
						}}
						mini={true}
					>
						Export
					</Button>
				</div>
			</PageTitle>
			<ProductWarehouse/>
		</>
	)
}

export default Stores