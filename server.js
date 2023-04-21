const express = require("express")
const app = express()

const logger = require("./logger")

const lodgings = require("./lodgings.json")

app.use(express.json())
app.use(logger)

app.use("*", function (req, res, next) {
    res.status(404).send 
})

app.get("/lodgings", function (req, res, next) {
    console.log("  -- req.query:", req.query)
    let page = parseInt(req.query.page) || 1
    const pageSize = 10
    const lastPage = Math.ceil(lodgings.length / pageSize)
    page = (page < 1) ? 1 : page
    page = (page > lastPage) ? lastPage : page

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const lodgingsPage = lodgings.slice(start, end)

    const links = {}
    if (page < lastPage) {
        links.nextPage = `/lodgings?page=${page + 1}`
        links.lastPage = `/lodgings?page=${lastPage}`
    }
    if (page > 1) {
        links.prevPage = `/lodgings?page=${page - 1}`
        links.firstPage = `/lodgings?page=1`
    }

    res.status(200).send({
        lodgings: lodgingsPage,
        page: page,
        pageSize: pageSize,
        lastPage: lastPage,
        total: lodgings.length,
        links: links
    })
})

app.post("/lodgings", function (req, res, next) {
    console.log("  -- req.body:", req.body)
    if (req.body && req.body.name && req.body.price) {
        // Store data from req.body
        res.status(201).send({
            id: lodgings.length
        })
    } else {
        res.status(400).send({
            err: "Request needs a JSON body with `name` and `price`"
        })
    }
})

app.get("/lodgings/:id", function (req, res, next) {
    console.log("  -- req.params:", req.params)
    const id = req.params.id
    if (lodgings[id]) {
        res.status(200).send(lodgings[id])
    } else {
        next()
    }
})

app.use("*", function (req, res, next) {
    res.status(404).send({
        err: `Requested URL doesn't exist: ${req.originalUrl}`
    })
})

// app.post()
// app.patch()
// app.delete()

app.listen(8000, function () {
    console.log("== Server is listening on port 8000")
})
