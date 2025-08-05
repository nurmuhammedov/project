function formatDate(isoDateString: string | null | undefined): string {
	if (!isoDateString) return ''
	const date = new Date(isoDateString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${day}.${month}.${year} - ${hours}:${minutes}`
}

const getDate = (dateStr?: string): string => {
	let date: Date

	if (dateStr) {
		date = new Date(dateStr)
		if (isNaN(date.getTime())) return ''
	} else {
		date = new Date()
	}

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${day}.${month}.${year}`
}

export const getTwoDaysAgoDate = (): string => {
	const date = new Date()

	date.setDate(date.getDate() - 2)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() 0 dan boshlanadi (0 = Yanvar), shuning uchun +1 qo'shamiz
	const year = date.getFullYear()

	return `${year}-${month}-${day}`
}

export {
	formatDate,
	getDate
}