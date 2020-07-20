import {Address} from "./address.model"
import {DBO} from "./DBO.model"

export class User extends DBO {
    addressID: number = 0
    address: Address = new Address()
    currentPassword: string = null
    emailAddress: string = null
    firstName: string = null
    isActive: boolean = true
    lastName: string = null
    phoneNumber: string = null
    previousPassword: string = null
    username: string = null
}