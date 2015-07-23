

export default Em.Component.extend({
  tagName: 'li',
  classNameBindings: ["selected:selected"],
  attributeBindings: ["style"],

  style: function(){
    return "border-left-color: #" +this.get("category.color");
  }.property("category"),

  selected: function(){
    console.log(this.get("selection"));
    return this.get('selection.id') == this.get("category.id");
  }.property("selection", "category"),

  _setup: function(){
    this.$().on("mouseenter", function(){
      this.sendAction('select', this.get("category.id"));
    }.bind(this));
  }.on("didInsertElement")

});