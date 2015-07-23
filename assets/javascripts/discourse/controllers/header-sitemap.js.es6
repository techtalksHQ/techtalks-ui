import SiteMapController from 'discourse/controllers/site-map';

export default SiteMapController.extend({
  selectedCategoryId: null,

  actions: {
    selectCategoryItem: function(itemId){
      this.set("selectedCategoryId", itemId);
    }
  },

  selectedCategory: function(){
    return Discourse.Category.idMap()[this.get("selectedCategoryId")] || this.get("categories")[0];
  }.property("categories", "selectedCategoryId")

});