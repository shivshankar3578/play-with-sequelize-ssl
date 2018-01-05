function testPush(callback) {
    var http = require('http');
    var data = {
        "collapseKey": "applice",
        "delayWhileIdle": true,
        "timeToLive": 3,
        "data": {
            "message": "hiiiiii",
            "PATH": { "hi":"shiv"},
            "title": "AllonBiz"
        },
        "registration_ids": ['cRJYzOoq0d8:APA91bGVLSNIgwPZxN5A8LFmpl0MYMkowzg4UldwVz3_yLwKAPRLtnPnQAiD9ceX0Ddac4yMGhFNTwavddXe0dUalM5vXRX8TrPPVbMmwKFgscIn06Vr-wCICUWvo1qgdBDc6ushvpuQ']
    };

    console.log('pushdataAndroid>>>>>>>>', data);
    var dataString = JSON.stringify(data);
    var headers = {
        'Authorization': 'key=AIzaSyAYOtTbxQ6UJD8-C5K-pFWSpVh0_sYqbGA',
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    };

//    var options = {host: 'android.googleapis.com',
    var options = {host: 'fcm.googleapis.com',
        port: 80,
//        path: '/gcm/send',
        path: '/fcm/send',
        method: 'POST',
        headers: headers
    };

    //Setup the request 
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            console.log('responseString msg--->', responseString);
            var resultObject = JSON.parse(responseString);
        });
    });
    req.on('error', function (e) {
        //TODO: handle error.
        //console.log('error : ' + e.message + e.code);
        //callback(false);
    });

    req.write(dataString);
    req.end();
}

testPush((err, res)=>{
    console.log(err, res);
})