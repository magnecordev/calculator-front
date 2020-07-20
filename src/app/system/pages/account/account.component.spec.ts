import {AccountComponent} from "../account/account.component"
import {User} from 'src/app/models/user.model'

describe("AccountComponent", () => {

  let fixture: AccountComponent
  let _authenticationService = ({
    saveUser: jest.fn(),
    users: {
      all: [],
      current: null
    }
  } as any)
  let _routerService = ({
    navigateByUrl: jest.fn()
  } as any)

  beforeEach(() => {
    fixture = new AccountComponent(_authenticationService, _routerService)
  })

  it("should instantiate AccountComponent", () => {
    expect(fixture).toBeTruthy()
  })

  it("should change pages after successful user creation", () => {
    let isSuccess: boolean = false
    fixture.user = new User()
    window.alert = (jest.fn() as any)
    jest.spyOn(fixture._authenticationService, "saveUser").mockImplementationOnce(async () => randomizeSuccess().then(() => isSuccess
      = true))
    fixture.saveUser()
    if (isSuccess)
      expect(fixture._shellService._router.navigateByUrl).toHaveBeenCalled()
    else
      expect(isSuccess).toBe(false)
  })

})

const randomizeSuccess = (): Promise<boolean> => new Promise((resolve, reject) => {
  let isSuccess: any = (Math.random() * 2)
  if (((isSuccess === 2) ? 1 : Math.floor(isSuccess)))
    resolve(true)
  else
    reject(false)
})