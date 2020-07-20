import {ShellService} from "../services/shell.service"
import {HttpService} from "./http.service"
import {State} from 'src/app/models/state.model'

describe("ShellService", () => {

  let service: ShellService
  let httpService
  let router
  let titleService

  beforeEach(() => {
    service = new ShellService(new HttpService(), router, titleService)
  })

  it("should instantiate ShellService", () => {
    expect(service).toBeTruthy()
  })

  it("should populate states internally", async () => {
    let isSuccess: boolean = false
    service._httpService.get = jest.fn((URL: string) => randomizeSuccess().then(() => {
      isSuccess = true
      return [new State()]
    }))
    await service.getStates().catch(() => {})
    expect(service.states.length).toEqual(+isSuccess)
  })

})

const randomizeSuccess = (): Promise<boolean> => new Promise((resolve, reject) => {
  let isSuccess: any = (Math.random() * 2)
  if (((isSuccess === 2) ? 1 : Math.floor(isSuccess)))
    resolve(true)
  else
    reject(false)
})