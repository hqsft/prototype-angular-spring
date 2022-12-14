import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './../../Services/data.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  title = 'HQ SOFTWARE CONSULTING';
  isIframe = false;
  loginDisplay = false;
  testvalue: boolean = true
  private readonly _destroying$ = new Subject<void>();
  public sessionStorage = sessionStorage;

  constructor(private http: HttpClient, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService, private authService: MsalService, private ds: DataService, private router: Router) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log('test');
        this.setLoginDisplay();
      })
  }
  /*
    login() {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  
    logout() { // Add log out function here
      this.authService.logoutRedirect({
        postLogoutRedirectUri: 'http://localhost:4200'
      });
    }
  */


  public email: string;
  sub: string;
  name: any;
  UserInfo: any
  login() {
    this.testvalue = false
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log(result.idTokenClaims["preferred_username"]);
          console.log(result.idTokenClaims["sub"]);
          // console.log("all user", result.idTokenClaims);
          //alert("User:"+result.idTokenClaims["preferred_username"]+ " , SUB: "+result.idTokenClaims["sub"]);
          this.email = result.idTokenClaims["preferred_username"];
          this.sub = result.idTokenClaims["sub"];
          this.name = result.idTokenClaims["name"];
          this.userLogin(this.email, this.sub);
          this.setLoginDisplay();

          this.UserInfo = {
            Email: this.email,
            Sub: this.sub,
            Name: this.name
          }

          sessionStorage.setItem('User', this.name)
          sessionStorage.setItem('userInfo', JSON.stringify(result.idTokenClaims))
        },
        error: (error) => console.log(error)
      });
  }


  logout() { // Add log out function here
    this.ds.setToken("");
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"

    });
    sessionStorage.removeItem('User')
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('token')
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    console.log(localStorage.getItem('token'));
    if (this.loginDisplay) {
      if (localStorage.getItem('token')) {
        console.log("test hai");
        this.router.navigateByUrl('/post/index');
      } else {
        console.log("test nhi hai");
        console.log(this.authService.instance.getAllAccounts()[0].idTokenClaims.preferred_username);
        console.log(this.authService.instance.getAllAccounts()[0].idTokenClaims.sub);
         this.email = this.authService.instance.getAllAccounts()[0].idTokenClaims.preferred_username;
        this.sub = this.authService.instance.getAllAccounts()[0].idTokenClaims.sub;
        this.userLogin(this.email, this.sub);
      }

    }
  }

  userId: any;
  token: any;
  userLogin(email, sub) {
    //console.log(this.loginDisplay);   
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    const body = {
      email: this.email,
      sub: this.sub

    };
    // this.http.post<any>('http://localhost:9006/csaic/api/user/login', body, { headers }).subscribe(data => {
    this.http.post<any>('https://csacangular.hsoftcloud.com/angularAPI/api/auth/signin', body, { headers }).subscribe(data => {
      this.token = data.accessToken;
      
      this.ds.setToken(data.accessToken);
      if (localStorage.getItem('token')) {
        console.log(data.accessToken);
        this.router.navigateByUrl('/post/index');
      }
     
      
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
