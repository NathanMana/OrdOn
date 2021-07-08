# OrdOn

Utilisateurs, rôles et actions

Les rôles définis pour ce scénario de projet sont les suivants :

Médecin - Prescrit des médicaments en remplissant un formulaire sur la base de métadonnées telles que l'ID du médecin, le nom du patient, la quantité, la posologie et la date d'expiration.
Patient - Reçoit un QRcode représentant une ordonnance valide émise par un médecin. Il se dirige dans une pharmacie avec son QRcode sur son téléphone.
Pharmacie - Distribue les médicaments après la génération de l'ordonnance à partir du QRcode. Elle vérifie la validité de l'ordonnance en recherchant dans la base de données l'autorisation une signature entre le patient et le médecin.



Problèmes associés au processus d'exécution des ordonnances actuelle

Pour mieux comprendre le paradigme actuel des ordonnances, nous avons consulté un pharmacien pour en savoir plus sur les failles de sécurité, les points sensibles et les inefficacités du système actuel.

Ce que nous avons appris :

Il n'existe pas de source de vérité faisant autorité en ce qui concerne la couche de données des ordonnances pharmaceutiques. Les différences entre les bases de données des entités publiques/privées créent un risque systémique, car elles déchargent le coût implicite associé au risque sur d'autres acteurs, c'est-à-dire le patient et/ou le médecin.

Il existe un coût quantifiable et implicite associé à l'aléa moral asymétrique, car le risque juridique de falsification est transféré au patient et/ou au médecin.

Anecdote : "En fonction de ce que je ressens personnellement, de ma relation avec le médecin et de la sincérité du patient, je peux décider d'appeler le médecin prescripteur et de vérifier l'ordonnance."
Cela illustre le manque de confiance, de vérifiabilité et de finalité associé au système actuel.

La vérification de l'ordonnance est un processus qui peut prendre jusqu'à 30 minutes. La vérification de l'authenticité de l'ordonnance est un processus manuel que le pharmacien doit effectuer lui-même. Par exemple, le pharmacien doit introduire le script dans une base de données, effectuer une mise à jour de l'inventaire, attendre la confirmation du gestionnaire, puis exécuter l'ordonnance.



Comment nous avons créé un meilleur système :

L’objectif est donc de passer d’un format imprimé à un format numérique en ce qui concerne les ordonnances. 
Le fait de passer d’un format à l’autre engendre de nouveaux enjeux et de nouvelles problématiques. 
C’est pour cela que nos objectifs sont également de permettre aux professionnels de santé ainsi qu’aux patients de communiquer via une interface digitale facile d’usage et pratique.
Enfin, ces nouvelles mesures entraînent un objectif global qui est de répondre efficacement au problème énoncé tout en assurant l’intégrité, la fiabilité, la véracité et la confidentialité des données.


Quantifier la valeur de notre solution

Selon un article du monde.fr publié le 27 mai 2021, la consommation et prescription des médicaments est en très nette hausse depuis le confinement de mars 2020. 
Bien qu’en hausse significativement plus importante qu’avant, cela rentre dans une tendance qui dure depuis déjà plusieurs dizaines d’années. 
La population, française notamment, consomme donc de plus en plus et pour répondre à cette demande, les médecins prescrivent de plus en plus d’ordonnance. 
La quantité de papier générée pour répondre à cette demande est démesurée et le constat écologique désastreux.

Notre solution reviendrait à éliminer le problème désastreux écologique.
Les coûts provisionnel financier malgré tout serai les suivants :
- Les noms de domaines devraient coûter pour une extension .fr 5 € la première année, et 10 € pour une extension .com.
- Hébergement du serveur de production la première année : 120 €
- Hébergement du serveur de préproduction la première année : 80 €
- Campagne de communication : 800 €
Le montant total estimé pour la première année est 1 015 €.


Étape pas à pas de notre solution :

1. Un patient va consulter son médecin et va lui donner son QRcode qui donne les infos de son profil au médecin pour pré remplir le formulaire.
2.
2a. Si c'est sa première connexion, le médecin doit activer/valider son profil si les infos sont bonnes
2b. S'il y a une faute de frappe ou erreur d'inattention  le médecin doit avertir le patient, qui va modifier sur son téléphone l'info concernée rapidement, puis le médecn rescanne son profil et l'active avec les bonnes informations
2c. Si les infos ne sont pas du tout bonnes, le médecin refuse son profil et son faux compte est préparé
3. Le médecin remplit l'ordonnance puis valide et le patient pourra la récupérer.
4. Le pharmacien s'est connecté au préalable via une double authentification et son numéro d'exercice. (ID unique vérifiant qu'il est bel et bien pharmacien)
5. le patient voit sa liste d'ordonnance actives et clique sur "Générer le QR"
6. Il reçoit un mail et un SMS lui demandant si c'est bien lui, il peut refuser si ce n'est pas le cas, il est obligé de valider pour éviter qu'il n'a 2 ordonnances + le mail contient le PDF de l'ordonnance.
6a. Si ce n'est pas lui il pourra modifer à nouveau son mail et son mdp, l'ordonnance sera réactivée
6b. Si c'est bien lui, le pharmacien aura accès à l'ordonnance, il lui donne les médicaments, et valide la mise à disposition.
7. Une fois l'ordonnance validée l'ordonnance apparaît dans les ordonnances passées et le QRcode n'est plus accessible, il peut avoir le pdf.

Comment utiliser notre solution ?

Connectez-vous sur notre plateforme "http://localhost:8000/" si vous être un patient, un pharmacien ou un médecin pour bénéficier de notre solution.

***

# Installation

## Prérequis
Avoir mysql et nodeJS installé

## Cloner le projet
Clonez le projet via la commande : "git clone https://github.com/NathanMana/OrdOn.git" ou téléchargez simplement le dossier zippé directement.

## Installer la base de données
Pour installer nos bases de données, importez les fichiers .sql (AdminDBBCreation.sql et databaseCreation.sql) dans votre gestionnaire de base de données (workbench ou phpmyadmin par exemple) et exécutez les scripts. Voilà, vos bases de données sont correctement installées.

## Configurer la connexion à la base de données
Pour établir le lien à la base de données, modifiez le nom d'utilisateur et le mot de passe du fichier OrdON/services/DatabaseConnection.js

## Modifier le module pathToProofFolder.js
Ce fichier permet de stocker les preuves de profession envoyées par les professionnels lors de l'inscription. Vous devez changer la seule ligne 
présente dans ce fichier pour qu'elle pointe vers le dossier /src/proof du projet.

## Installation des dépendances et lancement de la solution
Vous êtes actuellement à la racine du projet:
/
    -OrdON
    -Rendus du 18
    -.gitignore
    -README.md

Déplacez vous dans le dossier OrdON avec la commande "cd ordON"
Installez les dépendances en faisant "npm install"

Vous pouvez maintenant lancer le projet avec la commande "npm run start"

## Création d'un compte administrateur
Pour valider les comptes professionnels vous devez avoir un compte administrateur.
Décommentez la première route présente dans le fichier /controller/adminController.js (ligne 16)
Remplacez le mail et le mot de passe par vos informations personelles.
Allez sur cette route une fois, et votre compte sera créé (http://localhost:8000/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/creationCompteRapide)
Vous pouvez la commenter ensuite pour des questions de sécurité
Vous pouvez valider les comptes des professionnels en attente sur l'espace http://localhost:8000/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/

## Récupération des emails envoyés
Pour le développement, tous les emails envoyés sont récupérables sur la plateforme https://ethereal.email/
Il vous suffit de vous connecter avec les identifiants présents dans le fichier /externalsAPI/NodeMailer.js
A savoir :
email = sincere.pollich@ethereal.email
mot de passe = bxrBTrQcJd2Zd3SA3F

