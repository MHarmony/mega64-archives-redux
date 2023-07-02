import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Router,
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { TraceService, createErrorHandler } from '@sentry/angular-ivy';
import { appRoutes } from './app.routes';

/**
 * The application config.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: ErrorHandler,
      useValue: createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        return;
      },
      deps: [TraceService],
      multi: true,
    },
  ],
};
