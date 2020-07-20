import {Address} from "./address.model"
import {Cable} from "./cable.model"
import {DBO} from "./DBO.model"
import {Vehicle} from "./vehicle.model"

export class Order extends DBO {
    ID: string = null
    address = new Address()
    addressID: number = null
    cableTypeID: number = 0
    cavityDepth: number = 0
    coilCableIDs: number[] = []
    coilCables: Cable[] = []
    coilPackTypeID: number = 0
    coilTowerOuterDiameter: number = 0
    cost: number = null
    cylinderCount: number = 0
    dealerID: number = 0
    dealerPrice: number = null
    emailAddress: string = null
    engineCode: string = null
    engineSize: string = null
    engineTypeID: number = 0
    firstName: string = null
    isDOHC: boolean = false
    isEngineReplacement: boolean = false
    isNumbered: boolean = false
    lastName: string = null
    phoneNumber: string = null
    plugCableIDs: number[] = []
    plugCables: Cable[] = []
    retailPrice: number = null
    statusID: number = 1
    userID: number = null
    valveCount: number = 0
    vehicle = new Vehicle()
    vehicleID: number = 0
    vendorID: number = 0
}