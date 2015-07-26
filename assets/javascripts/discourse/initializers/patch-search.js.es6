
export default {
  name: "patch-search",

  initialize(container) {
    const headerCtrl = container.lookup("controller:header"),
          router = container.lookup('router:main');

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

    const OUTISDE_DOWN = "mousedown.outside-sitemap-expand";


    function close_header(){
      headerCtrl.setProperties({
                      "showSearchResults": false,
                      "showSitemap": false
      })
    }

    // unfortunately the view is at the moment of this exection
    // already in a lifecycle we can't attach didInsertElement-Functions
    // anymore / or at least they aren't executed
    Em.run.next(function(){
      $("html").off(OUTISDE_DOWN).
                  on(OUTISDE_DOWN, e => {
                    if ($(e.target).closest('.extend').length){
                      return
                    }
                    close_header();
                  });
    });

    router.on('willTransition', function() {
      close_header();
    });
  }
}
