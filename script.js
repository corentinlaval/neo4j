// Importer le package neo4j-driver
const neo4j = require('neo4j-driver');
const readline = require('readline');

// Créer une connexion au driver Neo4j
const uri = 'bolt://localhost:7687'; // URI de connexion (localhost par défaut)
const user = 'neo4j';                // Nom d'utilisateur (par défaut)
const password = 'password';             // Mot de passe (défini lors de l'installation)
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Fonction principale pour se connecter et réaliser des opérations
async function main() {
    // Ouvre une session
    const session = driver.session();

    try {
        console.log("Connexion réussie à la base de données Neo4j!");

        let continueloop = true;

        while(continueloop){
            let choice = await Welcome();
            switch(choice){
                case "1":
                    await fillBDD(session);
                    break;

                case "2":
                    await deleteAllNodes(session);
                    break;

                case "3":
                    await addCompany(session);
                    break;

                case "4":
                    await addPerson(session);
                    break;

                case "5":
                    const choice = await DisplayChoiceRelation();
                    await addRelation(session, choice);
                    break;

                case "6":
                    await retrieveSuggestions(session);
                    break;
                
                case "exit":
                    continueloop = false;
                    console.log("Fermeture du programme...");
                    break;

                default:
                    console.log("Choix non reconnu");
            }
        }
        /*
        // Affichage des nœuds
        await displayAllNodes(session, "Person");

        // Mise à jour d'un nœud
        await updateNodeAge(session, "Alice", 35);

        // Affichage des nœuds après la mise à jour
        await displayAllNodes(session, "Person");

        // Suppression d'un nœud
        await deleteNode(session, "Bob");

        // Affichage des nœuds après suppression
        await displayAllNodes(session, "Person");*/

    } catch (error) {
        console.error("Erreur lors de l'exécution : ", error);
    } finally {
        // Fermer la session
        await session.close();
        console.log("Session fermée.");
    }

    // Fermer le driver
    await driver.close();
    console.log("Connexion terminée.");
}

async function DisplayChoiceRelation(){
    console.log("Ajout d'une relation : ");
    console.log("1. Entreprise / Personne");
    console.log("2. Connaissances");
    console.log("3. Collègues de travail");

    const answer = await askQuestion("Entrez le numéro de l'action souhaitée : ");
    return answer;
}

// Fonction pour créer un nœud
async function createNode(session, label, properties) {
    const result = await session.run(
        `CREATE (n:${label} $properties) RETURN n`,
        { properties }
    );
    console.log(`Nœud créé :`, result.records[0].get('n').properties);
}

// Fonction pour afficher tous les nœuds d'un type donné
async function displayAllNodes(session, label) {
    const result = await session.run(`MATCH (n:${label}) RETURN n`);
    // console.log(`Nœuds de type ${label} :`);
    result.records.forEach(record => {
        // console.log(record.get('n').properties);
    });
}

async function deleteAllNodes(session){
    const result = await session.run(`MATCH (n) DETACH DELETE n`);
    console.log("La BDD est vide");
}

async function Welcome(){
    console.log("Bonjour, que souhaitez-vous faire ?");
    console.log("1. Remplir la bdd de données factices");
    console.log("2. Vider l'entièreté de la BDD");
    console.log("3. Ajouter une Entreprise");
    console.log("4. Ajouter une Personne");
    console.log("5. Ajouter une Relation");
    console.log("6. Suggestion de Relations");
    console.log('Tapez "exit" pour sortir');

    const answer = await askQuestion("Entrez le numéro de l'action souhaitée : ");
    return answer;
}

// Fonction utilitaire pour poser une question à l'utilisateur
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
}

async function fillBDD(session){
    console.log("Remplissage de la BDD");
    console.log("Remplissage des Entreprises");
    await createNode(session, "Entreprise", { nom: "IKEA", secteur: "Mobilier", description: "Leader mondial dans le domaine de la vente de meubles en kit", taille: 100000 });
    await createNode(session, "Entreprise", { nom: "Google", secteur: "Technologie", description: "Multinationale spécialisée dans les services et produits technologiques", taille: 150000 });
    await createNode(session, "Entreprise", { nom: "Amazon", secteur: "E-commerce", description: "Plateforme d'e-commerce proposant divers produits", taille: 1300000 });
    await createNode(session, "Entreprise", { nom: "Tesla", secteur: "Automobile", description: "Constructeur de voitures électriques innovantes", taille: 75000 });
    await createNode(session, "Entreprise", { nom: "Airbnb", secteur: "Tourisme", description: "Plateforme de réservation de logements entre particuliers", taille: 14000 });
    await createNode(session, "Entreprise", { nom: "SpaceX", secteur: "Aérospatiale", description: "Société spécialisée dans les lancements spatiaux commerciaux", taille: 10000 });
    await createNode(session, "Entreprise", { nom: "Apple", secteur: "Technologie", description: "Fabricant de produits électroniques grand public", taille: 147000 });
    await createNode(session, "Entreprise", { nom: "Spotify", secteur: "Musique", description: "Plateforme de streaming musical avec des millions de titres", taille: 6000 });
    await createNode(session, "Entreprise", { nom: "Nike", secteur: "Textile", description: "Leader mondial dans la production de vêtements de sport", taille: 76000 });
    await createNode(session, "Entreprise", { nom: "Netflix", secteur: "Divertissement", description: "Plateforme de streaming de films et séries", taille: 11000 });

    console.log("Remplissage des Personnes")
    await createNode(session, "Personne", { nom: "Dupont", prenom: "Alice", description: "Développeuse front-end passionnée par les technologies modernes", "liste_des_compétences": ["HTML", "CSS", "JavaScript", "React"] });
    await createNode(session, "Personne", { nom: "Martin", prenom: "Bob", description: "Ingénieur data spécialisé dans l'analyse de grandes quantités de données", "liste_des_compétences": ["Python", "Pandas", "SQL", "Data Mining"] });
    await createNode(session, "Personne", { nom: "Leroy", prenom: "Charlie", description: "Architecte logiciel avec une expérience dans le développement backend", "liste_des_compétences": ["Java", "Spring Boot", "Microservices", "Kubernetes"] });
    await createNode(session, "Personne", { nom: "Bernard", prenom: "David", description: "Designer UX/UI, créateur d'interfaces utilisateur intuitives et esthétiques", "liste_des_compétences": ["Sketch", "Figma", "Adobe XD", "User Research"] });
    await createNode(session, "Personne", { nom: "Durand", prenom: "Eva", description: "Chef de projet agile avec une expérience dans la gestion d'équipes multidisciplinaires", "liste_des_compétences": ["Scrum", "Kanban", "Gestion de projet", "Communication"] });
    await createNode(session, "Personne", { nom: "Moreau", prenom: "Frank", description: "Expert en cybersécurité avec une passion pour la protection des systèmes d'information", "liste_des_compétences": ["Sécurité réseau", "Cryptographie", "Forensics", "Pentesting"] });
    await createNode(session, "Personne", { nom: "Roux", prenom: "George", description: "Développeur mobile spécialisé dans le développement d'applications iOS", "liste_des_compétences": ["Swift", "Objective-C", "Xcode", "UI Design"] });
    await createNode(session, "Personne", { nom: "Blanc", prenom: "Hélène", description: "Data Scientist spécialisée dans le Machine Learning et l'IA", "liste_des_compétences": ["Python", "TensorFlow", "Scikit-learn", "NLP"] });
    await createNode(session, "Personne", { nom: "Petit", prenom: "Isabelle", description: "Responsable marketing digital avec un focus sur les stratégies de contenu", "liste_des_compétences": ["SEO", "SEM", "Content Marketing", "Google Analytics"] });

    console.log("Remplissage des relations Personnes / Entreprises ")
    await createRelationship(session, "Dupont", "Alice", "Google", "A_TRAVAILLE_POUR", "2018-01-01", "2020-12-31", "Développeuse Front-End");
    await createRelationship(session, "Dupont", "Alice", "Tesla", "A_TRAVAILLE_POUR", "2018-01-01", "2021-01-01", "Développeuse Back-End");
    await createRelationship(session, "Martin", "Bob", "Amazon", "A_TRAVAILLE_POUR", "2016-06-01", "2019-08-31", "Data Scientist");
    await createRelationship(session, "Leroy", "Charlie", "Tesla", "A_TRAVAILLE_POUR", "2017-03-01", "2021-02-28", "Architecte Logiciel");

    console.log("Remplissage des connaissances ")
    await createAcquaintance(session, "Roux", "George", "Blanc", "Hélène", "2015-01-01");
    await createAcquaintance(session, "Martin", "Bob", "Petit", "Isabelle", "2017-05-15");
    await createAcquaintance(session, "Moreau", "Frank", "Durand", "Eva", "2020-09-10");

    console.log("Remplissage des relations de collègues ")
    await createCoworkers(session, "Roux", "George", "Blanc", "Hélène", "IKEA",  "2018-01-01", "2019-08-31");
    await createCoworkers(session, "Dupont", "Alice", "Petit", "Isabelle", "Google", "2018-05-01", "2020-06-30");
    await createCoworkers(session, "Leroy", "Charlie", "Durand", "Eva", "Tesla", "2019-04-01", "2021-03-31");
}

async function addCompany(session){
    console.log("Ajout d'une Entreprise:");
    const nom = await askQuestion("Entrez le nom de l'entreprise : ");
    const secteur = await askQuestion("Entrez son secteur d'activité : ");
    const description = await askQuestion("Entrez la description de " + nom + " : ");
    const taille = await askQuestion("Enfin, entrez sa taille : ");

    await createNode(session, "Entreprise", { nom: nom, secteur: secteur, description: description, taille: taille });

    console.log(nom + " à été ajoutée.");
}

async function addPerson(session){
    console.log("Ajout d'une Personne:");
    const nom = await askQuestion("Entrez le nom : ");
    const prenom = await askQuestion("Son prénom : ");
    const description = await askQuestion("Entrez une description de " + prenom + " "+ nom + " : ");
    let competences = await askQuestion("Enfin, entrez ses compétences (séparées par des virgules) : ");

    // Transformation de la chaîne de caractères en tableau
    competences = competences.split(',').map(comp => comp.trim());

    await createNode(session, "Personne", { nom: nom, prenom: prenom, description: description, "liste_des_compétences": competences });

    console.log("La personne ' " + prenom + " " + nom + " ' à été ajoutée.");
}

// Fonction utilitaire pour vérifier que la date de début est antérieure à la date de fin
function isDateOrderValid(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
}

async function addRelation(session, choice) {

    switch (choice){
        case "1":
            console.log("1. Entreprise / Personne");
            console.log("Ajout d'une relation Personne / Entreprise : ");

            // Récupération des informations de la personne et de l'entreprise
            const nom = await askQuestion("Quel est le nom de la Personne : ");
            const prenom = await askQuestion("Quel est le prénom de la Personne : ");
            const entreprisename = await askQuestion("Dans quelle Entreprise a travaillé " + prenom + " " + nom + " : ");

            // Saisie et vérification des dates
            let startDate;
            let endDate;

            while (true) {
                startDate = await askQuestion("Quand a commencé le travail (format AAAA-MM-JJ) : ");
                endDate = await askQuestion("Quand s'est terminé le travail (format AAAA-MM-JJ) : ");

                // Vérification de la cohérence des dates
                if (isDateOrderValid(startDate, endDate)) {
                    break; // Les dates sont valides, on sort de la boucle
                } else {
                    console.log("Erreur : La date de début doit être antérieure à la date de fin. Veuillez saisir à nouveau les dates.");
                }
            }

            // Saisie du rôle occupé dans l'entreprise
            const role = await askQuestion("Quel était le rôle de " + prenom + " dans cette entreprise : ");

            // Création de la relation dans Neo4j
            await createRelationship(session, nom, prenom, entreprisename, "A_TRAVAILLE_POUR", startDate, endDate, role);

            console.log(`Relation ajoutée : ${prenom} ${nom} a travaillé pour ${entreprisename} de ${startDate} à ${endDate} en tant que ${role}.`);

            break;

        case "2":
            console.log("2. Connaissances");
            console.log("Ajout d'une connaissance : ");

            // Récupération des informations des personnes
            const nom_1 = await askQuestion("Quel est le nom de la Personne 1: ");
            const prenom_1 = await askQuestion("Quel est le prénom de la Personne 1: ");
            const nom_2 = await askQuestion("Quel est le nom de la Personne 2: ");
            const prenom_2 = await askQuestion("Quel est le prénom de la Personne 2: ");
            
            // Récupération de la date de rencontre
            const dateRencontre = await askQuestion("Quand se sont-elles rencontrées (format AAAA-MM-JJ) : ");

            await createAcquaintance(session, nom_1, prenom_1, nom_2, prenom_2, dateRencontre);

            console.log(`Relation ajoutée : ${prenom_1} ${nom_1} connait ${prenom_2} ${nom_2} depuis ${dateRencontre}`);

            break;

        case "3":
            console.log("3. Collègues de travail");
            console.log("Ajout d'une relation de collègues : ");

            // Récupération des informations des personnes et de l'entreprise
            const nom_1_collègue = await askQuestion("Quel est le nom de la Personne 1: ");
            const prenom_1_collègue = await askQuestion("Quel est le prénom de la Personne 1: ");
            const nom_2_collègue = await askQuestion("Quel est le nom de la Personne 2: ");
            const prenom_2_collègue = await askQuestion("Quel est le prénom de la Personne 2: ");
            const entreprisename_collègue = await askQuestion("Dans quelle Entreprise ont-ils travaillé : ");

            // Saisie et vérification des dates
            let startDate_collègue;
            let endDate_collègue;

            while (true) {
                startDate_collègue = await askQuestion("Quand a commencé le travail (format AAAA-MM-JJ) : ");
                endDate_collègue = await askQuestion("Quand s'est terminé le travail (format AAAA-MM-JJ) : ");

                // Vérification de la cohérence des dates
                if (isDateOrderValid(startDate_collègue, endDate_collègue)) {
                    break; // Les dates sont valides, on sort de la boucle
                } else {
                    console.log("Erreur : La date de début doit être antérieure à la date de fin. Veuillez saisir à nouveau les dates.");
                }
            }

            //Ajoute une relation de collègue et ajoute si besoin une connaissance
            await createCoworkers(session, nom_1_collègue, prenom_1_collègue, nom_2_collègue, prenom_2_collègue, entreprisename_collègue, startDate_collègue, endDate_collègue);            
            
            console.log(`Relation ajoutée : ${prenom_1_collègue} ${nom_1_collègue} a travaillé avec ${prenom_2_collègue} ${nom_2_collègue} chez ${entreprisename_collègue} entre ${startDate_collègue} et ${endDate_collègue}`);

            break;

        default:
            console.log("Choix non reconnu");
    }

    }

// Fonction pour demander des suggestions sur un utilisateur particulier
async function retrieveSuggestions(session){
    console.log("Suggestions : ");

    // Récupération des informations de la personne et de l'entreprise
    const nom = await askQuestion("Quel est le nom de la Personne : ");
    const prenom = await askQuestion("Quel est le prénom de la Personne : ");
    
    // Quelles info récupérer
    console.log("Quelle information afficher ? ")
    console.log("1. Suggestions à partir de l'entreprise");
    console.log("2. Suggestions à partir du réseau");
    console.log("3. Suggestions globales");
    const choice = await askQuestion("Entrez le numéro de l'action souhaitée :");

    await suggest(session, choice, nom, prenom);
}


// Fonction pour mettre à jour l'âge d'un nœud `Person` basé sur son nom
async function updateNodeAge(session, name, newAge) {
    const result = await session.run(
        `MATCH (n:Person {name: $name}) SET n.age = $newAge RETURN n`,
        { name, newAge }
    );
    // console.log(`Nœud mis à jour :`, result.records[0].get('n').properties);
}

// Fonction pour ajouter une relation entre un utilisateur et une entreprise
async function createRelationship(session, personName, personFirstName, entrepriseName, relationType, startDate, endDate, role) {
    const query = `
        MATCH (p:Personne {nom: $personName, prenom: $personFirstName})
        MATCH (e:Entreprise {nom: $entrepriseName})
        CREATE (p)-[r:${relationType} {du: $startDate, au: $endDate, role: $role}]->(e)
        RETURN r
    `;
    await session.run(query, {
        personName,
        personFirstName,
        entrepriseName,
        relationType,
        startDate,
        endDate,
        role,
    });
}

// Fonction pour ajouter une relation de connaissance entre deux utilisateurs
async function createAcquaintance(session, personName1, personFirstName1, personName2, personFirstName2, meeting){
    const query = `
        MATCH (p:Personne {nom: $personName1, prenom: $personFirstName1})
        MATCH (q:Personne {nom: $personName2, prenom: $personFirstName2})
        CREATE (p)-[r:CONNAIT {depuis: $meeting}]->(q)
        CREATE (q)-[s:CONNAIT {depuis: $meeting}]->(p)
        RETURN r,s
    `;
    await session.run(query, {
        personName1,
        personFirstName1,
        personName2,
        personFirstName2,
        meeting,
    });
}

// Fonction pour ajouter une relation de collègues entre deux utilisateurs
async function createCoworkers(session, personName1, personFirstName1, personName2, personFirstName2, entrepriseName, startDate, endDate) {
    const query = `
        MATCH (p:Personne {nom: $personName1, prenom: $personFirstName1})
        MATCH (q:Personne {nom: $personName2, prenom: $personFirstName2})
        CREATE (p)-[r:COLLEGUE_AVEC {du: $startDate, au: $endDate, entreprise: $entrepriseName}]->(q)
        CREATE (q)-[s:COLLEGUE_AVEC {du: $startDate, au: $endDate, entreprise: $entrepriseName}]->(p)
        RETURN r,s
    `;
    await session.run(query, {
        personName1,
        personFirstName1,
        personName2,
        personFirstName2,
        startDate,
        endDate,
        entrepriseName,
    });
    
    //Vérifie s'il existe déjà une relation de connaissance. Si non, en crée une
    const check = await checkAcquaintance(session, personName1, personFirstName1, personName2, personFirstName2);
    if(!check){
        await createAcquaintance(session, personName1, personFirstName1, personName2, personFirstName2, startDate);
    }
}

// Fonction pour vérifier l'existence une relation de connaissance entre deux utilisateurs
async function checkAcquaintance(session,personName1, personFirstName1, personName2, personFirstName2){
    const query = `MATCH (p:Personne{nom: $personName1, prenom: $personFirstName1})-[r:CONNAIT]-(q:Personne{nom: $personName2, prenom: $personFirstName2})
        RETURN r`;
    const result = await session.run(query, {
        personName1,
        personFirstName1,
        personName2,
        personFirstName2,
    });

    if (result.records.length === 0){
        return false;
    }
    else{
        return true;
    }
}

// Fonction pour suggérer des connaissances à un utilisateur
async function suggest(session, choice, name, firstName){
    // async function retrieveCompany(){
    //     const query = `
    //     MATCH (p:Personne {nom: $personName, prenom: $personFirstName})-[:A_TRAVAILLE_POUR {e: $entrepriseName}]
    //     RETURN e
    // `;
    //     const result = await session.run(query, {
    //         personName,
    //         personFirstName,
    //         entrepriseName
    //     });

    //     return result.records
    // }

    async function findColleagues(entrepriseName="") {
        const query = `
            MATCH (p:Personne {nom: $name, prenom: $firstName})-[work1:A_TRAVAILLE_POUR]->(e:Entreprise)
            MATCH (colleague)-[work2:A_TRAVAILLE_POUR]->(e)
            WHERE colleague <> p
            AND (((date(work1.du) <= date(work2.du)) AND (date(work2.du) <= date(work1.au)))
                    OR ((date(work1.du) <= date(work2.au)) AND (date(work2.au) <= date(work1.au)))
                    OR ((date(work2.du) <= date(work1.du)) AND (date(work1.du) <= date(work2.au)))
                    OR ((date(work2.du) <= date(work1.au)) AND (date(work1.au) <= date(work2.au))))
            ${entrepriseName ? `AND e.nom = $entrepriseName` : ''}
            RETURN DISTINCT colleague
        `;
    
        const result = await session.run(query, {
            name,
            firstName,
            entrepriseName: entrepriseName || undefined
        });

        if(result.records.length > 0){
            console.log('Colleagues who worked at the same time in the same companies:', result.records.map(r => r.get('colleague').properties));
        }
        else{
            console.log("No one worked at the same time in these companies")
        }
    }

    async function findConnectionFromFriends(){
        const query = `
        MATCH (p:Personne {nom: $name, prenom: $firstName})-[conn1:CONNAIT]->(q:Personne)
        MATCH (q)-[conn2:CONNAIT]->(r:Personne)
        WHERE r <> p
        RETURN DISTINCT r
    `;
    
        const result = await session.run(query, {
            name,
            firstName
        });

        console.log('Connections of my connections:', result.records.map(r => r.get('r').properties));
    }
    switch (choice){
        case "1":
            console.log("Suggestions à partir de l'entreprise. ")
            console.log("Quelle entreprise afficher ? ")
            const entrepriseName = await askQuestion("Laisser vide pour afficher des collègues de toutes les entreprises cotoyées :");
            await findColleagues(entrepriseName);
            break;

        case "2":
            console.log("Suggestions à partir du réseau. ")
            await findConnectionFromFriends();
            break;
        
        case "3":
            console.log("Suggestions globales. ")
            await findColleagues("");
            await findConnectionFromFriends();
            break;
    }
    
}

// Fonction pour supprimer un nœud `Person` basé sur son nom
async function deleteNode(session, name) {
    const result = await session.run(
        `MATCH (n:Person {name: $name}) DELETE n RETURN n`,
        { name }
    );
    // console.log(`Nœud supprimé : ${name}`);
}

// Exécuter le script principal
main().catch(error => console.error("Erreur dans main() : ", error));