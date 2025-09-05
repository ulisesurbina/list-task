import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterLink],
  templateUrl: './navbar.html',
})

export class Navbar {
  private _authState = inject(AuthStateService)
  private _router = inject(Router);
  async logOut() {
    await this._authState.logOut()
    this._router.navigateByUrl('/auth/sign-in');
  }
}
