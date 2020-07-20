import {Injectable} from "@angular/core"

interface instantiatedAuthenticationService {
  authToken: string
}

@Injectable({
  providedIn: "root"
})

export class HttpService {

  _authenticationService: instantiatedAuthenticationService = null

  constructor() {}

  get(URL: string): Promise<any> {
    return fetch(URL, {
      headers: {
        "authToken": this._authenticationService.authToken
      }
    }).then(async data => await this.transformData(data))
    // }).then(async data => this.transformMappedEntityIDs(await this.transformData(data)))
  }

  post(URL: string, postData: any): Promise<any> {
    return fetch(URL, {
      body: JSON.stringify(postData),
      headers: {
        "authToken": this._authenticationService.authToken,
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(async data => await this.transformData(data))
    // }).then(async data => this.transformMappedEntityIDs(await this.transformData(data)))
  }

  async transformData(data: any) {
    let stream: string = await data.text()
    try {
      stream = JSON.parse(stream)
    } catch {}
    if (data.status !== 200)
      throw {
        data: stream,
        status: data.status
      }
    return stream
  }

  transformMappedEntityIDs(xhrData: any, isPost: boolean = false) {
    //implement recursively...?
    let dataArr = []
    dataArr = (Array.isArray(xhrData) ? xhrData : [xhrData])
    dataArr.forEach(data => {
      if (typeof data === "object")
        Object.keys(data).filter(key => key.endsWith("IDs")).forEach(key => {
          if (data[key]) {
            data[key] = data[key][(isPost ? "join" : "split")](",")
            if (!isPost)
              data[key] = data[key].map(ID => Number(ID))
          } else
            data[key] = []
        })
    })
    return xhrData
  }

}