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
    const { name, email } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email },
        });
        res.json({ message: 'Utilisateur ajouté avec succès', data: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
