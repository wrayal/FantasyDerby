angular.module('FantasyDerbyApp')
  .controller('BlogMessagesCtrl', function (Competitions,BlogMessages) {
    blogMessagesCtrl=this;

    blogMessagesCtrl.comps=Competitions.completeSet;

    blogMessagesCtrl.whichBlog="";
    blogMessagesCtrl.messagesData=null;
    blogMessagesCtrl.updateBlogData=function() {
      blogMessagesCtrl.messagesData=BlogMessages.getBlogData(blogMessagesCtrl.whichBlog);
    }

    blogMessagesCtrl.post={
      title: "",
      message: "",
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    blogMessagesCtrl.postBlog=function() {
      BlogMessages.commitPost(blogMessagesCtrl.whichBlog,blogMessagesCtrl.post);
      blogMessagesCtrl.post.title="";
      blogMessagesCtrl.post.message="";
    }
    blogMessagesCtrl.deletePost=function(messageKey) {
      BlogMessages.deletePost(blogMessagesCtrl.whichBlog,messageKey);
    }

  });