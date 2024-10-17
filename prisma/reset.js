const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function resetDatabase() {
    try {
        // Supprimer toutes les tables liées (ordre important pour éviter les violations de contraintes)
        await prisma.preferences.deleteMany(); // Supprimer les préférences
        await prisma.user.deleteMany(); // Supprimer les utilisateurs

        console.log('Base de données réinitialisée avec succès.');
        const hashedPassword = await bcrypt.hash('securepassword', 10);

        // Ajouter un utilisateur administrateur
        const admin = await prisma.user.create({
            data: {
                name: 'Admin',
                surname: 'User',
                email: 'admin@example.com',
                password: hashedPassword, // Utilisation du mot de passe haché
                date_of_birth: '1980-01-01',
                gender: 'male',
                sexual_orientation: 'heterosexual',
                profile_picture: '',
                bio: 'Administrateur du site',
                location: 'Grenoble',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(`Administrateur ${admin.email} créé avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la réinitialisation de la base de données :', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
