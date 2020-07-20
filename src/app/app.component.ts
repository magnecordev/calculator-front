import {AuthenticationService} from "./system/services/authentication.service"
import {Component} from "@angular/core"
import {HttpService} from "./system/services/http.service"
import {ShellService} from "./system/services/shell.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {
  title = "Magnecor Pricing Calculator"

  constructor(
    public _authenticationService: AuthenticationService,
    private _httpService: HttpService,
    public _shellService: ShellService
  ) {}

  async ngOnInit() {
    if ((this._httpService._authenticationService = this._authenticationService).authToken = localStorage.getItem("authToken"))
      await this._authenticationService.readUserToken().catch(error => {
        alert(error.data)
        this._authenticationService.signOut(false, true)
      })
    await this._shellService.getDealer()
    await this._shellService.getStates()
  }

  async getOrderFromGUID() {
    if (this._shellService.orderGUID)
      this._shellService._router.navigateByUrl(`/calculator/${this._shellService.orderGUID}`)
  }

}