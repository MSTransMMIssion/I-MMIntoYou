const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
app.use(express.json());


// Route pour vérifier que l'API fonctionne
app.get('/api', (req, res) => {
    res.send('API is working!');
});

// Route pour récupérer tous les utilisateurs
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json({ message: 'Success', data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer un utilisateur par ID
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Success', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour ajouter un nouvel utilisateur
app.post('/api/users', async (req, res) => {
    const { name, surname, email, password, date_of_birth } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, surname, email, password, date_of_birth },
        });
        res.json({ message: 'Utilisateur ajouté avec succès', data: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/update/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                sexual_orientation: data.sexual_orientation,
                bio: data.bio,
                location: data.location
            }
        });
        res.json({ message: 'Profil mis à jour avec succès', data: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
