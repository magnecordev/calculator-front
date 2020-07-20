import {FormsModule} from "@angular/forms"
import {HttpClientModule} from "@angular/common/http"
import {NgModule} from "@angular/core"
import {RouterModule} from "@angular/router"

import {AngularMaterialModule} from "../app/system/angular-material.module"
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {BrowserModule} from "@angular/platform-browser"

import {AppComponent} from "./app.component"
import {AccountComponent} from "./system/pages/account/account.component"
import {CalculatorComponent} from "./pages/calculator/calculator.component"

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    CalculatorComponent
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path: "", children: [
        {path: "", component: CalculatorComponent},
        {path: "account", component: AccountComponent},
        {path: "account/reset/:UID", component: AccountComponent},
        {path: "calculator", component: CalculatorComponent},
        {path: "calculator/:GUID", component: CalculatorComponent},
        {path: "**", redirectTo: "calculator"}
      ]
    }]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}