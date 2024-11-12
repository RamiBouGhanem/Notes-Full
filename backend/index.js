require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: true, message: "User not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: true, message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Home Route
app.get("/", (req, res) => res.json({ data: "hello" }));

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ error: true, message: "All fields are required" });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: true, message: "User already exists" });

  const user = await prisma.user.create({ data: { fullName, email, password } });
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "36000m" });

  res.json({ error: false, message: "User registered successfully", accessToken, user });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: true, message: "Email and password are required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) return res.status(400).json({ error: true, message: "Invalid credentials" });

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "36000m" });
  res.json({ error: false, message: "User logged in successfully", accessToken });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.sendStatus(401);

  res.json({ error: false, message: "", user });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: true, message: "Title and content are required" });

  const note = await prisma.note.create({
    data: { title, content, tags, userId: req.user.userId },
  });

  res.json({ error: false, message: "Note added successfully", note });
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const { title, content, tags, isPinned } = req.body;

  const note = await prisma.note.updateMany({
    where: { id: noteId, userId: req.user.userId },
    data: { title, content, tags, isPinned },
  });

  if (!note.count) return res.status(404).json({ error: true, message: "Note not found" });
  res.json({ error: false, message: "Note updated successfully", note });
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.user.userId },
    orderBy: { isPinned: "desc" },
  });
  res.json({ error: false, message: "Notes fetched successfully", notes });
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const note = await prisma.note.deleteMany({
    where: { id: noteId, userId: req.user.userId },
  });

  if (!note.count) return res.status(404).json({ error: true, message: "Note not found" });
  res.json({ error: false, message: "Note deleted successfully" });
});

// Update Note Pinned Status
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const { isPinned } = req.body;

  const note = await prisma.note.update({
    where: { id: noteId, userId: req.user.userId },
    data: { isPinned },
  });

  if (!note) return res.status(404).json({ error: true, message: "Note not found" });
  res.json({ error: false, message: "Pinned status updated successfully", note });
});


//search note
// Add search notes endpoint
// Search API route
app.get('/search-notes', authenticateToken, async (req, res) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.status(400).json({ error: true, message: 'Please provide a search term.' });
    }

    try {
        const notes = await prisma.note.findMany({
            where: {
                userId: req.user.userId,
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { content: { contains: searchTerm, mode: 'insensitive' } }
                ]
            }
        });

        if (notes.length === 0) {
            return res.json({ error: false, message: 'No notes found matching the search term.', notes: [] });
        }

        res.json({ error: false, message: 'Notes found successfully.', notes });
    } catch (error) {
        console.error('Error searching notes:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});



app.listen(8000, () => console.log("Server is running on port 8000"));
module.exports = app;
