export interface User{
    id?: string,
    firstname: string,
    lastname: string,
    username: string,
    email: string
    role: string,
    password?: string,
    eventeeReminder?: Date
}