import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth';
import { hasEmialError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { GoogleButton } from '../../ui/google-button/google-button';

interface FormSignIn {
  email: FormControl<string | null | undefined>;
  password: FormControl<string | null | undefined>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButton],
  templateUrl: './sign-in.html',
  styles: ``
})
export class SignIn {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form  = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', Validators.required),
  })

  async submit() {
    if (this.form.invalid) return;
    try {
      const { email, password } = this.form.value;

      if (!email || !password) return;
    
      // console.log({ email, password });
      await this._authService.signIn({ email, password });

      toast.success('Sesión iniciada correctamente');

      this._router.navigateByUrl('/tasks')
      
    } catch (error) {
      toast.error('Error al iniciar sesión, vuelve a intentarlo');
      this.form.reset();
    }
  }

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form)
  }

  isEmailRequired() {
    return hasEmialError(this.form)
  }

  async submitWithGoogle() {
    try {
      await this._authService.signInWithGoogle();      
      toast.success(`Bienvenido de nuevo ${this.form.value.email}`);
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Error al iniciar sesión, vuelve a intentarlo');
      this.form.reset();
    }
  }
}
