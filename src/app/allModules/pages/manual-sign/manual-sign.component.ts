import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'app/services/dashboard.service';
import { DSSInvoice, ManualSignResponse, RejectionView } from 'app/models/dss';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationDetails } from 'app/models/master';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DialogComponent } from '../dialog/dialog.component';
import { RejectionReasonDialogComponent } from '../rejection-reason-dialog/rejection-reason-dialog.component';

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
    private _router: Router,
    private dialog: MatDialog,
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.searchText = '';
    this.SelectedDocument = new DSSInvoice();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ResetSelection(): void {
    this.selectID = 0;
    this.SelectedDocument = new DSSInvoice();
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
    // if (this.authenticationDetails.userRole === 'Administrator') {
    //   this.GetAllUnSignedDocuments();
    // } else {
    //   this.GetAllUnSignedDocumentsByUser();
    // }
    this.GetAllUnSignedDocumentsByUser();
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
    if (this.SelectedDocument && this.SelectedDocument.ID && this.SelectedDocument.INVOICE_NAME) {
      this.IsProgressBarVisibile = true;
      this._dashboardService.ManualSignProcessUsingCert(this.SelectedDocument.ID, this.SelectedDocument.INVOICE_NAME, this.UserID).
        subscribe((data) => {
          this.SignResponse = data as ManualSignResponse;
          if (this.SignResponse) {
            this.IsProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar(this.SignResponse.StatusMessage, SnackBarStatus.success);
            document.getElementById('iframeforSign').setAttribute('src', '');
            this.ResetSelection();
            this.GetAllUnSignedDocumentsByUser();
          }
          else {
            this.IsProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar(this.SignResponse.StatusMessage, SnackBarStatus.danger);
            document.getElementById('iframeforSign').setAttribute('src', '');
            this.ResetSelection();
            this.GetAllUnSignedDocumentsByUser();
          }
        },
          (err) => {
            console.error(err);
            this.IsProgressBarVisibile = false;
            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            document.getElementById('iframeforSign').setAttribute('src', '');
            this.GetAllUnSignedDocumentsByUser();
          });
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a document', SnackBarStatus.danger);
    }

  }

  RejectClicked(): void {
    if (this.SelectedDocument && this.SelectedDocument.ID && this.SelectedDocument.INVOICE_NAME) {
      this.OpenRejectionResonDialog();
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a document', SnackBarStatus.danger);
    }
  }

  OpenRejectionResonDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'rejection-reason-dialog'
    };
    const dialogRef = this.dialog.open(RejectionReasonDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reason: string = result as string;
        this.RejectSelectedDocument(reason);
      }
    });
  }

  RejectSelectedDocument(reason: string): void {
    const rejectionView: RejectionView = new RejectionView();
    rejectionView.ID = this.SelectedDocument.ID;
    rejectionView.INVOICE_NAME = this.SelectedDocument.INVOICE_NAME;
    rejectionView.REJECTED_BY = this.UserName;
    rejectionView.REASON_FOR_REJECTION = reason;
    this.IsProgressBarVisibile = true;
    this._dashboardService.RejectSelectedDocument(rejectionView).
      subscribe((data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Rejected successfully', SnackBarStatus.success);
        document.getElementById('iframeforSign').setAttribute('src', '');
        this.ResetSelection();
        this.GetAllUnSignedDocumentsByUser();
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? err.error ? err.error : 'Something went wrong' : err, SnackBarStatus.danger);
          document.getElementById('iframeforSign').setAttribute('src', '');
          this.GetAllUnSignedDocumentsByUser();
        });
  }

}
