#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP SCHEMA IF EXISTS `ordon`;
CREATE SCHEMA `ordon` ;
DROP SCHEMA IF EXISTS `ordonPatient`;
CREATE SCHEMA `ordonPatient` ;
DROP SCHEMA IF EXISTS `ordonDoctor`;
CREATE SCHEMA `ordonDoctor` ;
DROP SCHEMA IF EXISTS `ordonPharmacist`;
CREATE SCHEMA `ordonPharmacist` ;
SET FOREIGN_KEY_CHECKS = 1;

#------------------------------------------------------------
# Table: Patient
#------------------------------------------------------------

create table ordonPatient.Patient(
        id_patient         Int  Auto_increment  NOT NULL ,
        encryptedId        Varchar (100) ,
        birthdate          Date NOT NULL ,
        weight             FLOAT, 
        qrCodeAccess       Varchar (100) ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL,
        isEmailVerified    Bool NOT NULL,
        tokenResetPassword              Varchar(200),  
        tokenEmail         Varchar(200),        
        gender             Varchar (30) NOT NULL 
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
        zipcode            Varchar(10) NOT NULL ,
        proofpath         Varchar(150)
	,CONSTRAINT Professionnal_PK PRIMARY KEY (id_professionnal)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Pharmacist
#------------------------------------------------------------

create table ordonPharmacist.Pharmacist(
        id_pharmacist      Int Auto_increment NOT NULL ,
        encryptedId        Varchar (100) ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL ,
        isEmailVerified    Bool NOT NULL,
        tokenEmail         Varchar(200) ,
        tokenResetPassword              Varchar(200),  
        gender             Varchar (30) NOT NULL,
        id_professionnal   Int NOT NULL
	,CONSTRAINT Pharmacist_PK PRIMARY KEY (id_pharmacist)

	,CONSTRAINT Pharmacist_Professionnal_FK FOREIGN KEY (id_professionnal) REFERENCES ordon.Professionnal(id_professionnal) ON DELETE CASCADE
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Doctor
#------------------------------------------------------------

create table ordonDoctor.Doctor(
        id_doctor          Int Auto_increment NOT NULL ,
        encryptedId        Varchar (100) ,
        name               Varchar (100) NOT NULL ,
        firstname          Varchar (100) NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL ,
        isAccountValidated Bool NOT NULL,
        isEmailVerified    Bool NOT NULL,
        tokenEmail         Varchar(200),
        tokenResetPassword              Varchar(200),  
        gender             Varchar (30) NOT NULL ,
        id_professionnal   Int NOT NULL 
	,CONSTRAINT Doctor_PK PRIMARY KEY (id_doctor)

	,CONSTRAINT Doctor_Professionnal_FK FOREIGN KEY (id_professionnal) REFERENCES ordon.Professionnal(id_professionnal) ON DELETE CASCADE
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Prescription
#------------------------------------------------------------

create table ordon.Prescription(
        id_prescription  Int  Auto_increment  NOT NULL ,
        encryptedId      Varchar (100) ,
        date_creation    Date NOT NULL ,
        qrCodeAccess     Varchar (100) ,
        date_archived    Date ,
        id_doctor        Int,
        id_patient       Int
	,CONSTRAINT Prescription_PK PRIMARY KEY (id_prescription)

	,CONSTRAINT Prescription_Doctor_FK FOREIGN KEY (id_doctor) REFERENCES ordonDoctor.Doctor(id_doctor) ON DELETE SET NULL
	,CONSTRAINT Prescription_Patient0_FK FOREIGN KEY (id_patient) REFERENCES ordonPatient.Patient(id_patient) ON DELETE SET NULL
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Council
#------------------------------------------------------------

create table ordon.Council(
        id_council  Int  Auto_increment  NOT NULL ,
        description    Varchar(500) NOT NULL,
        id_prescription Int NOT NULL
	,CONSTRAINT Council_PK PRIMARY KEY (id_council)

	,CONSTRAINT Council_Prescription_FK FOREIGN KEY (id_prescription) REFERENCES ordon.Prescription(id_prescription)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Attribution
#------------------------------------------------------------

create table ordon.Attribution(
        id_attribution  Int  Auto_increment  NOT NULL ,
        description     Varchar (300) NOT NULL ,
        quantity        Int NOT NULL ,
        id_prescription Int NOT NULL ,
        id_drug         Int NOT NULL
	,CONSTRAINT Attribution_PK PRIMARY KEY (id_attribution)

	,CONSTRAINT Attribution_Prescription_FK FOREIGN KEY (id_prescription) REFERENCES ordon.Prescription(id_prescription)
	,CONSTRAINT Attribution_Drug0_FK FOREIGN KEY (id_drug) REFERENCES ordon.Drug(id_drug)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Mention
#------------------------------------------------------------

create table ordon.Mention(
        id_mention Int  Auto_increment  NOT NULL ,
        name       VARCHAR(40) NOT NULL
	,CONSTRAINT Mention_PK PRIMARY KEY (id_mention)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: given_attribution
#------------------------------------------------------------

create table ordon.given_attribution(
        id_given_attribution Int Auto_increment NOT NULL,
        id_attribution   Int NOT NULL ,
        id_pharmacist    Int,
        quantity         Int NOT NULL ,
        date             Date NOT NULL ,
        isAlert          Bool NOT NULL
	,CONSTRAINT given_attribution_PK PRIMARY KEY (id_given_attribution)

	,CONSTRAINT given_attribution_Attribution_FK FOREIGN KEY (id_attribution) REFERENCES ordon.Attribution(id_attribution)
	,CONSTRAINT given_attribution_Pharmacist0_FK FOREIGN KEY (id_pharmacist) REFERENCES ordonPharmacist.Pharmacist(id_pharmacist) ON DELETE SET NULL
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: mention_attribution
#------------------------------------------------------------

create table ordon.mention_attribution(
        id_attribution Int NOT NULL ,
        id_mention     Int NOT NULL
	,CONSTRAINT mention_attribution_PK PRIMARY KEY (id_attribution,id_mention)

	,CONSTRAINT mention_attribution_Attribution_FK FOREIGN KEY (id_attribution) REFERENCES ordon.Attribution(id_attribution)
	,CONSTRAINT mention_attribution_Mention0_FK FOREIGN KEY (id_mention) REFERENCES ordon.Mention(id_mention)
)ENGINE=InnoDB;


#---------------------------------------------------------
# Mentions
#---------------------------------------------------------
INSERT INTO`ordon`.`Mention` (`name`) VALUES ('Non substituable (MTE)');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('Non substituable (EFG)');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('Non substituable (CIF)');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 1 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 2 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 3 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 4 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 5 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 6 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 7 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 8 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 9 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 10 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('AR 11 mois');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('QSP');
INSERT INTO`ordon`.`Mention` (`name`)  VALUES ('NR');

#----------------------------------------------------------
# Drugs
# ---------------------------------------------------------
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DOLIPRANE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('EFFERALGAN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DAFALGAN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('LEVOTHYROX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('IMODIUM');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('KARDEGIC');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('SPASFON');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ISIMIG');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('TAHOR');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('SPEDIFEN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('VOLTARENE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ELUDRIL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('IXPRIM');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PARACETAMOL BIOGARAN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('FORLAX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('MAGNE B6');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('HELICIDINE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('CLAMOXYL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PIASCLEDINE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('LAMALINE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('GAVISCON');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DAFLON');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ANTARENE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('RHINOFLUIMUCIL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PLAVIX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('MOPRAL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('SUBUTEX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('AERIUS');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ORELOX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('INEXIUM');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('METEOSPASMYL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('AUGMENTIN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('TOPLEXIL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PIVALONE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('VASTAREL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ADVIL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('EUPANTOL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DEXERYL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('RENUTRYL 500');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('XANAX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('EMLAPATCH');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('LASILIX');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ENDOTELON');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DEROXAT');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('TEMESTA');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('EFFEXOR');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PARACETAMOL SANDOZ');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('VENTOLINE');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('SOLUPRED');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('DEXTROPROPOXYPHENE PARAC BIOG');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PNEUMOREL');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('INIPOMP');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('PREVISCAN');
INSERT INTO `ordon`.`drug` (`name`) VALUES ('ASPEGIC');
