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

// Fonction pour mettre à jour l'âge d'un nœud `Person` basé sur son nom
async function updateNodeAge(session, name, newAge) {
    const result = await session.run(
        `MATCH (n:Person {name: $name}) SET n.age = $newAge RETURN n`,
        { name, newAge }
    );
    // console.log(`Nœud mis à jour :`, result.records[0].get('n').properties);
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