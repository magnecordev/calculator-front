import {DBO} from './DBO.model'

export class Address extends DBO {
    street: string = null
    city: string = null
    stateID: number = null
    zipCode: number = null
}