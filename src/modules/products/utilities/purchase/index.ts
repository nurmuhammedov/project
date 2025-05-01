type FieldItem = {
	[key: string]: string
};


export const convertObjectToString = (item: FieldItem): string => {
	const values = Object.entries(item)
		.filter(([key]) => key !== 'id')
		.sort(([a], [b]) => Number(a) - Number(b))
		.map(([, value]) => value)

	return values.join('')
}