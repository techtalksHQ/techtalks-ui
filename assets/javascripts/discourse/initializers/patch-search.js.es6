
export default {
  name: "patch-search",

  initialize(container) {
    const headerCtrl = container.lookup("controller:header");

    headerCtrl.reopen({
      needs: ['application', 'search-box'],
      searchTerm: null,
      updateSearchTerm: function(){
        this.controllerFor('search-box').set('term', this.get('searchTerm'));
      }.observes('searchTerm')
    });
  }
}
