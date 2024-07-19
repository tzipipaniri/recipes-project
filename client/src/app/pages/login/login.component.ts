// import { EventEmitter, Input, OnInit, Output, model, signal } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, NgForm, NgModel, Validators } from '@angular/forms';
// // import { BrowserModule } from '@angular/platform-browser';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input'; // Import for matInput
// import { MatIconModule } from '@angular/material/icon'; // Import for matIcon
// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
// // import { MatHintModule } from '@angular/material/hint'; // Import for matHint
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UsersService } from '../../shared/services/users.service';
// import { HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
//  import { User } from '../../shared/models/user';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// // import {MatButtonModule} from '@angular/material/button';
// import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// import {
//   MAT_DIALOG_DATA,
//   MatDialog,
//   MatDialogActions,
//   MatDialogClose,
//   MatDialogContent,
//   MatDialogModule,
//   MatDialogRef,
//   MatDialogTitle,
//   // MatButtonModule
// } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
// // import { provideMatDialog } from '@angular/material/dialog/standalone'

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     FormsModule,

//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     //  MatHintModule
//     CommonModule,
//     // BrowserAnimationsModule,
//     // BrowserModule,
//     HttpClientModule,
//     NavbarComponent,
//     MatButtonModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
//   providers: [HttpClientModule,
//     // provideMatDialog()
//   ], // הוסף HttpClient ל-providers
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })

// export class LoginComponent {
//   action: string = '';

//   constructor(private server: UsersService, private router: Router, private dialog: MatDialog) { }
//   // 1.
//   // הגדרה שתכונה זו תקבל ערך מקומפוננטת אב
//   @Input('oneItem') // ניתן לשלוח את השם של התכונה
//   // @Input()// כברירת מחדל אוטומטית כשם המשתנה
//   username: String = ''

//   @Output()
//   register = new EventEmitter<String>(); // נשלח את הקוד של המשימה למחיקה
//   // deleteEvent - שם האירוע
//   // $event - יקבל מספר
//   setAction(action: string) {
//     this.action = action;
//   }
//   // onSubmit(form: NgForm) {
//   //   console.log('submit');
//   //   console.log('form.value',form.value);
//   //   this.server.sigin(form.value.name.userName,form.value.name.password).subscribe(response => {
//   //     console.log('Login successful', response);
//   //   }, error => {
//   //     console.error('Login error', error);
//   //   });
//   // }
//   onSubmit(form: NgForm) {//, event: Event
//     // event.preventDefault();
//     // const formElement = event.target as HTMLFormElement;

//     // const action = (formElement.querySelector('button[type=submit][clicked]') as HTMLButtonElement).value;
//     const { userName, password } = form.value.name;

//     if (this.action === 'signin') {
//       this.server.sigin(userName, password).subscribe(
//         response => {
//           console.log('Login successful', response);
//           const typedResponse: { user: User; token: string } = response as any;
//           const user = typedResponse.user;
//           const token = typedResponse.token;
//           localStorage.setItem('token', token)
//           localStorage.setItem('user', JSON.stringify(user))
//           console.log('user', user);
//           console.log('token', token);
//           this.router.navigate(['allRecipes'])
//         },
//         error => {
//           // alert('שם משתמש או סיסמא שגויים')
//           console.log('Login error', error);
//         }
//       );
//     } else if (this.action === 'signup') {
//       console.log('signup');
//       this.register.emit(userName)
//       this.router.navigate(['register', userName, password])//
//       //    this.router.navigate(['/receiver'], { queryParams: { name, age } });

//       // this.router.navigate(['/register'], { queryParams: {userName, password} });

//       // this.server.sigup({ username, password }).subscribe(
//       //   response => {
//       //     console.log('Signup successful', response);
//       //   },
//       //   error => {
//       //     console.error('Signup error', error);
//       //   }
//       // );
//     }
//   }
// }

import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  action: string = '';
  password: String='';

  constructor(
    private server: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  @Input('oneItem')
  username: String = '';

  @Output()
  register = new EventEmitter<String>();

  setAction(action: string) {
    this.action = action;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { message: 'אחד הפרטים שגויים' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      // הגדרת שגיאה לכל השדות בטופס
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });

      this.openDialog()
      return;
    }

    const { userName, password } = form.value;
    if (this.action === 'signin') {
      console.log('this.password',this.password);
      
      this.server.sigin(userName, this.password).subscribe(
        response => {
          const typedResponse: { user: User; token: string } = response as any;
          const user = typedResponse.user;
          user.password = this.password
          const token = typedResponse.token;
          localStorage.setItem('token', token);
          console.log(' JSON.stringify(user) ', JSON.stringify(user));

          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['allRecipes']);
        },
        error => {
          this.openDialog()
          console.error('in login component Login error', error);
        }
      );
    } else if (this.action === 'signup') {
      console.log('signup');
      this.register.emit(userName);
      this.router.navigate(['register', userName, password]);
    }
  }
}
