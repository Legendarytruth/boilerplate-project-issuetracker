const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite("POST /api/issues/{project} ->", function (){
    test("Every field", function(done){
      chai.request(server)
      .post("/api/issues/tests")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "tee",
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: "ett",
        status_text: "ongoing",
        open: "true"
      })
      .end(function(err, res){
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.issue_title, "test");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "tee");
        assert.equal(res.body.assigned_to, "ett");
        assert.equal(res.body.status_text, "ongoing");
        assert.equal(res.body.open, true);
        done();
      })
    })

    test("Required field", function(done){
      chai.request(server)
      .post("/api/issues/tests")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "tee",

      })
      .end(function(err, res){
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.issue_title, "test");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "tee");
        done();
      })
    })

    test("Missing field", function(done){
      chai.request(server)
      .post("/api/issues/tests")
      .send({
        issue_title: "test",
        created_by: "tee",
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: "ett",
        status_text: "ongoing",
        open: "true"
      })
      .end(function(err, res){
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.error, "required field(s) missing");
        done();
      })
    })
  })

   suite("GET /api/issues/{project} ->", function (){
     test("View issues", function(done){
       chai.request(server)
       .get("/api/issues/tests")
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.isArray(res.body)
         done();
       })
     })

     test("View issues one filter", function(done){
       chai.request(server)
       .get("/api/issues/tests?issue_title=\"test\"")
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.isArray(res.body)
         done();
       })
     })

     test("View issues multiple filter", function(done){
       chai.request(server)
       .get("/api/issues/tests?issue_title=\"test\"&issue_text=\"test\"")
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.isArray(res.body)
         done();
       })
     })
   })

   suite("PUT /api/issues/{project} ->", function (){
     test("Update one field", function(done){
       chai.request(server)
       .get('/api/issues/tests')
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         let id = res.body[0]._id;
       
       chai.request(server)
       .put("/api/issues/tests")
       .send({_id:id, issue_text:"test2"})
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.equal(res.body.result, "successfully updated")
         assert.equal(res.body._id, id)
         done();
       })
     })
     })

    test("Update multiple field", function(done){
       chai.request(server)
       .get('/api/issues/tests')
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         let id = res.body[0]._id;
       
       chai.request(server)
       .put("/api/issues/tests")
       .send({_id:id, issue_text:"test2", issue_title:"test2"})
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.equal(res.body.result, "successfully updated")
         assert.equal(res.body._id, id)
         done();
       })
     })
     })

    test("Missing id", function(done){
       chai.request(server)
       .put("/api/issues/tests")
       .send({ issue_text:"test2"})
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.equal(res.body.error, 'missing _id')
         done();
       })
     })

     test("No fields", function(done){
       chai.request(server)
       .get('/api/issues/tests')
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         let id = res.body[0]._id;
       
       chai.request(server)
       .put("/api/issues/tests")
       .send({_id:id})
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.equal(res.body.error, "no update field(s) sent")
         assert.equal(res.body._id, id)
         done();
       })
     })
     })

      test("Invalid id", function(done){
       chai.request(server)
       .put("/api/issues/tests")
       .send({_id:"Not Valid", issue_text: "test2"})
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         assert.equal(res.body.error, "could not update")
         assert.equal(res.body._id, "Not Valid")
         done();
       })
     })
   })

   suite("DELETE /api/issues/{project} ->", function (){
    test("An issue", function(done){
      chai.request(server)
       .get('/api/issues/tests')
       .end(function(err, res){
         assert.equal(res.status, 200)
         assert.equal(res.type, 'application/json')
         let id = res.body[0]._id;


        chai.request(server)
        .delete('/api/issues/tests')
        .send({_id:id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.result, "successfully deleted")
          assert.equal(res.body._id, id)
          done();
        })
       })
      })
    
    test("Invalid id", function(done){
      chai.request(server)
      .delete('/api/issues/tests')
      .send({_id:"NOT VALID"})
      .end(function(err, res){
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.error, "could not delete")
        assert.equal(res.body._id, "NOT VALID")
        done();
      })
    })

    test("Missing id", function(done){
      chai.request(server)
      .delete('/api/issues/tests')
      .send({})
        .end(function(err, res){
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.error, "missing _id")
        done();
      })
    })
    






   })

});
