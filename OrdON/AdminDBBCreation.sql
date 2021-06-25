#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

DROP SCHEMA IF EXISTS `ordonAdmin`;
CREATE SCHEMA `ordonAdmin` ;

#------------------------------------------------------------
# Table: ADMIN
#------------------------------------------------------------

create table ordonAdmin.admin(
        id_admin          Int  Auto_increment  NOT NULL ,
        email              Varchar (100) NOT NULL ,
        password           Varchar (200) NOT NULL 
	,CONSTRAINT Admin_PK PRIMARY KEY (id_admin)
)ENGINE=InnoDB;
