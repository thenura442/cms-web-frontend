import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';


// const httpOptions = {
//   headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'https://cms-dle.netlify.app/' })
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  USER : any ;
  private dataSub: BehaviorSubject<any>;
  currentData: Observable<any>;

  constructor(private http: HttpClient) {
    this.dataSub = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentData")!)
    );
    this.currentData = this.dataSub.asObservable();
   }


   public getUser(): any {
    const user = localStorage.getItem(this.USER);
    if (user != null) {
      return JSON.parse(user);
    }
    return null;
  }

  public get currentUserValue(): any {
    return this.dataSub.value;
  }

  public loggedIn() : boolean {
    return !!localStorage.getItem('currentData');
  }


  login(loginForm: any) {
    return this.http.post<any>('https://cms-backend-d9n7.onrender.com/api/auth/login/web',loginForm).pipe(  //httpOptions not added - return this.http.post<any>('http://localhost:5500/api/auth/login/web',loginForm,httpOptions).pipe(
      map((user) => {

        if(!Object.hasOwn(user,'Error')){
          const email = Object.getOwnPropertyDescriptor(user, 'email');
          const type = Object.getOwnPropertyDescriptor(user, 'type');
          const access = Object.getOwnPropertyDescriptor(user, 'access');
          const vendor = Object.getOwnPropertyDescriptor(user, 'vendor');

          let body = { email:email?.value , type:type?.value, access:access?.value , vendor: vendor?.value }

          localStorage.setItem("currentData", JSON.stringify(body));
          this.dataSub.next(body);
          localStorage.setItem(this.USER, JSON.stringify(body));
          return body;
        }

        return user;
      })
    );
  }

  public logOut():Observable<any> {
    localStorage.removeItem('currentData');
    this.dataSub.next(null);
    return this.http.get<any>('https://cms-backend-d9n7.onrender.com/api/auth/login/web'); //httpOptions removoed return this.http.get<any>(URL+PATH+'logout',httpOptions);

  }
}
