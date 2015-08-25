
export default {
  name: "patch-topic",

  initialize(container) {
    const topicCtrl = container.lookup("controller:topic"),
          topicsCtrl = container.lookup("controller:discovery/topics");

    function playerStater(state){
      return function(){
        // sync state
        this.set("playerState", state);
      }
    }

    topicCtrl.reopen({
      playerState: "",
      player: null,

      actions: {
        'player-waiting': playerStater('player-waiting'),
        'player-play': playerStater('player-play'),
        'player-pause': playerStater('player-pause'),
        'player-seeking': playerStater('player-seeking'),
        'player-seeked': playerStater('player-seeked'),
        'player-ended': playerStater('player-ended'),
        'play-now': function(){
          const player = this.get('player');
          console.log(player);
          player.play();
        },
        'player-ready': function(player){
          console.log("player ready", player);
          this.set('player', player);
        }
      }
    });


    topicsCtrl.reopen({
      isVideoListing: function(){
        const cat = this.get("category");
        if (cat) {
          return !( cat.get("slug") === 'meta'|| cat.get("isUncategorizedCategory") || cat.get("read_restricted"));
        };
        return true;
      }.property("category")
    })

  }
}