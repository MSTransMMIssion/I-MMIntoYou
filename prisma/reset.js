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
        const hashedPassword = await bcrypt.hash('securepassword', 10);

        // Ajouter un utilisateur administrateur
        const admin = await prisma.user.create({
            data: {
                name: 'Admin',
                surname: 'User',
                email: 'admin@example.com',
                password: hashedPassword, // Utilisation du mot de passe haché
                date_of_birth: '2000-01-01',
                gender: 'male',
                sexual_orientation: 'heterosexual',
                bio: '👨‍💻 Admin - Administrateur d\'I\'MMIntoYou\n' +
                    '\n' +
                    '🧠 Cerveau derrière vos matchs ✨ | 💖 Cupidon en code JavaScript\n' +
                    '\n' +
                    'Salut à tous ! Moi, c’est Antoine, l’esprit (peut-être un peu trop passionné) qui veille sur les cœurs brisés et les âmes en quête d\'amour... virtuel, certes, mais toujours un peu magique ! 💫 Ici, entre deux lignes de code et trois tasses de café ☕, je vous concocte des algorithmes aux petits oignons 🧅 pour vous trouver le ou la parfait(e) "de l’autre côté de l’écran".\n' +
                    '\n' +
                    '💌 Pourquoi je fais ça ? Parce que j’aime l’idée que chaque bug peut être une rencontre inattendue et que chaque match est une victoire pour le serveur 💻 (et pour moi aussi, j’avoue). Et si jamais un message étrange vous apparaît 🐛 ou qu’une photo se charge bizarrement, c’est peut-être juste moi qui teste encore une nouvelle fonctionnalité.\n' +
                    '\n' +
                    'Alors... prêts à swiper en toute confiance ? 😉',
                location: 'Grenoble',
                createdAt: new Date(),
                updatedAt: new Date(),
                min_age_preference: 18,
                max_age_preference: 30,
            },
        });

        const profilePicture = await prisma.profilePicture.create({
            data: {
                userId: admin.id,
                url: `/placeholder-avatar.png`,
            }
        });



        console.log(`Administrateur ${admin.email} créé avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la réinitialisation de la base de données :', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
