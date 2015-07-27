function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export default Em.Component.extend({
  tagName: 'span',
  classNameBindings: [":animatedWords"],
  attributeBindings: ["style"],
  current : [],
  shuffle: false,
  speed: 500,
  pause: 10,
  wordsList: function(){
    var list = this.get('words').split("|");
    if (this.get("shuffle")) { list = shuffle(list)};
    return list;
  }.property('words'),

  style: function(){
    return "color: #" + this.get("currentColor");
  }.property('currentColor'),

  listIndex: 0,
  _nextWord(){
    if (this.get('wordsList').length <= this.get('listIndex')){
      this.set('listIndex', 0);
    }
    this.set('current', []);
    this._setRandomColor();
    this._animateWord();
    this.set("listIndex", this.get("listIndex") + 1);
  },

  _setRandomColor(){
    const colors = (this.get("colors") || Discourse.SiteSettings.category_colors).split("|");
    this.set('currentColor', colors[parseInt(Math.random() * colors.length)]);
  },

  _animateWord(){
    const word = this.get('wordsList')[this.get('listIndex')],
          pause = parseInt(this.get("pause") || 10) * 1000,
          speed = parseInt(this.get("speed")) || 500;
    if (!word){ return console.warning("Gotta gimme words!")};

    word.split("").forEach((key, idx) => {
      setTimeout(()=> {
        this.get("current").pushObject(key);
      }, idx * speed);
    });


    setTimeout(()=> this._nextWord(), (word.length * speed) + pause)
  },

  _setup: function(){
    this._nextWord();
  }.on('didInsertElement')
});