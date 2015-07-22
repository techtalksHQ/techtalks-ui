export default Discourse.View.extend({
  tagName: 'div',
  elementId: 'search-box',
  templateName: 'search-box',
  keyDown: function(e){
    var term = this.get('controller.term');
    if (e.which === 13 && term && term.length > 2) {
      this.get('controller').send('fullSearch');
    }
  }
});
