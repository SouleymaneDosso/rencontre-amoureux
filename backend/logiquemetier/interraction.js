const Interraction = require("../models/interraction")
const streamifier = require("streamifier")
const cloudinary = require("../cloudinary");

exports.uploadCloudinary = async (req, res) =>{
try{
    if(!req.files || req.files.length === 0){
return res.status(400).json({message:  "aucune video envoyée" })
    }
const userId = req.auth.userId;
if (!userId) {
  return res.status(401).json({ message: "Non autorisé" });
}


       const uploadpromises = req.files.map(file =>{
      return new Promise((resolve, reject)=>{
        if (!file.mimetype.startsWith("video/")) {
  return reject(new Error("fichier non valide"));
}
        const stream = cloudinary.uploader.upload_stream({
            folder: "rencontre amoureuse",
            resource_type : "video",
            chunk_size: 6000000,
             max_bytes: 10000000,
        },
        (error, result)=> {
            if(error) return reject(error);
            else resolve({result, file});
        }
    );
     streamifier.createReadStream(file.buffer).pipe(stream);
    })
     })

     const results = await Promise.all(uploadpromises);

  const video = results.map(({result, file})=>({
    url: result.secure_url,
    public_id: result.public_id,
    nomoriginal: file.originalname,
    nomfichier: result.original_filename,
    taille: result.bytes,
    format: result.format || "",
    duree: result.duration||0,
  }))
  const existing = await Interraction.findOne({ userId });

if (existing) {
  existing.video.push(...video);
  await existing.save();
  return res.json(existing);
}
  const newvideo = new Interraction({userId, video});
   await newvideo.save();
   res.status(200).json(newvideo);
}
catch(error){
    res.status(500).json({message: error.message})
}
}


exports.getvideo = async (req, res) => {
  try {
    const data = await Interraction.findOne({
      userId: req.auth.userId,
    });

    if (!data) return res.json([]);

    res.status(200).json(data.video);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recuperation des videos " + error.message,
    });
  }
};


 