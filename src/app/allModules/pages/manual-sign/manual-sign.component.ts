import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'app/services/dashboard.service';
import { DSSInvoice, ManualSignResponse } from 'app/models/dss';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationDetails } from 'app/models/master';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'app-manual-sign',
  templateUrl: './manual-sign.component.html',
  styleUrls: ['./manual-sign.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ManualSignComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  UserName: string;
  UserID: number;
  searchText: string;
  AllUnSignedDocuments: DSSInvoice[] = [];
  SignResponse: ManualSignResponse;
  selectID: number;
  SelectedDocument: DSSInvoice;
  DSSConfigurationData: any;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private _dashboardService: DashboardService,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private _router: Router
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.searchText = '';
    this.SelectedDocument = new DSSInvoice();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.UserName = this.authenticationDetails.userName;
      this.UserID = this.authenticationDetails.userID;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('ManualSign') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    if (this.authenticationDetails.userRole === 'Administrator') {
      this.GetAllUnSignedDocuments();
    } else {
      this.GetAllUnSignedDocumentsByUser();
    }

  }

  GetAllUnSignedDocuments(): void {
    this.IsProgressBarVisibile = true;
    this._dashboardService.GetAllUnSignedDocument().subscribe(
      (data) => {
        this.AllUnSignedDocuments = data as DSSInvoice[];
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  GetAllUnSignedDocumentsByUser(): void {
    this.IsProgressBarVisibile = true;
    this._dashboardService.GetAllUnSignedDocumentsByUser(this.UserName).subscribe(
      (data) => {
        this.AllUnSignedDocuments = data as DSSInvoice[];
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  loadSelectedDocument(SelectedDoc: DSSInvoice): void {
    this.selectID = SelectedDoc.ID;
    this.SelectedDocument = SelectedDoc;
    this.ViewPdfFromID(this.SelectedDocument.ID, this.SelectedDocument.INVOICE_NAME);
  }
  ViewPdfFromID(ID: number, fileName: string): void {
    this.IsProgressBarVisibile = true;
    this._dashboardService.DowloandPdfFromID(ID).subscribe(
      data => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.DSSConfigurationData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  SignClicked(): void {
    this.IsProgressBarVisibile = true;
    this._dashboardService.ManualSignProcessUsingCert(this.SelectedDocument.ID, this.SelectedDocument.INVOICE_NAME, this.UserID).
      subscribe((data) => {
        this.SignResponse = data as ManualSignResponse;
        if (this.SignResponse) {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(this.SignResponse.StatusMessage, SnackBarStatus.success);
          this.SaveSucceed.emit('success');
          document.getElementById( 'iframeforSign' ).setAttribute( 'src', '' );
          this.GetAllUnSignedDocumentsByUser();
        }
        else {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(this.SignResponse.StatusMessage, SnackBarStatus.danger);
          this.ShowProgressBarEvent.emit('hide');
          document.getElementById( 'iframeforSign' ).setAttribute( 'src', '' );
          this.GetAllUnSignedDocumentsByUser();
        }
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
          this.ShowProgressBarEvent.emit('hide');
          document.getElementById( 'iframeforSign' ).setAttribute( 'src', '' );
          this.GetAllUnSignedDocumentsByUser();
        });

  }

}
