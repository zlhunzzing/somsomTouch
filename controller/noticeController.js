/**************************** Notice Controller ****************************/

var express = require('express'), 
    express = require('express'), 
    redis = require('redis');

var store = redis.createClient({host:'localhost', port: 6379});
var app = express();


/*********************************************************************** 
 *                             Notice Create					   
*************************************************************************/

var id = 0;
store.keys('notice:*', function(err, key) {
    if (err) { throw err; }
    id = key.length;
});

exports.create = function(req, res) {
    console.log('/notice/create 호출됨.');

    var notice = {
        id: ++id,
        title: req.body.title,
        content: req.body.content,
        category: req.body.notice_cate,
        date:new Date().toISOString().substring(0, 10)
    };

    // console.log('title : ' + title + ', content : ' + content + ', date : ' + date + ', category : ' + category);
    store.hmset('notice:'+ notice.id, 'title', notice.title, 'content', notice.content, 'category', notice.category, 'date', notice.date);

    res.redirect('/notice');
};

/*********************************************************************** 
 *                             Notice Read					   
*************************************************************************/

exports.read = function(req, res){
    console.log('/notice/read 처리함');

    var notices = [];
    var x;
    var i = 0;

    var _promise = function (param) {
        return new Promise(function (resolve, reject) {

            store.keys('notice:*', function(err, results){
                if (err) { reject(err); }
                x = results.length;

                if (x == 0) { resolve('none'); } // 아무것도없을때
                else { 
                    results.forEach(function(key){
                        store.hgetall(key, function(err, result) {
                            if (err) { reject(err); }

                            var notice = {
                                id: key,
                                title: result.title,
                                content: result.content,
                                category: result.category,
                                date: result.date                            
                            };
                            notices.push(notice);
                            ++i;
                            if (i == x) { resolve(notices); }
                        });
                    });
                }
            });
        });

    }; //promise 끝

    _promise(true)
    .then(function (text) {
        if (!req.user){
            res.render('notice', {notices:text});
        }
        else{
            res.render('notice', {notices:text, user:req.user.username});
        }
    }, function (error) {
        console.log(error);
    });
}


////////////////////////////////////////////////////////////////
// var notices = [];
// function async1 (results) {
//     return new Promise(function(resolve, reject) {
//     	var i = 1;
// 	    results.forEach(function(){
//             store.hgetall('notice:'+i , function(err, result) {
//                 var notice = {
//                     id: (i++),
//                     title: result.title,
//                     content: result.content,
//                     category: result.category,
//                     date: result.date
//                 };
                
//                 console.log('id: ' + notice.id + ', title : ' + notice.title + ', content : ' + notice.content + ', date : ' + notice.date + ', category : ' + notice.category);
//                 notices.push(notice);
//                 // if(result.length == 0) resolve(notices);
//                 if(i == results.length) resolve(notices); 
//             });
//         });
//     });
// }

// exports.read = function(req, res){
// 	store.keys('notice:*', function(err, results){
//         async1(results)
// 			.then(notices => {
//                 console.log('final');
// 				res.render('notice', {notices: notices});
// 			})
// 	});
// }

/* 이거 지우지 말자여..... 콜백 지옥입니다요 
exports.read = function(req, res){
    console.log('/notice 처리함');

    var notices = [];
    store.keys('notice:*', function(err, results){
        var i = 1;
        console.log('size: ' + results.length);
        results.forEach(function(){
            
            store.hgetall('notice:'+i , function(err, result) {
            
                var notice = {
                    id: i,
                    title: result.title,
                    content: result.content,
                    category: result.category,
                    date: result.date
                };
                console.log('id: ' + notice.id + ', title : ' + notice.title + ', content : ' + notice.content + ', date : ' + notice.date + ', category : ' + notice.category);
                notices.push(notice);
                // res.render('notice', {notices:notices});
            });
        });
    });
}
*/
/*********************************************************************** 
 *                             Notice Create					   
*************************************************************************/

var id = 0;
exports.create = function(req, res) {
    console.log('/notice/create 호출됨.');

    var notice = {
        id: ++id,
        title: req.body.title,
        content: req.body.content,
        category: req.body.notice_cate,
        date:new Date().toISOString().substring(0, 10)
    };

    // console.log('title : ' + notice.title + ', content : ' + notice.content + ', date : ' + notice.date + ', category : ' + notice.category);    store.hmset('notice:'+ notice.id, 'title', notice.title, 'content', notice.content, 'category', notice.category, 'date', notice.date);
    res.redirect('/notice');
};

/*********************************************************************** 
 *                             Notice Update					   
*************************************************************************/

exports.update = function(req, res){
    console.log('/notice/update 처리함');

    var notice = {
        id: ++id,
        title: req.body.title,
        content: req.body.content,
        category: req.body.notice_cate,
        date:new Date().toISOString().substring(0, 10)
    };
    // console.log('title : ' + title + ', content : ' + content + ', date : ' + date + ', category : ' + category);
    store.hmset('notice:'+ notice.id, 'title', notice.title, 'content', notice.content, 'category', notice.category, 'date', notice.date);

    res.redirect('/notice');
};


/*********************************************************************** 
 *                             Notice Delete					   
*************************************************************************/

// 자기가 쓴 글 만 지울 수 있도록 -> 생각해보니까 공지글이니까..관리자만 권한 주면 될 것 같음
exports.delete = function(req, res){
    console.log('/notice/delete 처리함');
    var userId = req.user.username;
    var postId = req.body.postId;

    store.del('notice:'+ postId, function(req, res){
        res.redirect('../notice.html');
    });
    res.redirect('/notice');
};

/*********************************************************************** 
 *                             Notice Detail					   
*************************************************************************/

exports.detail = function(req, res){
    console.log('/notice/detail 처리함');

    var noticeId = req.params.id;

    store.hgetall(noticeId, function(err, results){
        var notice = {
            id: noticeId,
            title: results.title,
            content: results.content,
            category: results.category,
            // date:new Date().toISOString().substring(0, 10)
            date: results.date
        };
        console.log('title : ' + notice.title + ', content : ' + notice.content + ', date : ' + notice.date + ', category : ' + notice.category);

        if (!req.user){
            res.render('notice_detail', {notice: notice});
        }
        else{
            res.render('notice_detail', {notice: notice, user:req.user.username});
        }

    });
};