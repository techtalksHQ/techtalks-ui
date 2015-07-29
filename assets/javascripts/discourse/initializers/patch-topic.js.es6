
export default {
  name: "patch-topic",

  initialize(container) {
    const topicCtrl = container.lookup("controller:topic");

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

  }
}