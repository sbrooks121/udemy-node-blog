require('dotenv').config()
const expressEdge = require('express-edge')
const express = require('express')
const edge = require('edge.js')
const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')

const homePageController = require('./controllers/homePage')
const aboutPageController = require('./controllers/aboutPage')
const contactPageController = require('./controllers/contactPage')
const getPostController = require('./controllers/getPosts')
const createPostController = require('./controllers/createPosts')
const storePostController = require('./controllers/storePost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

const app = new express()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })

app.use(connectFlash())
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
})

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))

app.use(fileUpload())

app.use(express.static('public'))

app.use(expressEdge)
app.set('views', `${__dirname}/views`)
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storePostsMiddleware = require('./middleware/storePosts')
const authMiddleware = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

app.use('/posts/store', storePostsMiddleware)

app.get('/', homePageController)
app.get('/about', aboutPageController)
app.get('/contact', contactPageController)
app.get('/post/:id', getPostController)
app.get('/posts/new', authMiddleware, createPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/auth/logout', authMiddleware, logoutController)
app.get('/auth/login', redirectIfAuthenticated, loginController)
app.post('/users/login', redirectIfAuthenticated, loginUserController)
app.get('/auth/register', redirectIfAuthenticated, createUserController)
app.post('/users/register', redirectIfAuthenticated, storeUserController)
app.use((req, res) => res.render('404'))

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})