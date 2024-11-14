const {PrismaClient} = require('@prisma/client');
const {faker} = require('@faker-js/faker');
const prisma = new PrismaClient();

// Fonction pour générer une date de naissance réaliste
function generateBirthdate(minAge = 18, maxAge = 50) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate()); // Date pour l'âge max
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate()); // Date pour l'âge min
    const randomDate = faker.date.between({from: minDate, to: maxDate});
    return randomDate.toISOString().split('T')[0]; // Retourner la date au format AAAA-MM-DD
}

async function main() {
    // Générer 50 utilisateurs
    for (let i = 0; i < 50; i++) {
        const birthdate = generateBirthdate(18, 30);

        // Création d'un utilisateur
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                surname: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                date_of_birth: birthdate,
                gender: faker.helpers.arrayElement(['male', 'female']),
                sexual_orientation: faker.helpers.arrayElement(['heterosexual', 'bisexual', 'homosexual']),
                bio: faker.lorem.sentence(),
                location: "Grenoble",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        for (let j = 0; j < 5; j++) {
            const profilePicture = await prisma.profilePicture.create({
                data: {
                    userId: user.id,
                    url: `https://randomuser.me/api/portraits/men/${i+j}.jpg`,
                }
            });
        }
        // Création des préférences associées à l'utilisateur
        const preferences = await prisma.preferences.create({
            data: {
                userId: user.id, // Associer les préférences à l'utilisateur créé
                min_age: faker.number.int({min: 18, max: 25}),
                max_age: faker.number.int({min: 26, max: 40}),
                gender_preference: faker.helpers.arrayElement(['male', 'female', 'both']),
                distance: faker.number.int({min: 10, max: 100}), // Distance en kilomètres
                createdAt: new Date(),
            },
        });


        console.log(`Utilisateur ${user.name} créé avec succès avec des préférences.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
