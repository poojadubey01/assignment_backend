const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model for books
const bookSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String
});

const Book = mongoose.model('Book', bookSchema);

// Middleware
app.use(bodyParser.json());

// Sample data
const sampleBooks = [
  {
    name: "Harry Potter and the Order of the Phoenix",
    img: "https://bit.ly/2IczSwE",
    summary: "Harry Potter and Dumbledore’s warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore’s authority at Hogwarts and discredit Harry."
  },
  {
    name: "The Lord of the Rings: The Fellowship of the Ring",
    img: "https://bit.ly/2tC1Lcg",
    summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
  },
  {
    name: "Avengers: Endgame",
    img: "https://bit.ly/2Pzc3EP",
    summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe."
  }
];

// Insert sample data into MongoDB
Book.insertMany(sampleBooks, (err) => {
  if (err) console.log('Sample data already exists');
});

// Routes
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.json({ message: "Book deleted" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
