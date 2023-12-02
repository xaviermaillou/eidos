export const beautifyString: (input: string) => string = (string) => {
    const formatted = string.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase()
}