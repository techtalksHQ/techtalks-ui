export default Em.Component.extend({
  tagName: 'div',
  classNameBindings: [":category-details"],
  attributeBindings: ["style"],

  style: function(){
    return "background-color: #" +this.get("category.color") + "; color: #" + this.get('category.text_color');
  }.property("category"),


  childCategories: function() {
    const categories = this.get("subCategories");
    if (categories && categories.length) { return categories };

    const category = this.get("category");
    return Discourse.Category.list().filter(function (c) {
      return c.get('parentCategory') === category;
    });
  }.property('category', 'subCategories'),

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