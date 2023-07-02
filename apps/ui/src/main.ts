import { bootstrapApplication } from '@angular/platform-browser';
import {
  BrowserTracing,
  init,
  instrumentAngularRouting,
} from '@sentry/angular-ivy';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

init({
  dsn: process.env['SENTRY_DSN'],
  integrations: [
    new BrowserTracing({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      shouldCreateSpanForRequest: (url: string) => true,
      tracePropagationTargets: ['localhost'],
      routingInstrumentation: instrumentAngularRouting,
    }),
  ],
  tracesSampleRate: 1,
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
