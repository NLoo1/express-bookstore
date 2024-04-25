const request = require("supertest");
const jsonschema = require("jsonschema");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Books route test", function() {

    beforeEach(async function(){
        await db.query("DELETE FROM books")

        let book1 = await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test Author",
            "language": "test",
            "pages": 264,
            "publisher": "Test Publisher",
            "title": "Test-Up: Testing the Testing Tests in Testing Games",
            "year": 2017
          })
    })


    describe("Posting new books", function(){
        test("Can post book", async function(){
            let response = await request(app).post("/books/")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              })

              expect(response.body).toEqual({
                "book":{
                    "isbn": "0691161519",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
                
            })
        })

        
    })

    afterAll(async function() {
        await db.end();
      });
})
