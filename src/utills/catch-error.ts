import { AxiosError } from "axios"

export const catchError = (error: AxiosError | Error | unknown) => {
    if(error instanceof AxiosError) throw new AxiosError(error.message)
    if(error instanceof Error) throw new Error(error.message)
    throw new Error("Something went wrong")
}