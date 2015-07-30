
export default Ember.View.extend({
  classNameBindings: [":video-top", "controller.playerState", "animating", "docked"],
  animating: false,
  _prior_state: null,
  _inserted: function() {
    Discourse.URL.appEvents.on("topic:scrolled", this, '_dock');
  }.on("didInsertElement"),

  updateAnimating: function(){
    if (['player-play', 'player-waiting'].indexOf(this.get("controller.playerState")) > -1){
      if (['player-play', 'player-waiting'].indexOf(this.get("_prior_state")) == -1){
        this.set('animating', 'animating-out');
      }
    } else if (this.get("controller.playerState") === 'player-pause'){
      this.set('animating', 'animating-in');
    }
    this.set("_prior_state", this.get("controller.playerState"));
  }.observes('controller.playerState'),

  _didAnimate: function(){
    this.$('.video-meta-wrap').on("animationend", e=>{
      this.set('animating', this.get('animating') === 'animating-out' ? 'animating-in': false);
    });
  }.on('didInsertElement'),

  _dock: function(offset){
    this.set("docked", ($('#videojs').offset().top + $('#videojs').height()) < offset);
  }
});
