import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DSSConfiguration, CertificateClass, UserByPlant, AuthorityClass } from 'app/models/dss';
import { DashboardService } from 'app/services/dashboard.service';
import { MasterService } from 'app/services/master.service';
import { DISABLED } from '@angular/forms/src/model';
import { PlantView, DocumentTypeView, OutputTypeView } from 'app/models/master';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
    showExtraToFields: boolean;
    ConfigurationFormGroup: FormGroup;
    AllDocumentTypeNames: string[] = [];
    SelectedDocumetType: string;
    // AllOutputTypes: OutputTypeView[] = [];
    AllUserEmails: AuthorityClass[] = [];
    // AllPlants: PlantView[] = [];
    // AllFilteredPlants: PlantView[] = [];
    AllDocumentTypes: DocumentTypeView[] = [];
    AllFilteredDocumentTypes: DocumentTypeView[] = [];
    AllAuthority: AuthorityClass[] = [];
    AllAuthority1: AuthorityClass[] = [];
    AllAuthority2: AuthorityClass[] = [];
    AllAuthority3: AuthorityClass[] = [];
    AllAuthority4: AuthorityClass[] = [];
    AllAuthority5: AuthorityClass[] = [];
    AllUsersByPlant: UserByPlant[] = [];
    AllFilteredUsersByPlant: UserByPlant[] = [];
    AllCertificates: CertificateClass[] = [];
    CurrentDSSConfiguration: DSSConfiguration[] = [];
    constructor(
        public matDialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DSSConfigurationData: DSSConfiguration,
        private formBuilder: FormBuilder,
        private dashboardService: DashboardService,
        private masterService: MasterService
    ) {
        // Set the defaults
        this.ConfigurationFormGroup = this.formBuilder.group({
            DocumentType: ['', Validators.required],
            // Plant: ['', Validators.required],
            // DocumentType: ['', Validators.required],
            // OutputType: ['', Validators.required],
            AutoSign: ['', Validators.required],
            Config1: ['', Validators.required],
            Config2: ['', Validators.required],
            Config3: ['', Validators.required],
            Authority1: ['', Validators.required],
            Authority2: [''],
            Authority3: [''],
            Authority4: [''],
            Authority5: [''],
            Authority6: [''],
            CertificateName: ['', Validators.required],
            ExpiryDate: ['', Validators.required]
        });

        this.showExtraToFields = false;
    }
    ResetControl(): void {
        this.ConfigurationFormGroup.reset();
        Object.keys(this.ConfigurationFormGroup.controls).forEach(key => {
            this.ConfigurationFormGroup.get(key).markAsUntouched();
        });
    }
    ngOnInit(): void {
        this.GetAllDocumentTypeNames();
        this.GetAllDocumentTypes();
        this.GetAllCertificateFromStore();
        this.GetAllAuthoritys();
        if (this.DSSConfigurationData) {
            // console.log(this.DSSConfigurationData);
            this.ConfigurationFormGroup.setValue({
                DocumentType: this.DSSConfigurationData.DOCTYPE,
                AutoSign: this.DSSConfigurationData.AUTOSIGN === false ? '0' : '1',
                Config1: this.DSSConfigurationData.CONFIG1,
                Config2: this.DSSConfigurationData.CONFIG2,
                Config3: this.DSSConfigurationData.CONFIG3,
                Authority1: this.DSSConfigurationData.AUTHORITY1,
                Authority2: this.DSSConfigurationData.AUTHORITY2,
                Authority3: this.DSSConfigurationData.AUTHORITY3,
                Authority4: this.DSSConfigurationData.AUTHORITY4,
                Authority5: this.DSSConfigurationData.AUTHORITY5,
                Authority6: this.DSSConfigurationData.AUTHORITY6,
                CertificateName: this.DSSConfigurationData.CERT_NAME,
                ExpiryDate: this.DSSConfigurationData.CERT_EX_DT
            });
            this.DisableMatOptions();
        } else {
            this.DSSConfigurationData = new DSSConfiguration();
            this.ResetControl();
            this.ConfigurationFormGroup.get('AutoSign').patchValue('0');
        }
    }

    GetAllAuthoritys(): void {
        this.masterService.GetAllAuthority().subscribe(
            data => {
                this.AllUserEmails = data as AuthorityClass[];
                if (this.AllUserEmails) {
                    this.DisableMatOptions();
                }
            },
            err => {
                console.error(err);
            }
        );
    }
    GetDocumentType(documentType: string): void {
        this.ConfigurationFormGroup.controls['Config3'].setValue(documentType);
    }
    GetAllDocumentTypeNames(): void {
        this.masterService.GetAllDocumentTypeNames().subscribe(
            data => {
                if (data) {
                    this.AllDocumentTypeNames = <string[]>data;
                }
            },
            err => {
                console.error(err);
            }
        );
    }

    GetAllDocumentTypes(): void {
        this.masterService.GetAllDocumentTypeViews().subscribe(
            data => {
                this.AllDocumentTypes = data as DocumentTypeView[];
                this.AllFilteredDocumentTypes = this.AllDocumentTypes;
            },
            err => {
                console.error(err);
            }
        );
    }


    // GetAllUserEmails(): void {
    //     this.dashboardService.GetAllUserEmails().subscribe(
    //         data => {
    //             this.AllUserEmails = data as AuthorityClass[];
    //             if (this.AllUserEmails) {
    //                 this.DisableMatOptions();
    //             }
    //         },
    //         err => {
    //             console.error(err);
    //         }
    //     );
    // }

    SignedAuthority1Selected(): void {
        this.DisableMatOptions();
    }
    SignedAuthoritySelected(): void {
        this.DisableMatOptions();
    }



    DisableMatOptions(): void {

        if (this.AllUserEmails && this.AllUserEmails.length > 0) {
            this.AllUserEmails.forEach(x => (x.IsSelected = false));
            const Priority1User = this.ConfigurationFormGroup.get('Authority1').value;
            // console.log(this.AllUserEmails);
            if (Priority1User) {
                const p1u = this.AllUserEmails.find(x => x.UserName === Priority1User);
                if (p1u) {
                    p1u.IsSelected = true;
                }
            }
            const Priority2User = this.ConfigurationFormGroup.get('Authority2').value;
            if (Priority2User) {
                const p2u = this.AllUserEmails.find(x => x.UserName === Priority2User);
                if (p2u) {
                    p2u.IsSelected = true;
                }
            }
            const Priority3User = this.ConfigurationFormGroup.get('Authority3').value;
            if (Priority3User) {
                const p3u = this.AllUserEmails.find(x => x.UserName === Priority3User);
                if (p3u) {
                    p3u.IsSelected = true;
                }
            }
            const Priority4User = this.ConfigurationFormGroup.get('Authority4').value;
            if (Priority4User) {
                const p4u = this.AllUserEmails.find(x => x.UserName === Priority4User);
                if (p4u) {
                    p4u.IsSelected = true;
                }
            }
            const Priority5User = this.ConfigurationFormGroup.get('Authority5').value;
            if (Priority5User) {
                const p5u = this.AllUserEmails.find(x => x.UserName === Priority5User);
                if (p5u) {
                    p5u.IsSelected = true;
                }
            }
            const Priority6User = this.ConfigurationFormGroup.get('Authority6').value;
            if (Priority6User) {
                const p6u = this.AllUserEmails.find(x => x.UserName === Priority6User);
                if (p6u) {
                    p6u.IsSelected = true;
                }
            }
        }
    }

    GetAllCertificateFromStore(): void {
        this.dashboardService.GetAllCertificateFromStore().subscribe(
            data => {
                this.AllCertificates = data as CertificateClass[];
                if (this.AllCertificates && this.AllCertificates.length > 0) {
                    if (this.DSSConfigurationData && this.DSSConfigurationData.CONFIG2) {
                    } else {
                        this.ConfigurationFormGroup.get('CertificateName').patchValue(this.AllCertificates[0].CertificateName);
                        this.ConfigurationFormGroup.get('ExpiryDate').patchValue(this.AllCertificates[0].ExpiryDate);
                    }
                }
            },
            err => {
                console.error(err);
            }
        );
    }

    GetExpiryDate(cert: string): void {
        // const cert = this.ConfigurationFormGroup.get('CertificateName').value;
        if (cert) {
            const filteredCert = this.AllCertificates.filter(x => x.CertificateName === cert)[0];
            if (filteredCert) {
                const exp = filteredCert.ExpiryDate;
                if (exp) {
                    this.ConfigurationFormGroup.get('ExpiryDate').patchValue(exp);
                    // this.DSSConfigurationData.CERT_EX_DT = exp;
                }
            }
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    YesClicked(): void {
        if (this.ConfigurationFormGroup.valid) {
            this.DSSConfigurationData.DOCTYPE = this.ConfigurationFormGroup.get('DocumentType').value;
            // this.DSSConfigurationData.Plant_ID = this.ConfigurationFormGroup.get('Plant').value;
            this.DSSConfigurationData.CONFIG1 = this.ConfigurationFormGroup.get('Config1').value;
            this.DSSConfigurationData.CONFIG2 = this.ConfigurationFormGroup.get('Config2').value;
            this.DSSConfigurationData.CONFIG3 = this.ConfigurationFormGroup.get('Config3').value;
            this.DSSConfigurationData.AUTOSIGN = this.ConfigurationFormGroup.get('AutoSign').value === '0' ? false : true;
            // this.DSSConfigurationData.AUTHORITY = this.ConfigurationFormGroup.get('SignedAuthority').value;
            this.DSSConfigurationData.CERT_NAME = this.ConfigurationFormGroup.get('CertificateName').value;
            this.DSSConfigurationData.CERT_EX_DT = this.ConfigurationFormGroup.get('ExpiryDate').value;
            this.DSSConfigurationData.AUTHORITY1 = this.ConfigurationFormGroup.get('Authority1').value;
            this.DSSConfigurationData.AUTHORITY2 = this.ConfigurationFormGroup.get('Authority2').value;
            this.DSSConfigurationData.AUTHORITY3 = this.ConfigurationFormGroup.get('Authority3').value;
            this.DSSConfigurationData.AUTHORITY4 = this.ConfigurationFormGroup.get('Authority4').value;
            this.DSSConfigurationData.AUTHORITY5 = this.ConfigurationFormGroup.get('Authority5').value;
            this.DSSConfigurationData.AUTHORITY6 = this.ConfigurationFormGroup.get('Authority6').value;
            this.matDialogRef.close(this.DSSConfigurationData);
        } else {
            Object.keys(this.ConfigurationFormGroup.controls).forEach(key => {
                this.ConfigurationFormGroup.get(key).markAsTouched();
                this.ConfigurationFormGroup.get(key).markAsDirty();
            });
        }
    }

    CloseClicked(): void {
        this.matDialogRef.close(null);
    }
}
