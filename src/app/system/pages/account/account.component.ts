import {ActivatedRoute, Router, NavigationEnd} from "@angular/router"
import {AuthenticationService, Credentials} from "../../services/authentication.service"
import {Component} from "@angular/core"
import {Order} from "src/app/models/order.model"
import {OrderService} from "src/app/services/order.service"
import {ShellService} from "../../services/shell.service"
import {User} from "src/app/models/user.model"

interface InstantiatedEntities {
  [key: string]: any
}

interface IsVisible {
  account: boolean
  recovery: boolean
  recoveryButton: boolean
}

interface RecoveredAccount {
  confirmedPassword: string
  password: string
}

@Component({
  selector: "account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})

export class AccountComponent {

  credentials = new Credentials()
  cipherText: string = null
  dictionaries: any = {
    orderStatuses: null
  }
  instantiatedEntities: InstantiatedEntities = null
  isPasswordChange: boolean = true
  isUserProvision: boolean = false
  isVisible: IsVisible = {
    account: false,
    recovery: false,
    recoveryButton: false
  }
  orders: Order[] = []
  recoveredAccount: RecoveredAccount = {
    confirmedPassword: null,
    password: null
  }
  subscriptions: any[] = []
  user: User = null

  constructor(
    private _activatedRoute: ActivatedRoute,
    public _authenticationService: AuthenticationService,
    private _orderService: OrderService,
    public _shellService: ShellService,
    private _router: Router
  ) {
    this.initialize().then(() =>
      this.subscriptions.push(this._router.events.subscribe(async event => {
        if (event instanceof NavigationEnd && (event.url.startsWith("/account")))
          await this.initialize()
      }))
    )
  }

  async initialize(): Promise<void> {
    if (this.instantiatedEntities)
      Object.entries(this.instantiatedEntities).forEach(entity => this[entity[0]] = JSON.parse(JSON.stringify(entity[1])))
    else {
      let tempObj = {}
      Object.keys(this).forEach(key => {
        if (!(key.startsWith("_") || (key === "instantiatedEntities") || (key === "subscriptions") || (typeof this[key] === "function")))
          tempObj[key] = JSON.parse(JSON.stringify(this[key]))
      })
      this.instantiatedEntities = tempObj
    }
    if ((this.user = JSON.parse(JSON.stringify(this._authenticationService.users.current))))
      this.isPasswordChange = false
    else
      this.resetProvisionaryUser()
    if (this.checkForUID()) {
      if (this._authenticationService.users.current)
        await this._orderService.getOrders().then(orders => (this.orders = orders)).catch(() => {})
      await this._orderService.getOrderStatuses().then(orderStatuses => {
        this.dictionaries.orderStatuses = {}
        orderStatuses.forEach(status => this.dictionaries.orderStatuses[status.ID] = status)
      }).catch(() => {})
    }
  }

  resetProvisionaryUser = (): boolean => (this.isPasswordChange = !!(this.user = new User()))

  recoverAccount = (): Promise<boolean | void> => this._authenticationService.recoverUser(this.credentials.username).then(() =>
    this.isVisible.recoveryButton =
    !!(alert("If an account exists with this username, you will receive an email with instructions on how to reset your password.") as any)).catch(error =>
      alert(error.data))

  saveChanges() {
    let user = this.user
    if (((!this.isPasswordChange || user.currentPassword) && user.firstName && user.lastName && user.emailAddress && user.phoneNumber
      && user.address.street && user.address.city && user.address.stateID && user.address.zipCode &&
      (!this._authenticationService.users.current || user.previousPassword) && user.username))
      ((this.isUserProvision || this.user.ID) ? this.saveUser() : this.userLogin())
  }

  async saveUser(isDelete: boolean = false) {
    let user: User = JSON.parse(JSON.stringify(this.user))
    if (!(user.isActive = !isDelete))
      if (!window.confirm("Please confirm the deletion of your account (note that some information may still be retained for historical purposes)."))
        return
    await this._authenticationService.saveUser(user).then(() => {
      if (this.user.ID)
        alert((user.isActive ? "Your updated account information was saved successfully." : "Your account was deleted successfully."))
      if (!user.isActive)
        this._authenticationService.signOut(true)
      else
        this._shellService._router.navigateByUrl("/calculator")
    }).catch(error => alert(error.data))
  }

  async userLogin() {
    if (this.credentials.username && this.credentials.password)
      await this._authenticationService.userLogin(this.credentials).then(user => {
        this._authenticationService.provisionUser(user)
        this._shellService._router.navigateByUrl("/calculator")
      }).catch(error => {
        this.credentials.password = null
        if (error.status === 204) {
          this.cipherText = this.credentials.password
          this.isVisible.account = !(this.isVisible.recovery = true)
        } else
          this.isVisible.recoveryButton = !(alert(error.data) as any)
      })
  }

  checkForUID = (): boolean => this.isVisible.account = !(this.isVisible.recovery = !!this._activatedRoute.snapshot.params.UID)

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

}