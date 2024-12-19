const {PrismaClient} = require('@prisma/client');
const {faker} = require('@faker-js/faker');
const bcrypt = require("bcrypt");
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
        const password = await bcrypt.hash('chef', 10);

        // Générer le genre
        const gender = faker.helpers.arrayElement(['male', 'female']);

        // Création d'un utilisateur
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                surname: faker.person.lastName(),
                email: faker.internet.email(),
                password: password,
                date_of_birth: birthdate,
                gender: gender,
                sexual_orientation: faker.helpers.arrayElement(['heterosexual', 'bisexual', 'homosexual']),
                bio: faker.lorem.sentence(),
                location: "Grenoble",
                createdAt: new Date(),
                updatedAt: new Date(),
                min_age_preference: faker.number.int({ min: 18, max: 24 }),
                max_age_preference: faker.number.int({ min: 25, max: 35 })
            },
        });

        // Générer des photos de profil en fonction du genre
        const genderPath = gender === 'female' ? 'women' : 'men';
        for (let j = 0; j < 5; j++) {
            const profilePicture = await prisma.profilePicture.create({
                data: {
                    userId: user.id,
                    url: `https://randomuser.me/api/portraits/${genderPath}/${i + j}.jpg`,
                }
            });
        }

        console.log(`Utilisateur ${user.name} (${gender}) créé avec succès avec des préférences.`);
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
