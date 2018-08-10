import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  errors: any[] = []
  notifyMessage: string = ''

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private aroute: ActivatedRoute) { }

  ngOnInit() {
    this.createForm()

    this.aroute.params.subscribe((params) => {
      if (params['registred'] === 'success') {
        this.notifyMessage = 'You have been successfully registred!'
      }
    })
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
                  Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    })
  }

  isInvalidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
           (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched)
  }

  isRequired(fieldName): boolean {
    return this.loginForm.controls[fieldName].errors.required
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals'])
      },
      (err) => {
        this.errors = err.error.errors
      })
  }
}
