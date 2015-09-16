
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function(){
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: ()=>{
        if(self.posts().count() === self.postsLimit()) {
          return self.nextPath();
        }
      }
    }
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});
Router.route('/new/:postsLimit?', {
  name: 'newPosts'
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function(){
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function(){
    console.log(this.params);
    return Posts.findOne(this.params._id);
  }
});

Router.route('/submit', {
  name: 'postSubmit'
});