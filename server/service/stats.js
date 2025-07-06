import express from 'express';
import PostMessage from '../models/postMessage.js';
import Stats from '../models/statsModel.js'; // Nouveau modèle


const router = express.Router();

// Mise à jour + lecture combinées
router.get('/', async (req, res) => {
  try {
    // 1. Calcul en temps réel
    const [totalPosts, aggLikes] = await Promise.all([
      PostMessage.countDocuments(),
      PostMessage.aggregate([
        { $project: { likesCount: { $size: "$likes" } } },
        { $group: { 
          _id: null, 
          total: { $sum: "$likesCount" },
          avg: { $avg: "$likesCount" }
        }}
      ])
    ]);

    // 2. Sauvegarde en base
    const statsData = {
      totalPosts,
      totalLikes: aggLikes[0]?.total || 0,
      avgLikes: aggLikes[0]?.avg || 0
    };
    
    await Stats.findOneAndUpdate(
      {},
      statsData,
      { upsert: true, new: true }
    );

    // 3. Renvoie les données fraîches
    res.json(statsData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Stats.find().sort({ updatedAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
