export class DSSInvoice {
    ID: number;
    CONFIG_ID: number;
    CONFIG1: string;
    CONFIG2: string;
    CONFIG3: string;
    CODE: string;
    DOCTYPE: string;
    AREA: string;
    INV_NAME: string;
    INVOICE_NAME: string;
    SIGNED_AUTHORITY: string;
    SIGNED_ON: Date;
    AUTOSIGNED: boolean;
    AUTHORITY1: string;
    AUTHORITY2: string;
    AUTHORITY3: string;
    AUTHORITY4: string;
    AUTHORITY5: string;
    AUTHORITY6: string;
    ISREJECTED: boolean;
    REJECTED_BY: string;
    REJECTED_ON?: Date;
    REASON_FOR_REJECTION: string;
}
export class DSSErrorInvoice {
    ID: number;
    INV_NAME: string;
    INVOICE_NAME: string;
    CREATED_ON?: Date;
    COMMENT: string;
}
export class ErrorInvoice {
    ID: number;
    CODE: string;
    DOCTYPE: string;
    AREA: string;
    INV_NAME: string;
    INVOICE_NAME: string;
    CREATED_ON?: Date;
    COMMENT: string;
    SIGNED_AUTHORITY: string;
}
export class DSSConfiguration {
    CONFIG_ID: number;
    DOCTYPE: string;
    // Plant_ID: string;
    // DocumentType_ID: string;
    // OutputType_ID: string;
    AUTOSIGN: boolean;
    CERT_NAME: string;
    CERT_EX_DT: Date;
    AUTHORITY1: string;
    AUTHORITY2: string;
    AUTHORITY3: string;
    AUTHORITY4: string;
    AUTHORITY5: string;
    AUTHORITY6: string;
    DISPLAYTITLE1: string;
    DISPLAYTITLE2: string;
    CONFIG1: string;
    CONFIG2: string;
    CONFIG3: string;
    // PRIORITY4_USER: string;
    // PRIORITY5_USER: string;
    CREATED_ON?: Date;
    CREATED_BY: string;
    LASTMODIFIED_ON?: Date;
    LASTMODIFIED_BY: string;
    PASSKEY?: string;
}
export class UserByPlant {
    UserName: string;
    DocumentType: string;
    Config1: string;
    Config2: string;
    Config3: string;
    AutoSign: boolean;
    SignedAuthority: string;
    CERT_NAME: string;
    CERT_EX_DT: Date;
    // Plant_ID: string;
    // Priority: string;
    DisplayTitle1: string;
    DisplayTitle2: string;
    // IsSelected: boolean;
}
export class UserByPlantView {
    UserName: string;
    DocumentTypeID: string;
    DocumentType: string;
    PlantID: string;
    Plant: string;
    PriorityID: string;
    Priority: string;
    DisplayTitle: string;
}
export class DSSStatusCount {
    SignedDocumnentCount: number;
    UnSignedDocumnentCount: number;
    RejectedDocumnentCount: number;
    ErrorDocumentCount: number;
    ConfigurationCount: number;
    ExpiryCerificateCount: number;
}

export class CertificateClass {
    CertificateName: string;
    ExpiryDate?: Date;
}

export class AuthorityClass {
    UserName: string;
    Name: string;
    IsSelected: boolean;
}

export class GetDocument {
    // FromInvoice: number;
    // ToInvoice: number;
    // Plant_ID: string;
    DocumentType: string;
    // OutputType_ID: string;
    // Authority: string;
    FromDate: string;
    ToDate: string;
    UserName: string;
}
export class ManualSignResponse {
    StatusMessage: string;
    Status: string;
}

export class RejectionView {
    ID: number;
    INVOICE_NAME: string;
    ISREJECTED: boolean;
    REJECTED_BY: string;
    REJECTED_ON?: Date;
    REASON_FOR_REJECTION: string;
}
