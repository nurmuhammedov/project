import {useCallback, useEffect, forwardRef, useState, ReactNode} from 'react'
import {useDropzone, FileWithPath} from 'react-dropzone'
import styles from './styles.module.scss'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {IFile} from 'interfaces/form.interface'
import interceptor from 'libraries/interceptor'
import {showMessage} from 'utilities/alert'
import {Input} from 'components'
import {Delete, Download, FileUploader} from 'assets/icons'


interface FileUploaderProps {
	onChange?: (file: IFile | IFile[] | undefined) => void
	handleOnChange?: (arr: string[] | undefined) => void
	handleChange?: (acceptedFiles: FileWithPath[]) => void
	onBlur?: () => void
	value: IFile | IFile[] | undefined | null
	multi?: boolean
	id: string
	label?: string
	content?: ReactNode
	error?: string
	type?: 'pdf' | 'image' | 'txt' | 'exel'
}

const Index = forwardRef<HTMLInputElement, FileUploaderProps>(({
	                                                               onBlur,
	                                                               onChange,
	                                                               handleOnChange,
	                                                               handleChange,
	                                                               value,
	                                                               content,
	                                                               label,
	                                                               error,
	                                                               id,
	                                                               type = 'pdf',
	                                                               multi = false
                                                               }, ref) => {
		const {t} = useTranslation()
		const [isLoading, setIsLoading] = useState<boolean>(false)
		const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
		const [percentage, setPercentage] = useState<number>(0)

		const onDrop = useCallback(
			(acceptedFiles: FileWithPath[]) => {
				if (handleChange && acceptedFiles?.length) {
					handleChange(acceptedFiles)
				} else if (handleOnChange && acceptedFiles?.length) {
					const file = acceptedFiles?.[0]
					if (!file) return
					const reader = new FileReader()
					reader.onload = () => {
						const text = reader.result as string
						const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
						handleOnChange?.(lines)
					}
					reader.readAsText(file)
				} else if (!isLoading) {
					acceptedFiles.map((item) => {
						setIsLoading(true)
						const formData = new FormData()
						formData.append('file', item)
						formData.append('name', item.name)
						interceptor
							.post(`attachment`, formData, {
								headers: {
									'Content-Type': 'multipart/form-data'
								},
								onUploadProgress: (progressEvent) => {
									const total = progressEvent.total || 0
									const loaded = progressEvent.loaded || 0
									setPercentage(Math.round((loaded / total) * 100))
								}
							})
							.then((res) => {
								showMessage(`${res.data.name} ${t('File successfully accepted')}`, 'success')
								if (multi) {
									if (Array.isArray(value) && value) {
										onChange?.([...value, res.data] as IFile[])
									} else {
										onChange?.([res.data])
									}
								} else {
									onChange?.(res.data)
								}
							})
							.catch(() => {
								showMessage(`${item.name} ${t('File not accepted')}`, 'error')
							})
							.finally(() => {
								setIsLoading(false)
							})
					})
				}
			},
			[isLoading, multi, onChange, t, value]
		)


		const {
			getRootProps,
			getInputProps,
			isDragActive,
			fileRejections
		} = useDropzone({
			onDrop,
			accept: type === 'pdf' ? {'application/pdf': ['.pdf']}
				: type === 'txt' ? {'text/plain': ['.txt']} : type === 'exel' ? {
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
					'application/vnd.ms-excel': ['.xls']
				} : {
					'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png']
				},
			maxFiles: 1,
			maxSize: 10 * 1024 * 1024
		})


		useEffect(() => {
			if (fileRejections.length > 0) {
				fileRejections.map((item) => {
					item?.errors?.map((error) => {
						if (error.code === 'too-many-files') {
							showMessage(t('Send each file separately'))
						} else if (error.code === 'file-too-large') {
							showMessage(t('File must not exceed 10 mb'))
						} else if (error.code === 'file-invalid-type') {
							if (type === 'pdf') {
								showMessage(t('Only .pdf files are accepted'))
							} else if (type === 'txt') {
								showMessage(t('Only .txt files are accepted'))
							} else if (type === 'image') {
								showMessage(t('Only .txt files are accepted'))
							}
						}
					})
				})
			}
		}, [fileRejections, t, type])

		const handleDelete = (id: string | number) => {
			if (id && !isDeleteLoading && !isLoading && !!onChange) {
				setIsDeleteLoading(true)
				setIsLoading(true)
				interceptor
					.delete(`attachment/${id}`)
					.then(() => {
						if (Array.isArray(value)) {
							const newValue = value.filter(i => i.id !== id)
							if (newValue.length === 0) {
								onChange?.(undefined)
							} else {
								onChange?.(newValue as IFile[])
							}
						} else {
							onChange?.(undefined)
						}
						showMessage(`${t('File successfully removed')} 📄🡆🗑️`, 'success')
					})
					.finally(() => {
						setIsDeleteLoading(false)
						setIsLoading(false)
					})
			}
		}

		const handleDownload = (file?: string) => {
			if (file) window.open(file, '_blank')
		}

		return (
			<Input
				id={id}
				label={label}
				error={error}
			>
				<div
					className={
						classNames(styles.root, {
							[styles.isLoading]: isLoading || (!onChange && !handleOnChange && !handleChange),
							[styles.error]: !!error
						})
					}
				>
					{
						multi || Array.isArray(value) ? <>
								{
									((Array.isArray(value) && value.length < 10) || !value) &&
									<div className={styles.input} {...getRootProps()}>
										<input ref={ref} {...getInputProps()} onBlur={onBlur}/>
										<FileUploader/>
										{
											(isLoading && !isDeleteLoading) ? (
												<p><span>{percentage}% - {t('Loading...')}</span></p>
											) : isDragActive ?
												(
													<p><span>{t('Drop your files')}</span> 📂</p>
												) :
												(
													<p>
														<span>{t('Upload a file')}</span> ({type === 'pdf' ? '.pdf' : type === 'txt' ? '.txt' : '.jpg, .png, .jpeg'} - {t('up to 10 mb')})
													</p>
												)
										}
									</div>
								}
								{
									Array.isArray(value) && value &&
									<div className={styles.wrapper}>
										{
											value?.map((item, index) => {
												return (
													<div key={index} className={styles.values}>
														<div className={styles.value}>
															<Input
																id={item.id as string}
																value={item.name}
																disabled={true}
															/>
														</div>
														{
															!!onChange &&
															<div
																className={classNames(styles.icon, styles.delete, {[styles.isDelete]: isDeleteLoading})}
																onClick={() => handleDelete(item.id)}
															>
																<Delete/>
															</div>
														}
														<div className={styles.icon}
														     onClick={() => handleDownload(item.file)}>
															<Download/>
														</div>
													</div>
												)
											})
										}
									</div>
								}
							</> :
							value ?
								<div className={styles.values}>
									<div className={styles.value}>
										<Input
											id={value.id as string}
											value={value.name}
											disabled={true}
										/>
									</div>
									{
										!!onChange &&
										<div
											className={classNames(styles.icon, styles.delete, {[styles.isDelete]: isDeleteLoading})}
											onClick={() => handleDelete(value.id)}
										>
											<Delete/>
										</div>
									}
									<div className={styles.icon} onClick={() => handleDownload(value.file)}>
										<Download/>
									</div>
								</div> : content ?
									<div {...getRootProps()}>
										<input ref={ref} {...getInputProps()} onBlur={onBlur}/>
										{content}
									</div> :
									<div className={styles.input} {...getRootProps()}>
										<input ref={ref} {...getInputProps()} onBlur={onBlur}/>
										<FileUploader/>
										{
											(isLoading && !isDeleteLoading) ?
												(
													<p><span>{percentage}% - {t('Loading...')}</span></p>
												) : isDragActive ?
													(
														<p>{t('Drop your files')} 📂</p>
													) :
													(
														<p>
															<span>{t('Upload a file')}</span> ({type === 'pdf' ? '.pdf' : type === 'txt' ? '.txt' : '.jpg, .png, .jpeg'} - {t('up to 10 mb')})
														</p>
													)
										}
									</div>
					}
				</div>
			</Input>
		)
	}
)

export default Index
