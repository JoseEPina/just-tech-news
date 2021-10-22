const router = require('express').Router();
const { User, Post } = require('../../models');

// GET all users
router.get('/', (req, res) => {
   console.log('======================');
   Post.findAll({
      // Query configuration
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [{ model: User, attributes: ['username'] }],
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET by user ID
router.get('/:id', (req, res) => {
   Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'post_url', 'title', 'created_at'],
      include: [{ model: User, attributes: ['username'] }],
   })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// CREATE a POST
router.post('/', (req, res) => {
   // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
   Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id,
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// PUT - to update the Post's title
router.put('/:id', (req, res) => {
   Post.update({ title: req.body.title }, { where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(err).json(err);
      });
});

// DELETE - destroy a post
router.delete('/:id', (req, res) => {
   Post.destroy({ where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;