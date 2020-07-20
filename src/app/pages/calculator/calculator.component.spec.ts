import {CalculatorComponent} from "../calculator/calculator.component"
import {OrderService} from 'src/app/services/order.service'
import {ShellService} from 'src/app/system/services/shell.service'
import {Boot} from 'src/app/models/boot.model'
import {CableType} from 'src/app/models/cableType.model'
import {CoilCableCoilBootMapping} from 'src/app/models/coilCableCoilBootMapping.model'
import {CoilPackType} from 'src/app/models/coilPackType.model'
import {EngineType} from 'src/app/models/engineType.model'

describe("CalculatorComponent", () => {

  let fixture: CalculatorComponent
  let _authenticationService = ({
    users: {
      all: [],
      current: null
    }
  } as any)
  let _httpService
  let _routerService = ({
    navigateByUrl: jest.fn(),
    url: "/calculator"
  } as any)
  let _titleService = ({setTitle: jest.fn()} as any)
  let _vehicleService
  let _shellService = new ShellService(_httpService, _routerService, _titleService)

  beforeEach(() => {
    let _orderService = new OrderService(_httpService)
    fixture = new CalculatorComponent(_authenticationService, _orderService, _shellService, _vehicleService)
    _orderService.getBoots = jest.fn(async () => randomizeSuccess().then(() => {
      _orderService.boots.coil = [new Boot()]
      return _orderService.boots.plug = [new Boot()]
    }))
    _orderService.getCableTypes = jest.fn(async () => randomizeSuccess().then(() => _orderService.cableTypes = [new CableType()]))
    _orderService.getCoilCableCoilBootMappings = jest.fn(async () => randomizeSuccess().then(() => [new CoilCableCoilBootMapping()]))
    _orderService.getCoilCablePlugBootIDs = jest.fn(async () => randomizeSuccess().then(() => _orderService.coilCablePlugBootIDs = [1]))
    _orderService.getCoilPackTypes = jest.fn(async () => randomizeSuccess().then(() => _orderService.coilPackTypes =
      [new CoilPackType]))
    _orderService.getEngineTypes = jest.fn(async () => randomizeSuccess().then(() => _orderService.engineTypes = [new EngineType()]))
  })


  it("should instantiate CalculatorComponent", () => expect(fixture).toBeTruthy())

  it("should return associated engineTypeID", async () => {
    await fixture.ngOnInit()
    expect(fixture.isInitialized).toEqual(!!fixture.order.engineTypeID)
  })
})

const randomizeSuccess = (): Promise<boolean> => new Promise((resolve, reject) => {
  let isSuccess: any = (Math.random() * 2)
  if (((isSuccess === 2) ? 1 : Math.floor(isSuccess)))
    resolve(true)
  else
    reject(false)
})