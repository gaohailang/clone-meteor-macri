Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers = {
  errorMessage: (field)=>{
    return Session.get('postSubmitErrors')[field]
  }
};

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postInsert', post, (error, result)=>{
      // if(error) return throwError(error.reason);
      if(result.postExists) throwError('This link has already been posted');

      Router.go('postPage', {
        _id: result._id
      });
    });
  }
});