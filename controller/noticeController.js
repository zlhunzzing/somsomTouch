/**************************** Notice Controller ****************************/

var express = require('express'), 
    redis = require('redis');

var store = redis.createClient();


/*********************************************************************** 
 *                             Notice Create					   
*************************************************************************/

var id = 0;
exports.create = function(req, res) {
    console.log('/notice/create 호출됨.');

    var title = req.body.title;
    var content = req.body.content;
    // var target = document.getElementById("notice_cate");
    // var category = target.options[target.selectedIndex].text; //= req.body.category;
    var date = new Date().toISOString().substring(0, 10);

    console.log('title : ' + title + ', content : ' + content + ', date : ' + date); //+ ', category : ' + category +
    store.hmset('notice:' + (++id), 'title', title, 'content', content, 'date', date);//, 'category', category);
''
    res.redirect('../notice.html');
};


/*********************************************************************** 
 *                             Notice Read					   
*************************************************************************/

exports.read = function(req, res){
    console.log('/process/read 처리함');



};


/*********************************************************************** 
 *                             Notice Update					   
*************************************************************************/

exports.update = function(req, res){
    console.log('/process/update 처리함');



};


/*********************************************************************** 
 *                             Notice Delete					   
*************************************************************************/
// 안해봄
exports.delete = function(req, res){
    console.log('/process/delete 처리함');

    var userId = req.body.userId;

    store.del(userId);

    res.redirect('../notice.html');
};





