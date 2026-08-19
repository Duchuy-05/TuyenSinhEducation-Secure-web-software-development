const successHandler = (status: number, message: string, data: any = null) => {
    return {
        status,
        message,
        data
    }
}

const errorHandler = (status: number, message: string) => {
    return {
        status,
        message,
    }
}

export { successHandler, errorHandler }