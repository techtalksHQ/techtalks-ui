export default Ember.View.extend({
  classNameBindings: [":video-top", "docked"],

  _inserted: function() {
    Discourse.URL.appEvents.on("topic:scrolled", this, '_dock');
  }.on("didInsertElement"),

  _dock: function(offset){
    this.set("docked", ($('#videojs').offset().top + $('#videojs').height()) < offset);
  }
});
