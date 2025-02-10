import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { AuthComponent } from './components/auth/auth.component';
import { LocationsComponent } from './components/pages/locations/locations.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect la pagina "Home"
    { path: 'home', component: HomeComponent },         // Ruta pentru pagina "Home"
    { path: 'services', component: ServicesComponent }, // Ruta pentru pagina "Services"
    { path: 'contact', component: ContactComponent },   // Ruta pentru pagina "Contact"
    { path: 'about', component: AboutComponent },      // Ruta pentru pagina "About"
    { path: 'locations', component: LocationsComponent},
    { path: 'auth', component: AuthComponent}
];
