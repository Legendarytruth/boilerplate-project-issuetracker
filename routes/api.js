'use strict';
require('dotenv').config();
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const Schema = mongoose.Schema;


module.exports = function (app) {
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
  const Issue_Schema = new Schema({
    issue_title: {type: String, default: ''},
    issue_text: {type: String, default: ''},
    created_by: {type: String, default: ''},
    assigned_to: {type: String, default: ''},
    status_text: {type: String, default: ''},
    open: {type: Boolean, default: false},
    created_on: {type: Date, default: Date.now},
    updated_on: {type: Date, default: Date.now}
  },{ versionKey: false })

let Issue = mongoose.model("Issue", Issue_Schema);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      //console.log("get: " + project + " req.body: " + req.body +" / "+ req.query)
      //console.log(JSON.stringify(req.query))
      mongoose.model(project, Issue_Schema).find(req.query, (err, issue) => {
        if(err){ 
          return res.json({error: "failed get"})
        }else{
          //console.log("Issue: " + issue)
          res.json(issue)
        }
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      //console.log("post: " + project + "issue_title: " + req.body.issue_title)
      let issue = {
       issue_title: req.body.issue_title || '',
       issue_text: req.body.issue_text || '',
       created_by: req.body.created_by || '',
       created_on: new Date(),
       updated_on: new Date(),
       assigned_to: req.body.assigned_to || '',
       status_text: req.body.status_text || '',
       open: true
      }
      if(issue.issue_title === '' || issue.issue_text == '' || issue.created_by == ''){
        return res.json({ error: 'required field(s) missing' })
      }else{
        let mod = mongoose.model(project, Issue_Schema);
        mod(issue).save((err, issue) => {
          if(err){
            return res.send(err)
          }else{
            return res.json(issue)
          }
        })
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      //console.log("put: " + project)
      if(!req.body._id){
        return res.json({error: 'missing _id'})
      }
      if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by){
        return res.json({ error: 'no update field(s) sent', '_id':req.body._id })
      }

      mongoose.model(project, Issue_Schema).findById(req.body._id, (err, issue) => {
        if(err || issue === null){
          return res.json({error:'could not update', '_id':req.body._id})
        }else{
          issue.issue_title = req.body.issue_title;
          issue.issue_text = req.body.issue_text;
          issue.created_by = req.body.created_by;
          issue.updated_on = Date.now();
          issue.assigned_to = req.body.assigned_to || '';
          issue.status_text = req.body.status_text || '';
          issue.open = req.body.open === 'true' ? true : false;
          
          issue.save((err, data) =>{
            if(err){
              return res.json({error:'could not update', '_id':req.body._id})
            }else{
              //console.log(data)
               return res.json({result:'successfully updated','_id':req.body._id})
            }
          })
        }
      })
    })
    
    .delete(function (req, res){
      //console.log("delete: "+req.params.project)
      let project = req.params.project;
      if(!req.body._id){
        return res.json({error: 'missing _id'})
      }
      mongoose.model(project, Issue_Schema).findByIdAndDelete(req.body._id, (err, issue) =>{
        if(err || issue === null){
          return res.json({ error: 'could not delete', '_id': req.body._id });
        }else{
          return res.json({"result":"successfully deleted","_id":req.body._id});
        }
      })
    });
    
};
