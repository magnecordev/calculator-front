import {OrderService} from "../services/order.service"
import {HttpService} from '../system/services/http.service'

describe("OrderService", () => {

  let service: OrderService

  beforeEach(() => {
    service = new OrderService(new HttpService())
  })

  it("should instantiate OrderService", () => {
    expect(service).toBeTruthy()
  })

})