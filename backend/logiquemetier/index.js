const Profil = require("../models/profil");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");
const Connexion = require("../models/connexion");
const profil = require("../models/profil");

exports.createInfos = async (req, res) => {
  try {
    
    const { nom, prenom, ville, age, pays, genre, recherche, pseudo } = req.body;

    if (!nom || !prenom || !ville || !age || !pays || !genre || !recherche || !pseudo) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }
    const userId = req.auth.userId;

    const user = await Connexion.findById(userId)
    if(!user){
      return res.status(404).json({message: "utilisateur introuvable"})

    }
    const existe = await Profil.findOne({userId})
    if(existe){
      return res.status(400).json({message: "Profil déjà créé"})
    }

    const profil = new Profil({
      nom,
      pseudo,
      prenom,
      age,
      ville,
      pays,
      genre,
      recherche,
      photos: [],
      userId,
    });

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: `site-de-rencontre/${profil._id}` },
              (error, result) => {
                if (error) reject(error);
                else resolve({
                  url: result.secure_url,
                  public_id: result.public_id
                });
              },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          }),
      );

      const urls = await Promise.all(uploadPromises);
      profil.photos = urls;
    }
    await profil.save();

     user.profilCree = true;
     await user.save();
   

    res.status(201).json(profil);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la sauvegarde" });
  }
};

exports.monProfil = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const profil = await Profil.findOne({ userId: req.auth.userId }).populate("userId");

    if (!profil) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.status(200).json(profil);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};

exports.deletePhotos = async (req, res) => {
  const { id, public_id } = req.params;

  try {
    const profil = await Profil.findById(id);
    if (!profil) {
      return res.status(404).json({ message: "Profil introuvable" });
    }

    // Supprimer de Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Filtrer photos (sécurisé)
    if (profil.photos) {
      profil.photos = profil.photos.filter(
        (photo) => photo.public_id !== public_id
      );
    }

    // Si avatar correspond → reset
    if (profil.avatar && profil.avatar.public_id === public_id) {
      profil.avatar = null;
    }

    await profil.save();

    res.status(200).json({
      message: "Photo supprimée",
      profil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getInfos = async (req, res) => {
  try {
    const monprofil = await Profil.findOne({userId: req.auth.userId});
    if(!monprofil){
      return res.status(404).json({message: "Profil introuvable"})
    }
    const profils = await Profil.find({
      _id: {$ne: monprofil._id}
    });

    res.status(200).json(profils);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

exports.getPublicProfil = async (req, res) => {
  
  try {
    const {id} = req.params;
    const profil = await Profil.findById(id);

    if (!profil) {
      return res.status(404).json({
        message: "Profil non trouvé", 
      });
    }
      if (!profil.profilPublic) {
      return res.status(403).json({ message: "Ce profil est privé" });
    }

      const publicData = {
      _id: profil._id,
      pseudo: profil.pseudo,
      age: profil.age,
      pays: profil.pays,
      ville: profil.ville,
      bio: profil.bio,
      avatar: profil.avatar,
      photos: profil.photos,
      genre: profil.genre,
      recherche: profil.recherche,
      centresInteret: profil.centresInteret,
      enLigne: profil.enLigne,
      verifie: profil.verifie,
      createdAt: profil.createdAt,
    };

    res.status(200).json(publicData);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération du profil",
    });
  }
};

exports.setAvatar = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.body;
 
  try {
    const profil = await Profil.findById(id);
    if (!profil) return res.status(404).json({ message: "Profil introuvable" });

    if (public_id) {
      const photoExist = profil.photos.find(p => p.public_id === public_id);
      if (!photoExist) return res.status(404).json({ message: "Photo introuvable" });
      profil.avatar = { ...photoExist };
    }
    else if (req.file) { 
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `site-de-rencontre/${profil._id}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream); // ✅ ici
      });

      const newPhoto = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      profil.photos.push(newPhoto);
      profil.avatar = { ...newPhoto };
    } else {
      return res.status(400).json({ message: "Aucune photo fournie" });
    }

    await profil.save();
    res.status(200).json(profil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'avatar" });
  }
};



exports.deleteInfos = async (req, res) => {
  try {
    const supprimer = await Profil.findByIdAndDelete(req.params.id);
    if(supprimer.photos){
      for(const photo of supprimer.photos){
        await cloudinary.uploader.destroy(photo.public_id);
      }
      if(supprimer.avatar){
        await cloudinary.uploader.destroy(supprimer.avatar.public_id);
      }
    }
    if (!supprimer) {
      return res.status(404).json({ message: "Profil introuvable" });
    }

    res.status(200).json({ message: "Profil supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};

exports.updateInfos = async (req, res) => {
  try {
      const profil = await Profil.findById(req.params.id);

if (!profil) return res.status(404).json({ message: "Profil introuvable" });
    const updateData = { ...req.body };

   
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: `site-de-rencontre/${profil._id}` },
              (error, result) => {
                if (error) reject(error);
                else resolve({
                  url: result.secure_url,
                  public_id: result.public_id
                });
              },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          }),
      );

      const urls = await Promise.all(uploadPromises);

      updateData.photos = [...(profil.photos || []), ...urls];
    }

    const modifier = await Profil.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!modifier) {
      return res.status(404).json({ message: "Profil introuvable" });
    }

    res.status(200).json(modifier);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur lors de la modification" });
  }
};

exports.likeProfil = async (req, res) => {
  try {
    const profilId = req.params.profilId;
    const userId = req.auth.userId; // ID du compte connecté

    // Trouver MON profil à partir de mon compte
    const monProfil = await Profil.findOne({ userId });
    const profilCible = await Profil.findById(profilId);

    if (!monProfil || !profilCible) {
      return res.status(404).json({
        message: "Profil introuvable",
      });
    }

    // Interdiction de se liker soi-même
    if (monProfil._id.toString() === profilCible._id.toString()) {
      return res.status(400).json({
        message: "Tu ne peux pas te liker toi-même",
      });
    }

    // Vérifier si déjà liké
    const dejaLike = monProfil.likes.some(
      (id) => id.toString() === profilId
    );

    if (dejaLike) {
      return res.status(400).json({
        message: "Tu as déjà liké ce profil",
      });
    }

    // Ajouter le like
    monProfil.likes.push(profilId);

    // Vérifier si l'autre personne m'a déjà liké
    const likeReciproque = profilCible.likes.some(
      (id) => id.toString() === monProfil._id.toString()
    );

    let isMatch = false;

    if (likeReciproque) {
      // éviter doublons
      if (!monProfil.matchs.some(id => id.toString() === profilId)) {
        monProfil.matchs.push(profilId);
      }

      if (!profilCible.matchs.some(id => id.toString() === monProfil._id.toString())) {
        profilCible.matchs.push(monProfil._id);
      }

      isMatch = true;
      await profilCible.save();
    }

    await monProfil.save();

    res.status(200).json({
      message: isMatch ? "🔥 Match !" : "Like enregistré",
      match: isMatch,
    });
  } catch (error) {
    console.error("Erreur likeProfil :", error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

exports.dislikeProfil = async (req, res) => {
  try {
    const profilId = req.params.profilId;
    const userId = req.auth.userId;

    // Trouver mon profil via mon compte
    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Profil introuvable" });
    }

    if (monProfil._id.toString() === profilId) {
      return res.status(400).json({
        message: "Tu ne peux pas te disliker toi-même",
      });
    }

    const dejaDislike = monProfil.dislikes.some(
      (id) => id.toString() === profilId
    );

    if (dejaDislike) {
      return res.status(400).json({ message: "Déjà disliké" });
    }

    monProfil.dislikes.push(profilId);
    await monProfil.save();

    res.status(200).json({ message: "Dislike enregistré" });
  } catch (error) {
    console.error("Erreur dislikeProfil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.suggestions = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await Profil.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const exclus = [
      user._id,
      ...user.likes,
      ...user.dislikes,
      ...user.matchs,
    ];

    const profils = await Profil.find({
      _id: { $nin: exclus },
      genre:
        user.recherche === "tous"
          ? { $in: ["homme", "femme", "autre"] }
          : user.recherche,
    });

    res.status(200).json(profils);
  } catch (error) {
    console.error("Erreur suggestions :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.mesMatchs = async (req, res) => {
  try{
    const userId = req.auth.userId;
    const profilmatch = await Profil.findOne({userId}).populate("matchs")

    if(!profilmatch){
      return res.status(404).json({message: "profil introuvable"})
    }
    res.status(200).json( profilmatch.matchs)
  }
  catch(error){
    console.error("erreur lors de la recuperation des matchs :", error)
    res.status(500).json({message: "Erreur server"})
  }
}

exports.verifierMatch = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { profilId } = req.params;

    // retrouver mon profil
    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Mon profil est introuvable" });
    }

    // vérifier si le profil cible existe
    const profilCible = await Profil.findById(profilId);

    if (!profilCible) {
      return res.status(404).json({ message: "Profil cible introuvable" });
    }

    // vérifier si le profil cible est dans mes matchs
    const estMatch = monProfil.matchs.some(
      (matchId) => matchId.toString() === profilId
    );

    res.status(200).json({ match: estMatch });
  } catch (error) {
    console.error("Erreur verifierMatch :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};