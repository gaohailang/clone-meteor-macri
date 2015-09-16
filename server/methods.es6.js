Meteor.methods({
  postInsert(postAttributes) {
    var postWithSameLink = Posts.findOne({
      url: postAttributes.url
    });
    if(postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  upvote(postId) {

    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {
        upvoters: this.userId
      },
      $inc: {
        votes: 1
      }
    });

    if(!affected)
      throw new Meteor.Error('invalid', 'You weren\'t able to upvoted that already upvoted post');
  },
  commentInsert(commentAttributes) {

    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if(!post)
      throw new Meteor.Error('invalid-comment', 'you must comment on a post');

    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    Posts.update(comment.postId, {
      $inc: {commentsCount: 1}
    });

    comment._id = Comments.insert(comment);

    return comment._id;
  }
});