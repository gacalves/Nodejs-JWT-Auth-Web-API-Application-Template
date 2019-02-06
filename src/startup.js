'use strict'

const express = require('express')
const helmet = require('helmet')
var logger = require('morgan')

const Router = require('./router')

//Comment the line below and uncomment the next line to activate the production environment.
process.env.NODE_ENV = 'development'
//process.env.NODE_ENV = 'production';

//loads app configuration to environment in NODE_ENV
require('./config/config')

const app = express()
const controllersPath = './src/controllers/**/*.js'

app.use(logger('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//register default routes on server
Router.registerDefaultRoutes(controllersPath, app)

//makes server up
app.listen(global.gConfig.node_port, () => {
	console.log('Server Started!')
})
