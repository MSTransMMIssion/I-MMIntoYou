const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

function generateBirthdate(minAge = 18, maxAge = 50) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return faker.date.between({ from: minDate, to: maxDate }).toISOString().split('T')[0];
}

async function main() {
    const adminPassword = await bcrypt.hash('securepassword', 10);

    // Création de l'utilisateur administrateur
    const admin = await prisma.user.create({
        data: {
            name: 'Admin',
            surname: 'User',
            email: 'admin@example.com',
            password: adminPassword,
            date_of_birth: '2000-01-01',
            gender: 'male',
            sexual_orientation: 'heterosexual',
            bio: '👨‍💻 Administrateur de la plateforme.',
            location: 'Grenoble',
            min_age_preference: 18,
            max_age_preference: 30,
        },
    });

    await prisma.profilePicture.create({
        data: {
            userId: admin.id,
            url: `/placeholder-avatar.png`,
            isPrimary: true,
        }
    });

    // Génération de 50 utilisateurs
    const users = [];
    for (let i = 0; i < 50; i++) {
        const password = await bcrypt.hash('chef', 10);
        const gender = faker.helpers.arrayElement(['male', 'female']);
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                surname: faker.person.lastName(),
                email: faker.internet.email(),
                password: password,
                date_of_birth: generateBirthdate(18, 30),
                gender: gender,
                sexual_orientation: faker.helpers.arrayElement(['heterosexual', 'bisexual', 'homosexual']),
                bio: faker.lorem.paragraph(),
                location: "Grenoble",
                min_age_preference: faker.number.int({ min: 18, max: 24 }),
                max_age_preference: faker.number.int({ min: 25, max: 35 }),
            },
        });

        const genderPath = gender === 'female' ? 'women' : 'men';
        for (let j = 0; j < 5; j++) {
            await prisma.profilePicture.create({
                data: {
                    userId: user.id,
                    url: `https://randomuser.me/api/portraits/${genderPath}/${i + j}.jpg`,
                    isPrimary: j === 0, // La première photo est définie comme principale
                },
            });
        }
        users.push(user);
    }

    // Génération de likes des utilisateurs vers l'admin
    for (const user of users) {
        await prisma.likes.create({
            data: {
                fromUserId: user.id,
                toUserId: admin.id,
                status: 1, // Like
            },
        });
    }

    // Génération de likes de l'admin vers certains utilisateurs
    const likedByAdmin = faker.helpers.arrayElements(users, 10); // L'admin like 10 utilisateurs
    for (const user of likedByAdmin) {
        await prisma.likes.create({
            data: {
                fromUserId: admin.id,
                toUserId: user.id,
                status: 1, // Like
            },
        });
    }

    // Génération de conversations entre l'admin et les utilisateurs ayant des likes mutuels
    for (const user of likedByAdmin) {
        const hasReverseLike = await prisma.likes.findFirst({
            where: {
                fromUserId: user.id,
                toUserId: admin.id,
                status: 1,
            },
        });

        if (hasReverseLike) {
            const conversationLength = faker.number.int({ min: 3, max: 10 });
            for (let i = 0; i < conversationLength; i++) {
                await prisma.messages.create({
                    data: {
                        fromUserId: faker.helpers.arrayElement([admin.id, user.id]),
                        toUserId: faker.helpers.arrayElement([admin.id, user.id]),
                        content: faker.lorem.sentence(),
                        is_read: faker.datatype.boolean(),
                    },
                });
            }
        }
    }

    console.log('Base de données peuplée avec succès avec interactions administrateur !');
}

main()
    .catch((e) => {
        console.error('Erreur :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
