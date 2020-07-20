import {DBO} from "./DBO.model"

export class CableType extends DBO {
    cableTypeName: string = null
    code: string = null
    color: string = null
    costOfGood: number = 0
    diameter: number = 0
}