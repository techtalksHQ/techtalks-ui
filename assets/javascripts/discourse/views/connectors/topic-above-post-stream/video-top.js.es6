export default Ember.View.extend({
  classNameBindings: [":video-top", "docked"],
  _inserted: function() {
    console.log(this);
    Discourse.URL.appEvents.on("topic:scrolled", this, '_dock');
  }.on("didInsertElement"),
  _dock: function(offset){
    console.log(arguments, $('#videojs').offset().top + $('#videojs').height());
    this.set("docked", ($('#videojs').offset().top + $('#videojs').height()) < offset);
  }
});
