import {DBO} from "./DBO.model"

export class Cable extends DBO {
    cableLength: number = 0
    coilBootAngle: number = null
    coilBootID: number = 0
    plugBootAngle: number = null
    plugBootID: number = 0
}