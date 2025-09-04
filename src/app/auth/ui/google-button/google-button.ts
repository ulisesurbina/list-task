import { Component, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-button',
  imports: [],
  templateUrl: './google-button.html'
})
export class GoogleButton {
  onClick = output<void>()

  constructor(private router: Router) {}

  get buttonText(): string {
    const url = this.router.url;
    if (url.includes('/auth/sign-up')) {
      return 'Crear cuenta con Google';
    }
    return 'Inicia sesión con Google';
  }
}
