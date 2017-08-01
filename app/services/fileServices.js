var mongoose = require('mongoose'),
    fs = require('fs');

/**
 * Change file status ( temporal attribute )
 */
function changeFileStatusArray(fileIds, temporal, callback) {
    var time = new Date().getTime();
    fileGrid.update({_id: {$in: fileIds}}, {
        'metadata.temporal': temporal,
        'metadata.lastUpdate': time
    }, {multi: true}, function (err, raw) {
        if (err) callback({success: false}, null);
        callback(null, {success: true, items: raw});
    });
}

/**
 * Removes a file
 */
function removeFile(fileId, onSuccess, onError) {
    var id = gfs.tryParseObjectId(fileId);
    var options = {_id: id, root: 'docs'};
    gfs.remove(options, function (err) {
        if (err) return handleError(err);
        onSuccess({success: true});
    });
}


function uploadFile(file, fileType, temporal, onSuccess, onError) {
    var dirname = require('path').dirname(__dirname);
    var filename = file.name;
    var path = file.path;
    var type = file.mimetype;

    var read_stream = fs.createReadStream(dirname + '/' + path);

    var docId = mongoose.Types.ObjectId();
    var writestream = gfs.createWriteStream({
        _id: docId,
        filename: file.originalname,
        content_type: file.mimetype,
        metadata: {
            temporal: temporal,
            lastUpdate: new Date().getTime(),
            type: fileType
        },
        mode: 'w',
        root: 'docs'
    });
    read_stream.pipe(writestream);
    fs.unlink(path);
    onSuccess({id: docId});
}


function downloadFile(id, res) {
    var id = gfs.tryParseObjectId(id);
    var options = {_id: id, root: 'docs'};
    gfs.exist(options, function (err, exist) {
        if (err) return handleError(err);
        if (!exist) return res.sendStatus(404);
        try {

            var readStream = gfs.createReadStream(options).pipe(res);
        } catch (err) {
            return res.sendStatus(500, err);
        }
    });

}

module.exports = {
    uploadFile: uploadFile,
    downloadFile: downloadFile,
    changeFileStatusArray: changeFileStatusArray,
    removeFile: removeFile
};


