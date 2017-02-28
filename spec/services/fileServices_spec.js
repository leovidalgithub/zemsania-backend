var fileService = require('../../app/services/fileServices.js');
var gfs = {};
var fileGrid = {};

describe('Testing fileService', function () {
    describe('changeFileStatusArray', function () {
        it('Should changeFileStatusArray Success', function () {

            fileGrid.update = function (p1, p2, p3, callback) {
                callback(null, {});
            };

            global.fileGrid = fileGrid;

            fileService.changeFileStatusArray('012345678912', true, function () {

            });
        });
    });


    describe('removeFile', function () {
        it('Should removeFile Success', function () {

            gfs.tryParseObjectId = function () {
                console.log('*****************');
                return '012345678912';
            };
            gfs.remove = function (p1, callback) {
                callback(null, []);
            };

            global.gfs = gfs;

            fileService.removeFile('012345678912', function () {

            });
        });
    });


    describe('uploadFile', function () {
        it('Should uploadFile Success', function () {

            gfs.createWriteStream = function () {
                console.log('*****************');
                return '012345678912';
            };
            global.gfs = gfs;

            fileService.uploadFile({name: 'name', path: 'path', mimytype: 'type'}, 'type', true, function () {

            });
        });
    });

    describe('downloadFile', function () {
        it('Should downloadFile Success', function () {

            gfs.tryParseObjectId = function () {
                console.log('*****************');
                return '012345678912';
            };
            gfs.exist = function (p1, callback) {
                callback(null, []);
            };

            global.gfs = gfs;

            fileService.downloadFile('123456789012', function () {

            });
        });
    });
    describe('downloadFile', function () {
        it('Should downloadFile Success', function () {

            gfs.tryParseObjectId = function () {
                console.log('*****************');
                return '012345678912';
            };
            gfs.exist = function (p1, callback) {
                callback(true, []);
            };

            global.gfs = gfs;

            fileService.downloadFile('123456789012', function () {

            });
        });
    });
    describe('downloadFile', function () {
        it('Should downloadFile Success', function () {

            gfs.tryParseObjectId = function () {
                console.log('*****************');
                return '012345678912';
            };
            gfs.exist = function (p1, callback) {
                callback(null, null);
            };

            global.gfs = gfs;

            fileService.downloadFile('123456789012', function () {

            });
        });
    });
});
