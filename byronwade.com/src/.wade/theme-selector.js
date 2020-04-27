//const fs = require('fs');
//const path = require('path');
const { theme } = require('./wade.config')

const path = require( "path" );

//themes folder path
const fileName = theme.default+'.scss'
const absolutePath = './src/.wade/wades-content/wades-themes/'+theme.default+'/'+fileName;
const themeName = theme.default

const themeDetails = {
    fileName,
    absolutePath,
    themeName
}


if (theme.enable=true) {
    module.exports = {themeDetails}
} else {
    console.error('no theme has been selected')
}
