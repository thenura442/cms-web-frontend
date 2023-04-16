import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../_interfaces/login.user';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private authService: AuthService){}

  ngOnInit(){
    // this.authService.logOut().subscribe((result) => {
    //   console.log(result);
    //   if(Object.hasOwn(result,'Error')){
    //     console.log(result);
    //   }
    //   else {
    //     console.log(result);
    //   }
    // });
  }


  originalLoginForm: LoginUser = {
    email: "",
    password: "",
    type: "staff"
  };

  loginForm: LoginUser = {...this.originalLoginForm}

  postError = false;
  postErrorMessage = "";


  onHttpError(errorResponse:  any): void {
    console.log('error : ',errorResponse);
    this.postError = true;
    this.postErrorMessage = errorResponse;
    console.log(this.postErrorMessage)
  }


  onSubmit(form : NgForm): void {
    console.log('in on submit : '+ form.valid);
    if(form.valid) {
      this.postError = false;
      //console.log(this.loginForm)
      this.authService.login(this.loginForm).subscribe((result) => {
        if(Object.hasOwn(result,'Error')){
          console.log(result);
          const status = Object.getOwnPropertyDescriptor(result, 'Status');
          const error = Object.getOwnPropertyDescriptor(result, 'Error');

          if(status?.value === "400") {
            this.onHttpError(error?.value)
          }
          else {
            this.onHttpError("Something went Wrong with the Server try again later,.. If the Issue Persists please Contact Support!");
            console.log(result)
          }
        }
        else {
          this.postError = false;
        }
      });
    }
    else{
      this.onHttpError("Please Enter all Required Fields with Valid Values");
    }
  }
}
