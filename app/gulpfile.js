var gulp    = require( 'gulp' );
var nodemon = require( 'gulp-nodemon' );
// var jasmine = require( 'gulp-jasmine' );

gulp.task( 'nodeserver', function () {
    nodemon({
        script: 'server-app.js'
    })
});

gulp.task( 'default', ['nodeserver'] );
