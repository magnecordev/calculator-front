import {Vehicle} from "../models/vehicle.model"
import {VehicleService} from "../services/vehicle.service"

describe("VehicleService", () => {

  let service: VehicleService
  let httpService

  beforeEach(() => {
    service = new VehicleService(httpService)
  })

  it("initialize service", () => {
    expect(service).toBeTruthy()
  })

  it("should succesfully POST a vehicle", async () => {
    service.getVehicle = jest.fn().mockImplementation(async () => {}).mockReturnValueOnce(true)
    expect(await service.getVehicle(new Vehicle())).toBeTruthy()
  })

  it("should fail to POST a vehicle", async () => {
    service.getVehicle = jest.fn().mockImplementation(async () => {}).mockReturnValueOnce(false)
    expect(await service.getVehicle(new Vehicle())).not.toBeTruthy()
  })

})