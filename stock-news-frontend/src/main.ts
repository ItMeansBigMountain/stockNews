// STANDALONE COMPONENT REFERENCES
// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));



// APP MODULE CONTAINS ALL IMPORTS AND BOOTSTRAPS THE APP COMPONENT WHICH ROUTES TO ALL OTHER COMPONENTS
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));


