import { bootstrapApplication } from '@angular/platform-browser';
import { MenuComponent } from './app/components/menu/menu.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(MenuComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
}).catch((err) => console.error(err));
