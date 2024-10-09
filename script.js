// Importer le package neo4j-driver
const neo4j = require('neo4j-driver');

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

        // Création de nœuds
        await createNode(session, "Company", { name: "Alice", age: 30 });
        await createNode(session, "Person", { name: "Bob", age: 25 });

        // Affichage des nœuds
        await displayAllNodes(session, "Person");

        // Mise à jour d'un nœud
        await updateNodeAge(session, "Alice", 35);

        // Affichage des nœuds après la mise à jour
        await displayAllNodes(session, "Person");

        // Suppression d'un nœud
        await deleteNode(session, "Bob");

        // Affichage des nœuds après suppression
        await displayAllNodes(session, "Person");

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
    // console.log(`Nœud créé :`, result.records[0].get('n').properties);
}

// Fonction pour afficher tous les nœuds d'un type donné
async function displayAllNodes(session, label) {
    const result = await session.run(`MATCH (n:${label}) RETURN n`);
    // console.log(`Nœuds de type ${label} :`);
    result.records.forEach(record => {
        // console.log(record.get('n').properties);
    });
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