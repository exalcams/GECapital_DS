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
    AllUserEmails: string[] = [];
    // AllPlants: PlantView[] = [];
    // AllFilteredPlants: PlantView[] = [];
    AllDocumentTypes: DocumentTypeView[] = [];
    AllFilteredDocumentTypes: DocumentTypeView[] = [];
    AllAuthority: AuthorityClass[] = [];
    AllAuthority1: AuthorityClass[] = [];
    AllAuthority2: AuthorityClass[] = [];
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
            //Plant: ['', Validators.required],
            // DocumentType: ['', Validators.required],
            // OutputType: ['', Validators.required],
            AutoSign: ['', Validators.required],
            Config1: ['', Validators.required],
            Config2: ['', Validators.required],
            Config3: ['', Validators.required],
            Authority1: ['', Validators.required],
            Authority2: ['', Validators.required],
            Authority3: ['', Validators.required],
            // Priority1User: ['', Validators.required],
            // Priority2User: [''],
            // Priority3User: [''],
            // Priority4User: [''],
            // Priority5User: [''],
            // SignedAuthority: ['', Validators.required],
            CertificateName: ['', Validators.required],
            ExpiryDate: ['', Validators.required],
            // DisplayTitle1: ['', Validators.required],
            // DisplayTitle2: [''],
        });
        // this.CurrentDSSConfiguration = new DSSConfiguration();
        this.showExtraToFields = false;
    }
    ResetControl(): void {
        this.ConfigurationFormGroup.reset();
        Object.keys(this.ConfigurationFormGroup.controls).forEach(key => {
            this.ConfigurationFormGroup.get(key).markAsUntouched();
        });

    }
    ngOnInit(): void {
        console.log(this.SelectedDocumetType);
        this.GetAllDocumentTypeNames();
        //  this.GetAllOutputTypeNames();
        // this.GetAllUserEmails();
        //this.GetAllPlants();
        this.GetAllDocumentTypes();
        // this.GetAllUsersByPlant();
        this.GetAllCertificateFromStore();
        this.GetAllAuthoritys();
        if (this.DSSConfigurationData) {
            console.log(this.DSSConfigurationData);
            this.ConfigurationFormGroup.setValue({
                DocumentType: this.DSSConfigurationData.DOCTYPE,
                // Plant: this.DSSConfigurationData.Plant_ID,
                // DocumentType: this.DSSConfigurationData.CONFIG2,
                // OutputType: this.DSSConfigurationData.CONFIG3,
                AutoSign: this.DSSConfigurationData.AUTOSIGN === false ? '0' : '1',
                // SignedAuthority: this.DSSConfigurationData.AUTHORITY,
                Config1: this.DSSConfigurationData.CONFIG1,
                Config2: this.DSSConfigurationData.CONFIG2,
                Config3: this.DSSConfigurationData.CONFIG3,
                Authority1: this.DSSConfigurationData.AUTHORITY1,
                Authority2: this.DSSConfigurationData.AUTHORITY2,
                Authority3: this.DSSConfigurationData.AUTHORITY3,
                CertificateName: this.DSSConfigurationData.CERT_NAME,
                ExpiryDate: this.DSSConfigurationData.CERT_EX_DT
                // Priority1User: this.DSSConfigurationData.PRIORITY1_USER,
                // Priority2User: this.DSSConfigurationData.PRIORITY2_USER,
                // Priority3User: this.DSSConfigurationData.PRIORITY3_USER,
                // Priority4User: this.DSSConfigurationData.PRIORITY4_USER,
                // Priority5User: this.DSSConfigurationData.PRIORITY5_USER,
                // DisplayTitle1: this.DSSConfigurationData.DISPLAYTITLE1,
                // DisplayTitle1: this.DSSConfigurationData.DISPLAYTITLE1,
                // DisplayTitle2: this.DSSConfigurationData.DISPLAYTITLE2
            });
            // console.log(this.DSSConfigurationData);
            //this.DisableMatOptions();
        } else {
            this.DSSConfigurationData = new DSSConfiguration();
            this.ResetControl();
            this.ConfigurationFormGroup.get('AutoSign').patchValue('0');
        }
    }

    GetAllAuthoritys(): void {
        this.masterService.GetAllAuthority().subscribe(
            (data) => {
                this.AllAuthority = <AuthorityClass[]>data;
                this.AllAuthority1 = <AuthorityClass[]>data;
                this.AllAuthority2 = <AuthorityClass[]>data;
                // console.log(this.AllMenuApps);
                // this.AllDocumentTypeNameCompleted = true;
            },
            (err) => {
                console.error(err);
                // this.AllDocumentTypeNameCompleted = true;
            }
        );
    }
    GetDocumentType(documentType: string): void {
        //this.ConfigurationFormGroup.setValue({ DocumentType: documentType });
        this.ConfigurationFormGroup.controls['Config3'].setValue(documentType);
    }
    GetAllDocumentTypeNames(): void {
        this.masterService.GetAllDocumentTypeNames().subscribe((data) => {
            if (data) {
                this.AllDocumentTypeNames = <string[]>data;
            }
        },
            (err) => {
                console.log(err);
            });
    }
    // GetAllOutputTypeNames(): void {
    //     this.masterService.GetAllOutputTypeViews().subscribe((data) => {
    //         if (data) {
    //             this.AllOutputTypes = <OutputTypeView[]>data;
    //         }
    //     },
    //         (err) => {
    //             console.error(err);
    //         });
    // }
    GetAllDocumentTypes(): void {
        this.masterService.GetAllDocumentTypeViews().subscribe(
            (data) => {
                this.AllDocumentTypes = data as DocumentTypeView[];
                this.AllFilteredDocumentTypes = this.AllDocumentTypes;
            },
            (err) => {
                console.error(err);
            }
        );
    }
    // GetAllPlants(): void {
    //     this.masterService.GetAllPlantViews().subscribe(
    //         (data) => {
    //             this.AllPlants = data as PlantView[];
    //             this.AllFilteredPlants = this.AllPlants;
    //         },
    //         (err) => {
    //             console.error(err);
    //         }
    //     );
    // }

    GetAllUserEmails(): void {
        this.dashboardService.GetAllUserEmails().subscribe(
            (data) => {
                this.AllUserEmails = data as string[];
            },
            (err) => {
                console.error(err);
            }
        );
    }


    // GetAllUsersByPlant(): void {
    //     this.dashboardService.GetAllUsersByPlant().subscribe(
    //         (data) => {
    //             this.AllUsersByPlant = data as UserByPlant[];
    //             // console.log(this.AllUsersByPlant);
    //             if (this.AllUsersByPlant) {
    //                 // this.AllUsersByPlant.forEach(x => {
    //                 //     this.AllUsers.push(x.UserName);
    //                 // });
    //                 if (this.DSSConfigurationData && this.DSSConfigurationData.Plant_ID) {
    //                     this.AllFilteredUsersByPlant = this.AllUsersByPlant.filter
    //                         (x => x.Plant_ID === this.DSSConfigurationData.Plant_ID);
    //                     this.DisableMatOptions();
    //                 }
    //             }
    //         },
    //         (err) => {
    //             console.error(err);
    //         }
    //     );
    // }
    // onPlantChange(plantValue: string): void {
    //     console.log(plantValue);
    //     const plantValue = this.ConfigurationFormGroup.get('Plant').value;
    //     if (plantValue) {
    //         const fil = this.AllUsersByPlant.filter(x => x.Plant === plantValue);
    //         // const filt = fil.map(x => x.DocumentType);
    //         this.AllFilteredDocumentTypes = Array.from(new Set(fil.map(x => x.DocumentType)));
    //         this.ConfigurationFormGroup.get('DocumentType').patchValue('');
    //     }
    //     const documentTypeValue = this.ConfigurationFormGroup.get('DocumentType').value;
    //     if (plantValue) {
    //         this.AllFilteredUsersByPlant = this.AllUsersByPlant.filter(x => x.Plant_ID === plantValue);
    //         console.log(this.AllFilteredUsersByPlant);
    //         this.ConfigurationFormGroup.get('SignedAuthority').patchValue('');
    //         this.ConfigurationFormGroup.get('DisplayTitle1').patchValue('');
    //     }
    // }
    // onDocumntTypeChange(): void {
    //     const documentTypeValue = this.ConfigurationFormGroup.get('DocumentType').value;
    //     // if (documentTypeValue) {
    //     //     const fil = this.AllUsersByPlant.filter(x => x.DocumentType === documentTypeValue);
    //     //     // const filt = fil.map(x => x.Plant);
    //     //     this.AllFilteredPlants = Array.from(new Set(fil.map(x => x.Plant)));
    //     // }
    //     const plantValue = this.ConfigurationFormGroup.get('Plant').value;
    //     if (plantValue && documentTypeValue) {
    //         this.AllFilteredUsersByPlant = this.AllUsersByPlant.filter(x => x.Plant === plantValue && x.DocumentType === documentTypeValue);
    //         this.ConfigurationFormGroup.get('SignedAuthority').patchValue('');
    //         this.ConfigurationFormGroup.get('DisplayTitle1').patchValue('');
    //     }
    // }
    SignedAuthority1Selected(SignedAuthority: string): void {
        // console.log(SignedAuthority);
        const res = this.AllAuthority.filter(x => x.UserName !== SignedAuthority);
        console.log(res);
        // alert(SignedAuthority);
        if (res) {
            this.AllAuthority1 = <AuthorityClass[]>res;
        }
    }
    SignedAuthority2Selected(SignedAuthority: string): void {
        // console.log(SignedAuthority);
        const res = this.AllAuthority1.filter(x => x.UserName !== SignedAuthority);
        console.log(res);
        // alert(SignedAuthority);
        if (res) {
            this.AllAuthority2 = <AuthorityClass[]>res;
        }
    }
    //  SignedAuthority3Selected(SignedAuthority: string): void {
    //     // console.log(SignedAuthority);
    //      const res = this.AllAuthority.filter(x => x.UserName !== SignedAuthority);
    //      console.log(res);
    //      // alert(SignedAuthority);
    //      if (res) {
    //          this.AllAuthority3 = <AuthorityClass[]>res;
    //      }
    //  }
    Priority1UserSelected(Priority1User: string): void {
        // console.log('Called');
        // if (Priority1User) {
        //     const res = this.AllFilteredUsersByPlant.filter(x => x.UserName === Priority1User)[0];
        //     if (res) {
        //         this.ConfigurationFormGroup.get('DisplayTitle1').patchValue('');
        //     }
        // }
        //this.DisableMatOptions();
    }
    PriorityUserSelected(PriorityUser: string): void {
        // const res = this.AllFilteredUsersByPlant.filter(x => x.UserName === PriorityUser)[0];
        // if (res) {
        //     this.ConfigurationFormGroup.get('DisplayTitle1').patchValue(res.DisplayTitle);
        // }
        //this.DisableMatOptions();
    }

    // DisableMatOptions(): void {
    //     if (this.AllFilteredUsersByPlant && this.AllFilteredUsersByPlant.length > 0) {
    //         this.AllFilteredUsersByPlant.forEach(x => x.IsSelected = false);
    //         const Priority1User = this.ConfigurationFormGroup.get('Priority1User').value;
    //         if (Priority1User) {
    //             const p1u = this.AllFilteredUsersByPlant.find(x => x.UserName === Priority1User);
    //             if (p1u) {
    //                 p1u.IsSelected = true;
    //             }
    //         }
    //         const Priority2User = this.ConfigurationFormGroup.get('Priority2User').value;
    //         if (Priority2User) {
    //             const p2u = this.AllFilteredUsersByPlant.find(x => x.UserName === Priority2User);
    //             if (p2u) {
    //                 p2u.IsSelected = true;
    //             }
    //         }
    //         const Priority3User = this.ConfigurationFormGroup.get('Priority3User').value;
    //         if (Priority3User) {
    //             const p3u = this.AllFilteredUsersByPlant.find(x => x.UserName === Priority3User);
    //             if (p3u) {
    //                 p3u.IsSelected = true;
    //             }
    //         }
    //         const Priority4User = this.ConfigurationFormGroup.get('Priority4User').value;
    //         if (Priority4User) {
    //             const p4u = this.AllFilteredUsersByPlant.find(x => x.UserName === Priority4User);
    //             if (p4u) {
    //                 p4u.IsSelected = true;
    //             }
    //         }
    //         const Priority5User = this.ConfigurationFormGroup.get('Priority5User').value;
    //         if (Priority5User) {
    //             const p5u = this.AllFilteredUsersByPlant.find(x => x.UserName === Priority5User);
    //             if (p5u) {
    //                 p5u.IsSelected = true;
    //             }
    //         }
    //     }
    // }

    GetAllCertificateFromStore(): void {
        this.dashboardService.GetAllCertificateFromStore().subscribe(
            (data) => {
                this.AllCertificates = data as CertificateClass[];
                if (this.AllCertificates && this.AllCertificates.length > 0) {
                    if (this.DSSConfigurationData && this.DSSConfigurationData.CONFIG2) {
                    } else {
                        this.ConfigurationFormGroup.get('CertificateName').patchValue(this.AllCertificates[0].CertificateName);
                        this.ConfigurationFormGroup.get('ExpiryDate').patchValue(this.AllCertificates[0].ExpiryDate);
                    }
                }
            },
            (err) => {
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
            this.DSSConfigurationData.AUTOSIGN = this.ConfigurationFormGroup.get('AutoSign').value == 0 ? false : true;
            // this.DSSConfigurationData.AUTHORITY = this.ConfigurationFormGroup.get('SignedAuthority').value;
            this.DSSConfigurationData.CERT_NAME = this.ConfigurationFormGroup.get('CertificateName').value;
            this.DSSConfigurationData.CERT_EX_DT = this.ConfigurationFormGroup.get('ExpiryDate').value;
            this.DSSConfigurationData.AUTHORITY1 = this.ConfigurationFormGroup.get('Authority1').value;
            this.DSSConfigurationData.AUTHORITY2 = this.ConfigurationFormGroup.get('Authority2').value;
            this.DSSConfigurationData.AUTHORITY3 = this.ConfigurationFormGroup.get('Authority3').value;
            // this.DSSConfigurationData.PRIORITY1_USER = this.ConfigurationFormGroup.get('Priority1User').value;
            // this.DSSConfigurationData.PRIORITY2_USER = this.ConfigurationFormGroup.get('Priority2User').value;
            // this.DSSConfigurationData.PRIORITY3_USER = this.ConfigurationFormGroup.get('Priority3User').value;
            // this.DSSConfigurationData.PRIORITY4_USER = this.ConfigurationFormGroup.get('Priority4User').value;
            // this.DSSConfigurationData.PRIORITY5_USER = this.ConfigurationFormGroup.get('Priority5User').value;
            // this.DSSConfigurationData.DISPLAYTITLE1 = this.ConfigurationFormGroup.get('DisplayTitle1').value;
            // this.DSSConfigurationData.DISPLAYTITLE1 = this.ConfigurationFormGroup.get('DisplayTitle1').value;
            // this.DSSConfigurationData.DISPLAYTITLE2 = this.ConfigurationFormGroup.get('DisplayTitle2').value;
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
