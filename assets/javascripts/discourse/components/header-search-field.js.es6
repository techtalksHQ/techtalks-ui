import TextField from 'discourse/components/text-field';

export default TextField.extend({
  placeholder: function() {
    return this.get('searchContextEnabled') ? "" : I18n.t('search.title');
  }.property('searchContextEnabled'),
  keyDown: function(e){
    var term = this.get('value');
    if (e.which === 13 && term && term.length > 2) {
      this.sendAction("onSubmit");
      e.preventDefault();
    } else if(e.which === 27 ){ // ESCAPE
      this.sendAction("onClear");
      e.preventDefault();
    }
  }
});
