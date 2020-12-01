const express = require('express');
const {v4: uuid} = require('uuid');
const logger = require('../logger');
const {bookmarks} = require('../store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();


// =======================================
//  GET / POST
// =======================================


bookmarkRouter
    .route('/')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, description, rating} = req.body;

        if(!title) {
            logger.error(`Title is required.`);
            return res.status(400).send('Invalid Data');
        }

        if(!url) {
            logger.error(`URL is required.`);
            return res.status(400).send('Invalid Data');
        }

        if(!description) {
            logger.error(`Description is required.`);
            return res.status(400).send('Invalid Data');
        }

        const id = uuid();

        const bookmark = {
            id, title, url, description, rating
        }

        bookmarks.push(bookmark);

        logger.info(`Bookmark with id ${id} has been created.`);
        res.status(201).location(`http://localhost:8000/${id}`).json(bookmark)
    })

// =======================================
//  GET / POST
// =======================================

bookmarkRouter
    .route('/:id')
    .get((req, res) => {
        const {id} = req.params;
        const bookmark = bookmarks.find(bmk => bmk.id == id);

        if(!bookmark){
            logger.error(`Bookmark with id ${id} does not exist.`);
            return res.status(404).send(`Bookmark Not Found`);
        }

        res.send(bookmark)
    })
    .delete((req, res) => {
        const {id} = req.params;

        const bookmarkIndex = bookmarks.findIndex(bmk => bmk.id == id);

        if(bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} does not exist.`);
            return res.status(404).send('Not Found')
        }

        bookmarks.forEach(bookmark => {
            const bmkIds = bookmark.bmkIds.filter(bid => bid !== id);
            bookmark.bmkIds = bmkIds
        });

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} has been successfully deleted.`);

        res.status(204).end()
    })


module.exports = bookmarkRouter