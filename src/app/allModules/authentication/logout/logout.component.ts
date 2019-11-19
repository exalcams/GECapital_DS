import { Component, OnInit, Compiler, ViewEncapsulation } from '@angular/core';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthService } from 'app/services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LogoutComponent implements OnInit {
  notificationSnackBarComponent: NotificationSnackBarComponent;
  baseAddress: string;
  IsProgressBarVisibile: boolean;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _authService: AuthService,
    public snackBar: MatSnackBar,
  ) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.baseAddress = _authService.baseAddress;
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    this.notificationSnackBarComponent.openSnackBar('Signed out successfully', SnackBarStatus.success);
    setTimeout(() => {
      this.RetirectToLogOff();
    }, 3000);
  }
  RetirectToLogOff(): void {
    // window.location.href = `${this.baseAddress}api/SSO/Start`;
    window.location.href = 'https://ssologin.ssogen2.corporate.ge.com/logoff/logoff.jsp';
  }

}
