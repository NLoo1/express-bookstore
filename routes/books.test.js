const request = require("supertest");
const jsonschema = require("jsonschema");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
const ExpressError = require("../expressError");

describe("Books route test", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let book1 = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Test Author",
      language: "test",
      pages: 264,
      publisher: "Test Publisher",
      title: "Test-Up: Testing the Testing Tests in Testing Games",
      year: 2017,
    });
  });

  describe("Posting new books", function () {
    test("Can post book", async function () {
      let response = await request(app).post("/books/").send({
        isbn: "0691161519",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      });

      expect(response.statusCode).toEqual(201)
      expect(response.body).toEqual({
        book: {
          isbn: "0691161519",
          amazon_url: "http://a.co/eobPtX2",
          author: "Matthew Lane",
          language: "english",
          pages: 264,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          year: 2017,
        },
      });
    });

    test("Rejects incomplete JSON", async function () {
      let response = await request(app).post("/books/").send({
        isbn: "0691161519",
      });

      expect(response.statusCode).toBe(400);
    });

    test("Rejects incorrectly formatted JSON", async function () {
      let response = await request(app).post("/books/").send({
        isbn: 123,
        amazon_url: 123,
        author: 123,
        language: 123,
        pages: "AAAAAA",
        publisher: 123,
        title: 123,
        year: "AAAAAA",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /books", function () {
    test("Get all books", async function () {
      let response = await request(app).get("/books");

      expect(response.body).toEqual({
        books: [
          {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Test Author",
            language: "test",
            pages: 264,
            publisher: "Test Publisher",
            title: "Test-Up: Testing the Testing Tests in Testing Games",
            year: 2017,
          },
        ],
      });
    });
  });

  describe("GET /books by ISBN", function(){
    test("Get book by ISBN", async function(){
      let response = await request(app).get('/books/0691161518')

      expect(response.body).toEqual({
        book:{
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Test Author",
          language: "test",
          pages: 264,
          publisher: "Test Publisher",
          title: "Test-Up: Testing the Testing Tests in Testing Games",
          year: 2017
        }
        
      });
    })

    test("Fail to get book by non-existent ISBN", async function(){
      let response = await request(app).get('/books/123456')

      expect(response.statusCode).toBe(404)
    })
  })

  describe("PUT /books by ISBN", function(){
    test("Put book by ISBN", async function(){
      let response = await request(app)
    .put('/books/0691161518')
    .send({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Test Put",
        language: "put",
        pages: 264,
        publisher: "put publisher",
        title: "put title",
        year: 2017
    });


      expect(response.body).toEqual({
        book:{
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Test Put",
          language: "put",
          pages: 264,
          publisher: "put publisher",
          title: "put title",
          year: 2017
        }
        
      })
    })

    test("Fail to put book by non-existent ISBN", async function(){
      let response = (await request(app)
      .put('/books/123456')
      .send({
        author: "Test Put",
        language: "put",
        publisher: "put publisher",
        title: "put title"
      }))

      expect(response.statusCode).toBe(400)
    })

    test("Fail to put book from bad JSON", async function(){
      let response = (await request(app)
      .put('/books/0691161518')
      .send({
        author: "Test Put",
        language: "put",
        publisher: "put publisher",
        title: "put title"
      }))

      expect(response.statusCode).toBe(400)
    })
  })

  describe("DELETE /books by ISBN", function(){
    test("Delete book by ISBN", async function(){
      let response = await request(app).delete('/books/0691161518')

      expect(response.body).toEqual({ message: "Book deleted" })
    })

    test("Delete book with non-existent ISBN", async function(){
      let response = await request(app).delete('/books/123456')

      expect(response.statusCode).toBe(404)
    })
  })

  afterAll(async function () {
    await db.end();
  });
});
