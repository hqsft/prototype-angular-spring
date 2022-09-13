import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, EventType, RedirectRequest, EventMessage } from '@azure/msal-browser';
import { DataService } from './../../Services/data.service'
import { ParseTreeResult } from '@angular/compiler';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

const LOGIN_ENDPOINT = 'http://localhost:9006/csaic/api/user/login';
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  sub?: string
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loginDisplay = false;
  profile!: ProfileType;
  getResponse: any;
  orgList: any;
  formData: any;
  public email: string;
  sub: string;
  name: any;
  UserInfo: any
  testvalue: boolean = true
  title = 'HQ SOFTWARE CONSULTING';
  isIframe = false;


  public ShowHide: boolean;
  private readonly _destroying$ = new Subject<void>();
  constructor(private http: HttpClient, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private auth: DataService, private msalBroadcastService: MsalBroadcastService,
    private broadcastService: MsalBroadcastService, private route: ActivatedRoute, private router: Router, private authService: MsalService, private ds: DataService) { }



  ngOnInit(): void {
    this.ShowHide = true;
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log("show result", result);

      });
    // console.log("show result",sessionStorage.getItem('User'));

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })



  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    // console.log("logindisplay",this.loginDisplay)
    if (this.loginDisplay) {
      if (this.testvalue) {
        console.log("setvlue true")
        this.router.navigateByUrl('/post');
      } else {
        console.log("setvlue false")
      }

    }
   
  }


  login() {
    this.testvalue = false
    this.ShowHide = false;
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          this.ShowHide = true;
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
  }
  userId: any;
  token: any;
  userLogin(email, sub) {
    this.ShowHide = false;
    //console.log(this.loginDisplay);   
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    const body = {
      email: this.email,
      sub: this.sub,
      fname: this.name,
      lname: this.name,
      mname: ""
    };
    // this.http.post<any>('http://localhost:9006/csaic/api/user/login', body, { headers }).subscribe(data => {
    this.http.post<any>('https://csacangular.hsoftcloud.com/angularAPI/api/auth/signin', body, { headers }).subscribe(data => {
      this.token = data.accessToken;
      this.ShowHide = true;
      this.ds.setToken(data.accessToken);
      this.router.navigateByUrl('/post');

    });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}