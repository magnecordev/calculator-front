import {environment} from "../../environments/environment"
import {HttpClient} from "@angular/common/http"
import {Injectable} from "@angular/core"
import {Vehicle} from "../models/vehicle.model"

@Injectable({
  providedIn: "root"
})

export class VehicleService {

  constructor(
    private _http: HttpClient
  ) {}

  getVehicle(vehicle: Vehicle): Promise<any> {
    return this._http.post(`${environment.middlewareURI}vehicle`, vehicle).toPromise().catch(() => {})
  }

}