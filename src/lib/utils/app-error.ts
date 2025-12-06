import { ValidationError } from "yup";


export default class AppError {
    protected message: string | ValidationError[] = '';
    protected status: number = 500;

    constructor(message: string | ValidationError[], status: number) {
        this.message = message;
        this.status = status;

    }
}