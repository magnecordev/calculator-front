import {environment} from "../../../environments/environment"

import {Injectable} from "@angular/core"
import {HttpService} from "./http.service"
import {User} from "../../models/user.model"

interface Users {
  all: User[]
  current: User
}

export class Credentials {
  username: string = null
  password: string = null
}

@Injectable({
  providedIn: "root"
})

export class AuthenticationService {

  authToken: string = null
  users: Users = {
    all: [],
    current: null
  }

  constructor(
    private _httpService: HttpService
  ) {}

  provisionUser(user: User) {
    try {
      localStorage.setItem("authToken", (this.authToken = user.currentPassword))
    } catch {}
    user.currentPassword = null
    return (this.users.current = user)
  }

  readUserToken = (): Promise<User> => this._httpService.get(`${environment.middlewareURI}user/auth/token`).then(user => this.provisionUser(user))

  recoverUser = (username: string): Promise<void> => this._httpService.post(`${environment.middlewareURI}user/recovery/sendEmail`, {username: username})

  saveUser = (user: User): Promise<User> => this._httpService.post(`${environment.middlewareURI}user/save`, user).then(user => this.provisionUser(user))

  async signOut(isDelete: boolean = false, isExpired: boolean = false) {
    localStorage.removeItem("authToken")
    this.authToken = (this.users.current = null)
    if (!isExpired) {
      await new Promise(resolve => setTimeout(resolve))
      if (!isDelete)
        alert("You have been signed out successfully.")
    }
  }

  userLogin = (credentials: Credentials): Promise<User> => this._httpService.post(`${environment.middlewareURI}user/auth/login`, credentials)

}