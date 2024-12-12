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

app.get('/api/user', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Success', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route pour récupérer tous les utilisateurs
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                date_of_birth: true,
                gender: true,
                sexual_orientation: true,
                bio: true,
                location: true,
                min_age_preference: true,
                max_age_preference: true,
            },
        });
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

app.post('/api/likes', async (req, res) => {
    const { fromUserId, toUserId, status } = req.body;

    try {
        const fromUserExists = await prisma.user.findUnique({ where: { id: fromUserId } });
        const toUserExists = await prisma.user.findUnique({ where: { id: toUserId } });

        if (!fromUserExists || !toUserExists) {
            return res.status(400).json({ error: 'One or both users not found' });
        }
        // Créez le "Like"
        const newLike = await prisma.likes.create({
            data: {
                fromUserId,
                toUserId,
                status,
            },
        });

        res.status(200).json(newLike);
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/likes/:fromUserId/:userLikedId', async (req, res) => {
    const { fromUserId, userLikedId } = req.params;
    console.log(`fromUserId: ${fromUserId}, userLikedId: ${userLikedId}`);
    try {
        const likes = await prisma.likes.findMany({
            where: {
                toUserId: parseInt(fromUserId),
                fromUserId: parseInt(userLikedId),
            },
        });
        console.log("Likes trouvés :", likes);
        res.status(200).json({ message: "Success", data: likes });
    } catch (error) {
        console.error("Erreur lors de la récupération des likes :", error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/likes/:fromUserId', async (req, res) => {
    const { fromUserId } = req.params;
    try {
        const likes = await prisma.likes.findMany({
            where: {
                fromUserId: parseInt(fromUserId),
            },
            select: {
                toUserId: true,
            },
        });
        res.status(200).json({ message: "Success", data: likes });
    } catch (error) {
        console.error("Erreur lors de la récupération des likes :", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});