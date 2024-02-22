import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';  
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { PortfolioDashboardComponent } from './portfolio-dashboard/portfolio-dashboard.component';
import { SettingsComponent } from './settings/settings.component';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        LoginSignupComponent,
        PortfolioDashboardComponent,
        SettingsComponent,
        // CommonModule, 
        // RouterOutlet
    ],
    imports: [
        FormsModule, NgFor, NgIf,
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
