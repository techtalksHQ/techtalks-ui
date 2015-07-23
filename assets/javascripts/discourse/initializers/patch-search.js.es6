
export default {
  name: "patch-search",

  initialize(container) {
    const headerCtrl = container.lookup("controller:header");

    headerCtrl.reopen({
      needs: ['application', 'search-box'],
      searchTerm: null,
      showSearchResults: false,
      showSitemap: false,

      actions: {
        submitSearch: function(){
          this.set("showSearchResults", false);
          this.controllerFor('search-box').send('fullSearch');
        },
        clearSearch: function(){
          this.set("showSearchResults", false);
          this.set('searchTerm', "");
        },
        toggleSitemap: function(){
          this.set('showSitemap', !this.get("showSitemap"));
        }
      },
      updateSearchTerm: function(){
        var term = this.get('searchTerm');
        this.controllerFor('search-box').set('term', term);
        if (term) this.set("showSearchResults", true);

      }.observes('searchTerm'),
    });
  }
}
