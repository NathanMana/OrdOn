#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

DROP SCHEMA IF EXISTS `ordon`;
CREATE SCHEMA `ordon` ;
#------------------------------------------------------------
# Table: Patient
#------------------------------------------------------------

create table ordon.Patient(
        id_patient         Int  Auto_increment  NOT NULL ,
        encryptedId        Varchar (100) ,
        birthdate          Date NOT NULL ,
        isQRCodeVisible    Bool NOT NULL ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL
	,CONSTRAINT Patient_PK PRIMARY KEY (id_patient)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Drug
#------------------------------------------------------------

create table ordon.Drug(
        id_drug Int  Auto_increment  NOT NULL ,
        name    Text NOT NULL
	,CONSTRAINT Drug_PK PRIMARY KEY (id_drug)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Professionnal
#------------------------------------------------------------

create table ordon.Professionnal(
        id_professionnal   Int  Auto_increment  NOT NULL ,
        city               Varchar (100) NOT NULL ,
        address            Varchar (150) NOT NULL ,
        zipcode            Int NOT NULL ,
        typeProfessionnal  Int NOT NULL ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL
	,CONSTRAINT Professionnal_PK PRIMARY KEY (id_professionnal)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Pharmacist
#------------------------------------------------------------

create table ordon.Pharmacist(
        id_pharmacist      Int NOT NULL ,
        encryptedId        Varchar (100),
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL ,
        id_professionnal   Int NOT NULL
	,CONSTRAINT Pharmacist_PK PRIMARY KEY (id_pharmacist)

	,CONSTRAINT Pharmacist_Professionnal_FK FOREIGN KEY (id_professionnal) REFERENCES Professionnal(id_professionnal)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Doctor
#------------------------------------------------------------

create table ordon.Doctor(
        id_doctor          Int NOT NULL ,
        encryptedId        Varchar (100) ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL ,
        id_professionnal   Int NOT NULL 
	,CONSTRAINT Doctor_PK PRIMARY KEY (id_doctor)

	,CONSTRAINT Doctor_Professionnal_FK FOREIGN KEY (id_professionnal) REFERENCES Professionnal(id_professionnal)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Prescription
#------------------------------------------------------------

create table ordon.Prescription(
        id_prescription  Int  Auto_increment  NOT NULL ,
        date_creation    Date NOT NULL ,
        councils         Text NOT NULL ,
        isQRCodeVisible  Bool NOT NULL ,
        date_archived    Date NOT NULL ,
        id_professionnal Int NOT NULL ,
        id_doctor        Int NOT NULL ,
        id_patient       Int NOT NULL
	,CONSTRAINT Prescription_PK PRIMARY KEY (id_prescription)

	,CONSTRAINT Prescription_Doctor_FK FOREIGN KEY (id_professionnal,id_doctor) REFERENCES Doctor(id_professionnal,id_doctor)
	,CONSTRAINT Prescription_Patient0_FK FOREIGN KEY (id_patient) REFERENCES Patient(id_patient)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Attribution
#------------------------------------------------------------

create table ordon.Attribution(
        id_attribution  Int  Auto_increment  NOT NULL ,
        description     Varchar (300) NOT NULL ,
        quantity        Int NOT NULL ,
        mention         Varchar (300) NOT NULL ,
        id_prescription Int NOT NULL ,
        id_drug         Int NOT NULL
	,CONSTRAINT Attribution_PK PRIMARY KEY (id_attribution)

	,CONSTRAINT Attribution_Prescription_FK FOREIGN KEY (id_prescription) REFERENCES Prescription(id_prescription)
	,CONSTRAINT Attribution_Drug0_FK FOREIGN KEY (id_drug) REFERENCES Drug(id_drug)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: given_attribution
#------------------------------------------------------------

create table ordon.given_attribution(
        id_attribution   Int NOT NULL ,
        id_professionnal Int NOT NULL ,
        id_pharmacist    Int NOT NULL ,
        quantity         Int NOT NULL ,
        date             Date NOT NULL
	,CONSTRAINT given_attribution_PK PRIMARY KEY (id_attribution,id_professionnal,id_pharmacist)

	,CONSTRAINT given_attribution_Attribution_FK FOREIGN KEY (id_attribution) REFERENCES Attribution(id_attribution)
	,CONSTRAINT given_attribution_Pharmacist0_FK FOREIGN KEY (id_professionnal,id_pharmacist) REFERENCES Pharmacist(id_professionnal,id_pharmacist)
)ENGINE=InnoDB;

