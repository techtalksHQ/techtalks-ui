export default Em.Component.extend({
  tagName: 'div',
  classNameBindings: [":category-details"],
  attributeBindings: ["style"],

  style: function(){
    return "background-color: #" +this.get("category.color") + "; color:" + this.get('catgory.text_color');
  }.property("category"),

  // selected: function(){
  //   console.log(this.get("selection"));
  //   return this.get('selection.id') == this.get("category.id");
  // }.property("selection", "category"),

  // _setup: function(){
  //   this.$().on("mouseenter", function(){
  //     this.sendAction('select', this.get("category.id"));
  //   }.bind(this));
  // }.on("didInsertElement")

});