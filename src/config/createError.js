export const createDevelopmentError = (message, status, stack) => {
    const err = new Error()
    err.status = status
    err.message = message
    err.stack = stack
    return err
}

export const createProductionError = (message, status) => {
    const err = new Error()
    err.status = status
    err.message = message
    return err
}
