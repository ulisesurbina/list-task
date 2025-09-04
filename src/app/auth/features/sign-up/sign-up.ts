import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasEmialError, isRequired } from '../../utils/validators';
import { AuthService } from '../../data-access/auth';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { GoogleButton } from '../../ui/google-button/google-button';


interface FormSignUp {
  email: FormControl<string | null | undefined>;
  password: FormControl<string | null | undefined>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButton],
  templateUrl: './sign-up.html',
  styles: ``
})
export class SignUp {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form  = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', Validators.required),
  })

  async submit() {
    if (this.form.invalid) return;
    try {
      const { email, password } = this.form.value;

      if (!email || !password) return;
    
      // console.log({ email, password });
      await this._authService.signUp({ email, password });

      toast.success('Cuenta creada correctamente');

      this._router.navigateByUrl('/tasks')
      
    } catch (error) {
      toast.error('Error al crear la cuenta, vuelve a intentarlo');
      this.form.reset();
    }
  }

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form)
  }

  isEmailRequired() {
    return hasEmialError(this.form)
  }

  async createdWithGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Cuenta creada correctamente con Google');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Error al crear la cuenta con Google, vuelve a intentarlo');
      this.form.reset();
    }
  }
}
