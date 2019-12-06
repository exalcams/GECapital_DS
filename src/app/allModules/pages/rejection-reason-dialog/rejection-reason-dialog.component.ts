import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'rejection-reason-dialog',
  templateUrl: './rejection-reason-dialog.component.html',
  styleUrls: ['./rejection-reason-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RejectionReasonDialogComponent implements OnInit {
  rejectionReasonForm: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<RejectionReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar

  ) {
    this.rejectionReasonForm = this._formBuilder.group({
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  YesClicked(): void {
    if (this.rejectionReasonForm.valid) {
      const Reason = this.rejectionReasonForm.get('reason').value;
      this.matDialogRef.close(Reason);
    } else {
      Object.keys(this.rejectionReasonForm.controls).forEach(key => {
        this.rejectionReasonForm.get(key).markAsTouched();
        this.rejectionReasonForm.get(key).markAsDirty();
      });

    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
