import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHotToastConfig } from '@ngneat/hot-toast';
bootstrapApplication(AppComponent, {
  providers: [
    provideHotToastConfig({
      position: 'top-center',
      duration: 1000,
    }),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
