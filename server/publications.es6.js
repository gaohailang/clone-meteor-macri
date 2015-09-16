Meteor.publish('posts', (options)=>{
  /*check(options, {
    sort: Object,
    limit: Number
  });*/
  return Posts.find({}, options);
});

Meteor.publish('singlePost', (id)=>{
  return Posts.find(id);
});

Meteor.publish('comments', (postId)=>{
  return Comments.find({postId: postId});
});