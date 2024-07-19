import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Role } from '../../shared/role';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatGridTile } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { UserExistComponent } from '../../components/user-exist/user-exist.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    NavbarComponent,
    MatGridTile
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {//implements OnInit
  username: string = '';
  password: string = '';
  @Input()
  todos: String = '';
  constructor(private route: ActivatedRoute, private server: UsersService, private router: Router,
    public dialog: MatDialog
  ) {
  }
  openAlert() {
    const dialogRef = this.dialog.open(UserExistComponent);
  }
  receiveData(data: String) {
    console.log('Received Data:', data);
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   console.log('params');

    //   console.log(params);

    //   this.password = params['password'];
    //   this.username = params['userName'];
    //   console.log('fv',this.username,this.password);
    // });
    console.log(this.route.snapshot.params);
    this.username = this.route.snapshot.params['username']
    console.log(this.username);

    this.password = this.route.snapshot.params['password']

  }

  async onSubmit(form: NgForm) {
    const { firstName, lastName, username, password, email, address } = form.value.name;
    let users: User[] = []
    await this.server.getUsers().subscribe(
      data => {
        users = data
        console.log('users', users);
        for (let i = 0; i < users.length; i++) {
          if (users[i].username == username) {
            // alert('המשתמש כבר קיים')
           // const dialogRef = this.dialog.open(UserExistComponent);
            return
          }
        }
      }
    )


    const u: User = { _id: '', firstName, lastName, username, password, email, address, role: Role.user }
    this.server.sigup(u).subscribe(
      response => {
        console.log('register successful', response);

        const typedResponse: { user: User; token: string } = response as any;
        const user = typedResponse.user;
        user.password = password
        const token = typedResponse.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['allRecipes'])
      },
      error => {
        console.log(error.message);
        console.error('register error', error);
        if(error.status==409){
          const dialogRef = this.dialog.open(UserExistComponent);
          return
        }

      }
    );

  }

}
