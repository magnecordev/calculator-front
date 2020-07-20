import {Boot} from "../models/boot.model"
import {CableType} from "../models/cableType.model"
import {EngineType} from "../models/engineType.model"
import {environment} from "src/environments/environment"
import {HttpService} from "../system/services/http.service"
import {Injectable} from "@angular/core"
import {CoilCableCoilBootMapping} from "../models/coilCableCoilBootMapping.model"
import {CoilPackType} from "../models/coilPackType.model"
import {Order} from "../models/order.model"
import {OrderStatus} from "../models/orderStatus.model"

interface Boots {
  coil: Boot[]
  plug: Boot[]
}

@Injectable({
  providedIn: "root"
})

export class OrderService {

  boots: Boots = {
    coil: [],
    plug: []
  }
  cableTypes: CableType[] = []
  coilCableCoilBootMappings: CoilCableCoilBootMapping[] = []
  coilCablePlugBootIDs: number[] = []
  coilPackTypes: CoilPackType[] = []
  engineTypes: EngineType[] = []
  orderStatuses: OrderStatus[] = []

  constructor(
    private _http: HttpService
  ) {}

  getBoots(isPlug: boolean = false): Promise<Boot[]> {
    return this._http.get(`${environment.middlewareURI}${(isPlug ? "plug" : "coil")}Boots`).then(boots => (this.boots[(isPlug ? "plug"
      : "coil")] = boots))
  }

  getCableTypes(): Promise<CableType[]> {
    return this._http.get(`${environment.middlewareURI}cableTypes`).then(cableTypes => (this.cableTypes = cableTypes))
  }

  getCoilCableCoilBootMappings(): Promise<CoilCableCoilBootMapping[]> {
    return this._http.get(`${environment.middlewareURI}coilCableCoilBootMappings`).then(coilCableCoilBootMappings =>
      (this.coilCableCoilBootMappings = coilCableCoilBootMappings))
    // coilCableCoilBootMappings.forEach(mapping => (mapping.coilBootIDs = mapping.coilBootIDs.map(ID => Number(ID))))
  }

  getCoilCablePlugBootIDs(): Promise<number[]> {
    return this._http.get(`${environment.middlewareURI}coilCablePlugBootIDs`).then(coilCablePlugBootIDs =>
      (this.coilCablePlugBootIDs = coilCablePlugBootIDs.plugBootIDs))
  }

  getCoilPackTypes(): Promise<CoilPackType[]> {
    return this._http.get(`${environment.middlewareURI}coilPackTypes`).then(coilPackTypes => (this.coilPackTypes = coilPackTypes))
  }

  getEngineTypes(): Promise<EngineType[]> {
    return this._http.get(`${environment.middlewareURI}engineTypes`).then(engineTypes => (this.engineTypes = engineTypes))
  }

  getOrderFromGUID(GUID: string): Promise<Order> {
    return this._http.get(`${environment.middlewareURI}order/GUID/${GUID}`)
  }

  getOrders(): Promise<Order[]> {
    return this._http.get(`${environment.middlewareURI}orders`)
  }

  getOrderStatuses(): Promise<OrderStatus[]> {
    return (this.orderStatuses.length ? Promise.resolve(this.orderStatuses) : this._http.get(`${environment.middlewareURI}orderstatuses`)).then(orderStatuses =>
      (this.orderStatuses = orderStatuses))
  }

  saveOrder(order: Order, isOrder: boolean = false): Promise<string> {
    return this._http.post(`${environment.middlewareURI}order/save/${isOrder}`, order)
  }

}