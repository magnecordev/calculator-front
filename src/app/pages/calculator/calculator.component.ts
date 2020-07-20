import {ActivatedRoute} from "@angular/router"
import {AuthenticationService} from "src/app/system/services/authentication.service"
import {Boot} from "src/app/models/boot.model"
import {Cable} from "src/app/models/cable.model"
import {CableType} from "src/app/models/cableType.model"
import {CoilPackType} from "src/app/models/coilPackType.model"
import {Component, OnInit} from "@angular/core"
import {Order} from "src/app/models/order.model"
import {OrderService} from "src/app/services/order.service"
import {ShellService} from "src/app/system/services/shell.service"
import {VehicleService} from "src/app/services/vehicle.service"
import {OrderStatus} from 'src/app/models/orderStatus.model'
import {Vehicle} from 'src/app/models/vehicle.model'

interface CableCounts {
  coil: number
  plug: number
}

interface NestedBootObj {
  angles: number[],
  boots: {
    [property: number]: Boot[]
  },
}

interface BootObj extends NestedBootObj {
  bootIDs: {
    [property: number]: Boot
  }
}

interface Dictionaries {
  cableTypes: {
    [property: number]: CableType
  }
  coilBoots: BootObj
  coilCables: {
    coilBoots: {
      [property: number]: NestedBootObj
    }
    plugBoots: NestedBootObj
  }
  coilPackTypes: {
    [property: number]: CoilPackType
  }
  orderStatuses: {
    [property: number]: OrderStatus
  }
  plugBoots: BootObj
}

@Component({
  selector: "calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.scss"]
})

export class CalculatorComponent implements OnInit {

  cableCounts: CableCounts = {
    coil: 0,
    plug: 0
  }
  dictionaries: Dictionaries = {
    cableTypes: {},
    coilBoots: {
      angles: [],
      bootIDs: {},
      boots: {}
    },
    coilCables: {
      coilBoots: {},
      plugBoots: {
        angles: [],
        boots: {}
      }
    },
    coilPackTypes: {},
    orderStatuses: null,
    plugBoots: {
      angles: [],
      bootIDs: {},
      boots: {}
    }
  }
  isVisible: any = {
    measure: false,
    orderButton: false
  }
  isInitialized: boolean = undefined
  order: Order = new Order()
  subscriptions: any[] = []

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    public _orderService: OrderService,
    public _shellService: ShellService,
    private _vehicleService: VehicleService
  ) {
    this.subscriptions.push(this._activatedRoute.params.subscribe(async () => {
      if (this.isInitialized)
        await this.checkForUIDOrder()
    }))
  }

  async ngOnInit(): Promise<void> {
    this.isInitialized = (await new Promise(async (resolve, reject) => {
      if (!this._shellService._router.url.startsWith("/calculator"))
        window.location.pathname = "calculator"
      this._shellService._title.setTitle("Pricing Calculator")
      if (!this.order.ID && this._authenticationService.users.current) {
        let user = this._authenticationService.users.current
        this.order.addressID = (this.order.address = JSON.parse(JSON.stringify(user.address))).ID
        this.order.emailAddress = user.emailAddress
        this.order.firstName = user.firstName
        this.order.lastName = user.lastName
        this.order.phoneNumber = user.phoneNumber
        this.order.userID = user.ID
      }
      this.order.dealerID = this._shellService.dealer.ID
      await this._orderService.getOrderStatuses().then(orderStatuses => {
        let tempObj = {}
        orderStatuses.forEach(orderStatus => (tempObj[orderStatus.ID] = orderStatus))
        this.dictionaries.orderStatuses = tempObj
      }).catch(error => reject(error.data))
      if (!this._orderService.cableTypes.length)
        await this._orderService.getCableTypes().catch(error => reject(error.data))
      this._orderService.cableTypes.forEach(cableType => this.dictionaries.cableTypes[cableType.ID] = cableType)
      this.order.cableTypeID = this._orderService.cableTypes[0].ID
      if (!this._orderService.boots.coil.length)
        await this._orderService.getBoots().catch(error => reject(error.data))
      let coilBootObj = (this.dictionaries.coilBoots = {angles: [], boots: {}, bootIDs: {}})
      this._orderService.boots.coil.forEach(coilBoot => {
        if (!coilBootObj.boots[coilBoot.angle]) {
          coilBootObj.angles.push(coilBoot.angle)
          coilBootObj.boots[coilBoot.angle] = []
        }
        coilBootObj.bootIDs[coilBoot.ID] = coilBoot
        coilBootObj.boots[coilBoot.angle].push(coilBoot)
      })
      coilBootObj.angles.sort()
      if (!this._orderService.boots.plug.length)
        await this._orderService.getBoots(true).catch(error => reject(error.data))
      let plugBootObj = (this.dictionaries.plugBoots = {angles: [], boots: {}, bootIDs: {}})
      this._orderService.boots.plug.forEach(plugBoot => {
        if (!plugBootObj.boots[plugBoot.angle]) {
          plugBootObj.angles.push(plugBoot.angle)
          plugBootObj.boots[plugBoot.angle] = []
        }
        plugBootObj.bootIDs[plugBoot.ID] = plugBoot
        plugBootObj.boots[plugBoot.angle].push(plugBoot)
      })
      plugBootObj.angles.sort()
      if (!this._orderService.coilCableCoilBootMappings.length)
        await this._orderService.getCoilCableCoilBootMappings().catch(error => reject(error.data))
      this._orderService.coilCableCoilBootMappings.forEach(coilBootMapping => {
        let coilCableCoilObj = (this.dictionaries.coilCables.coilBoots[coilBootMapping.coilPackTypeID] = {angles: [], boots: {}})
        coilBootMapping.coilBootIDs.forEach(coilBootID => {
          let coilBoot: Boot = this.dictionaries.coilBoots.bootIDs[coilBootID]
          if (!coilCableCoilObj.boots[coilBoot.angle]) {
            coilCableCoilObj.angles.push(coilBoot.angle)
            coilCableCoilObj.boots[coilBoot.angle] = []
          }
          coilCableCoilObj.boots[coilBoot.angle].push(coilBoot)
        })
        coilCableCoilObj.angles.sort()
      })
      if (!this._orderService.coilCablePlugBootIDs.length)
        await this._orderService.getCoilCablePlugBootIDs().catch(error => reject(error.data))
      let coilCablePlugObj = (this.dictionaries.coilCables.plugBoots = {angles: [], boots: {}})
      this._orderService.coilCablePlugBootIDs.forEach(plugBootID => {
        let plugBoot: Boot = this.dictionaries.plugBoots.bootIDs[plugBootID]
        if (!coilCablePlugObj.boots[plugBoot.angle]) {
          coilCablePlugObj.angles.push(plugBoot.angle)
          coilCablePlugObj.boots[plugBoot.angle] = []
        }
        coilCablePlugObj.boots[plugBoot.angle].push(plugBoot)
      })
      coilCablePlugObj.angles.sort()
      if (!this._orderService.coilPackTypes.length)
        await this._orderService.getCoilPackTypes().catch(error => reject(error.data))
      this._orderService.coilPackTypes.forEach(coilPackType => (this.dictionaries.coilPackTypes[coilPackType.ID] = coilPackType))
      this.isVisible.measure = this.dictionaries.coilPackTypes[(this.order.coilPackTypeID = this._orderService.coilPackTypes[0].ID)]
        .isMeasureUIVisible
      if (!this._orderService.engineTypes.length)
        await this._orderService.getEngineTypes().catch(error => reject(error.data))
      resolve(!!(this.order.engineTypeID = this._orderService.engineTypes[0].ID))
    }).catch(() => false) as boolean)
    this.checkForUIDOrder()
  }

  getCylinderCount(): void {
    let vehicle: Vehicle = this.order.vehicle
    if (vehicle.make && vehicle.model && (Number(vehicle.year).toString().length === 4))
      this._vehicleService.getVehicle(vehicle).then(vehicleData => {
        if (vehicleData.Trims.length) {
          this.order.cylinderCount = vehicleData.Trims[0].model_engine_cyl
          this.mergeCylinderCount()
        }
      })
  }

  mergeBoot(cable: Cable, isPlugBoot: boolean = false, isCoilCable: boolean = false) {
    let property: string = (isPlugBoot ? "plug" : "coil")
    let angle: string = cable[`${property}BootAngle`]
    let bootsProperty: string = `${property}Boots`
    if (isCoilCable)
      cable[`${property}BootID`] = (isPlugBoot ? this.dictionaries.coilCables[bootsProperty].boots[angle][0] :
        this.dictionaries.coilCables[bootsProperty][this.order.coilPackTypeID].boots[angle][0]).ID
    else
      cable[`${property}BootID`] = this.dictionaries[bootsProperty].boots[angle][0].ID
  }

  mergeCoilPackType(coilPackTypeID: number) {
    if (!(this.isVisible.measure = this.dictionaries.coilPackTypes[coilPackTypeID].isMeasureUIVisible))
      this.order.cavityDepth = (this.order.coilTowerOuterDiameter = null)
    this.order.coilCables.forEach(coilCable => coilCable.coilBootAngle = (coilCable.coilBootID = null))
  }

  mergeCylinderCount(): void {
    //add real deletion operations in a bit
    this.order.plugCables = []
    for (let i = 0; i < this.order.cylinderCount; i++)
      this.addCable()
    this.mergeCableCounts()
  }

  addCable(isCoilCable: boolean = false) {
    this.order[`${(isCoilCable ? "coil" : "plug")}Cables`].push(new Cable())
    this.mergeCableCounts()
  }

  copyCable(cable: Cable, isAll: boolean = false, isCoilCable: boolean = false) {
    let cableReference: Cable[] = this.order[`${isCoilCable ? "coil" : "plug"}Cables`]
    if (isAll)
      this.order[`${isCoilCable ? "coil" : "plug"}Cables`] = cableReference.map(existingCable => {
        if (existingCable.isDelete)
          return existingCable
        else {
          let existingCableID: number = existingCable.ID
          existingCable = JSON.parse(JSON.stringify(cable))
          existingCable.ID = existingCableID
          return existingCable
        }
      })
    else {
      let tempCable: Cable = JSON.parse(JSON.stringify(cable))
      tempCable.ID = 0
      cableReference.push(tempCable)
    }
    this.mergeCableCounts()
  }

  deleteCable(cableArray: Cable[], index: number) {
    let cable: Cable = cableArray[index]
    if (cable.ID)
      cable.isDelete = true
    else
      cableArray.splice(index, 1)
    this.mergeCableCounts()
  }

  mergeCableCounts = (): CableCounts => this.cableCounts = {
    coil: this.order.coilCables.filter(coilCable => !coilCable.isDelete).length,
    plug: this.order.plugCables.filter(plugCable => !plugCable.isDelete).length
  }

  async saveOrder(isOrder: boolean = false, isDelete: boolean = false) {
    if (isDelete)
      if (!window.confirm("Please confirm the deletion of this order."))
        return
    let order: Order = JSON.parse(JSON.stringify(this.order))
    if (!isDelete && isOrder) {
      let modalText: string = ""
      if (!(order.firstName && order.lastName))
        modalText += `Please provide your full name.\n`
      if (!(order.address.street && order.address.city && order.address.stateID && order.address.zipCode))
        modalText += `Please provide your shipping address.\n`
      if (!order.emailAddress)
        modalText += `Please provide your email address.\n`
      if (!order.phoneNumber)
        modalText += `Please provide your phone number.\n`
      if (!(order.vehicle.make && order.vehicle.model && order.vehicle.year))
        modalText += `Please provide a valid vehicle.\n`
      if (this.isVisible.measure && !(order.cavityDepth && order.coilTowerOuterDiameter))
        modalText += `Both the cavity depth and coil tower outer diameter were not provided.\n`
      if (!order.plugCables.length)
        modalText += `Please add at least one plug cable.\n`
      if (order.plugCables.concat(order.coilCables).some(cable => !(cable.coilBootID && cable.plugBootID)))
        modalText += `Some cables do not have both a plug and coil boot.\n`
      if (modalText) {
        alert(modalText += `\nPlease fix the following errors before you place your final order.`)
        return
      }
    }
    order.isDelete = isDelete
    await this._orderService.saveOrder(order, isOrder).then(orderID => {
      alert(`Your order was ${isDelete ? "deleted" : "saved"} successfully.`)
      this._shellService._router.navigateByUrl("account")
    }).catch(error => alert(error.data))
  }

  async checkForUIDOrder() {
    let GUID: string = (this._shellService.orderGUID = null)
    if ((GUID = this._activatedRoute.snapshot.params.GUID))
      await this._orderService.getOrderFromGUID(GUID).then(order => (this.order = order)).catch(error => alert(error.data))
    this.mergeCableCounts()
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

}