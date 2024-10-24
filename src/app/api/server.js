const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
app.use(express.json());

// Middleware pour parser le JSON
app.use(express.json());

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.id; // On récupère l'id de l'utilisateur
        const uploadPath = `./public/uploads/${userId}`; // Dossier de stockage des photos de profil par utilisateur

        // Vérifier si le répertoire existe, sinon le créer
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Enregistrer dans ce dossier
    },
    filename: (req, file, cb) => {
        // Utiliser le nom du fichier d'origine
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Route pour uploader des photos de profil
app.post('/api/users/:id/uploadProfilePicture', upload.array('profilePictures', 10), async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const uploadedFiles = req.files;

        // Enregistrer les URL des photos dans la base de données
        const createdPictures = await Promise.all(
            uploadedFiles.map(file =>
                prisma.profilePicture.create({
                    data: {
                        url: `/uploads/${userId}/${file.originalname}`,
                        userId: userId,
                    }
                })
            )
        );

        res.json({ message: 'Photos uploadées avec succès', data: createdPictures });
    } catch (error) {
        console.error('Erreur lors de l\'upload des photos:', error);
        res.status(500).json({ error: 'Erreur lors de l\'upload des photos' });
    }
});

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

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

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
        if (error.code === "P2002") {  // Erreur Prisma pour doublon d'email
            res.status(400).json({ error: "Cet email est déjà utilisé." });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Route pour mettre à jour un utilisateur par ID
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
        if (error.code === "P2025") {  // Erreur Prisma pour utilisateur non trouvé
            res.status(404).json({ error: "Utilisateur non trouvé" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Route pour récupérer les photos de profil d'un utilisateur
app.get('/api/users/:id/profilePictures', async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const pictures = await prisma.profilePicture.findMany({
            where: { userId: userId },
        });

        res.json({ message: 'Photos récupérées avec succès', data: pictures });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour mettre à jour les photos de profil d'un utilisateur
app.put('/api/users/updateProfilePictures/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { profilePictures } = req.body;

    try {
        // On vérifie d'abord si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // On supprime toutes les anciennes photos de profil pour cet utilisateur
        await prisma.profilePicture.deleteMany({
            where: { userId: userId },
        });

        // On ajoute les nouvelles photos
        const createdPictures = await Promise.all(
            profilePictures.map(url =>
                prisma.profilePicture.create({
                    data: { url: url, userId: userId },
                })
            )
        );

        res.json({ message: 'Photos de profil mises à jour avec succès', data: createdPictures });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des photos de profil:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour des photos de profil' });
    }
});

// Route pour supprimer une photo de profil spécifique
app.delete('/api/users/:userId/profilePictures/:pictureId', async (req, res) => {
    const { userId, pictureId } = req.params;

    try {
        // On vérifie si la photo existe et si elle appartient à l'utilisateur
        const picture = await prisma.profilePicture.findUnique({
            where: { id: parseInt(pictureId) },
        });

        if (!picture || picture.userId !== parseInt(userId)) {
            return res.status(404).json({ error: "Photo non trouvée ou vous n'êtes pas autorisé à la supprimer." });
        }

        await prisma.profilePicture.delete({
            where: { id: parseInt(pictureId) },
        });

        res.json({ message: 'Photo supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la photo de profil' });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
