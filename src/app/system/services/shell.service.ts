import {Dealer} from "src/app/models/dealer.model"
import {environment} from "src/environments/environment"
import {HttpService} from "./http.service"
import {Injectable} from "@angular/core"
import {Router} from "@angular/router"
import {State} from "src/app/models/state.model"
import {Title} from "@angular/platform-browser"

@Injectable({
  providedIn: "root"
})

export class ShellService {

  dealer: Dealer = null
  orderGUID: string = null
  states: State[] = []

  constructor(
    public _httpService: HttpService,
    public _router: Router,
    public _title: Title
  ) {}

  getDealer(): Promise<Dealer> {
    return this._httpService.get(`${environment.middlewareURI}dealer`).then(dealer => (this.dealer = dealer))
  }

  getStates(): Promise<State[]> {
    return this._httpService.get(`${environment.middlewareURI}states`).then(states => (this.states = states))
  }

}