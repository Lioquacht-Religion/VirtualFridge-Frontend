import { Component, OnInit } from '@angular/core';
import { User, VFridgeService } from '../vfridge-service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'an-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user : any;
  encryptSecretKey = 'dffsdfs@fdsf'

  constructor(public vfservice: VFridgeService) { }

  ngOnInit(): void {
    this.vfservice.initFromUserCookies();
 }

  loginemail = '';
  loginusername = '';
  loginpassword = '';


      login(): void {

        this.vfservice.user = {
          name : this.loginusername,
          email : this.loginemail,
          password : this.loginpassword,
          id : -1
        };


        this.vfservice.getUserAuthenticated().subscribe(
          data => {
              localStorage.setItem('login_token', 'true');
              localStorage.setItem('user_name', this.loginusername);
              localStorage.setItem('user_email', this.loginemail);
              localStorage.setItem('user_password', this.loginpassword);

              this.vfservice.userLogined = true;
              let dataToLogin : User = {
                 name: this.encryptData(this.loginusername),
                 email: this.encryptData(this.loginemail),
                 password: this.encryptData(this.loginpassword),
                 id : -1,
              };
              this.vfservice.user = dataToLogin;
              console.log(this.vfservice.user);
          },
          err => {
            console.log(err);
            alert("Login Daten sind inkorrekt!");
          },
          () => {}
        );


        //this.vfservice.getUserFetch();
      }


  encryptData(data : any){
    //return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    return data;
  }


//Old login function
/*
  login(): void {
    var name = this.loginusername;
    var email = this.loginemail;
    var password = this.loginpassword;
    if (name == "" || name == null || email == "" || email == null) {
      alert("Das Feld muss ausgefüllt sein!");

    }
    else{
      this.vfservice.getUserData(this.loginemail).subscribe(
        data => { this.user = data;
          this.vfservice.user = data;
          //localStorage.setItem('user', this.user.email);
        },
        err => console.log(err),
        () => {
          console.log('loading done.'+this.user);
          if(this.loginemail === this.user.email && this.loginusername === this.user.name){
            localStorage.setItem('user', this.user.email);
            localStorage.setItem('login_token', 'true');
            this.vfservice.userLogined = true;
          }
          else{
            this.vfservice.userLogined = false;
            localStorage.setItem('user', '');
            localStorage.setItem('login_token', 'false');
            alert("Login Daten sind nicht korrekt");
          }
      }
    );
    }

  }

*/



}
