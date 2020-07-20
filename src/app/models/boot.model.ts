import {DBO} from "./DBO.model"
import {Terminal} from "./terminal.model"

export class Boot extends DBO {
    angle: number = 0
    bootName: string = null
    code: string = null
    cost: number = 0
    terminal = new Terminal()
    terminalID: number = 0
    wireStartRatio: number = 0
}