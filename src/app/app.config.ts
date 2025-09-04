import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ng-task-9edfc',
        appId: '1:48653189464:web:e4b39728c476fd99b4252d',
        storageBucket: 'ng-task-9edfc.firebasestorage.app',
        apiKey: 'AIzaSyDmA1Zi5KbxV5fQJ3VwYqewK2GKDCpypHw',
        authDomain: 'ng-task-9edfc.firebaseapp.com',
        messagingSenderId: '48653189464',
        measurementId: 'G-PEMV0KKNQR',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
