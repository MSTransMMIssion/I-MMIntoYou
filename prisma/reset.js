const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function resetDatabase() {
    try {
        // Supprimer toutes les tables liées (ordre important pour éviter les violations de contraintes)
        await prisma.profilePicture.deleteMany(); // Supprimer les photos de profil
        await prisma.messages.deleteMany(); // Supprimer les messages
        await prisma.user.deleteMany(); // Supprimer les utilisateurs

        console.log('Base de données réinitialisée avec succès.');
    } catch (error) {
        console.error('Erreur lors de la réinitialisation de la base de données :', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase().then(r => r);
