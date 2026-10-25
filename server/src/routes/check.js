const router = require('express').Router();
const CheckHistory = require('../models/CheckHistory');
const jwt = require('jsonwebtoken');

// Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access Denied' });
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// URL Checker Route
router.post('/url', verifyToken, async (req, res) => {
  const { url } = req.body;
  const isSuspicious = url.includes('free') || url.includes('win') || url.includes('verify') || !url.startsWith('https');
  const resultStatus = isSuspicious ? 'Suspicious / Phishing' : 'Safe';

  await CheckHistory.create({
    userId: req.user.id,
    checkType: 'url',
    inputContent: url,
    resultStatus
  });

  res.json({ resultStatus });
});

// Message Checker Route
router.post('/message', verifyToken, async (req, res) => {
  const { message } = req.body;
  const scamKeywords = ['lottery', 'bank', 'prize', 'urgent', 'click here', 'won'];
  const lowerMsg = message.toLowerCase();
  const isScam = scamKeywords.some(keyword => lowerMsg.includes(keyword));
  const resultStatus = isScam ? 'Potential Scam Message' : 'Looks Safe';

  await CheckHistory.create({
    userId: req.user.id,
    checkType: 'message',
    inputContent: message,
    resultStatus
  });

  res.json({ resultStatus });
});

// Get History Route
router.get('/history', verifyToken, async (req, res) => {
  const history = await CheckHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;