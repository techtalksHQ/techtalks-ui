import SiteMapController from 'discourse/controllers/site-map';

export default SiteMapController.extend({
  selectedCategoryId: null,

  actions: {
    selectCategoryItem: function(itemId){
      this.set("selectedCategoryId", itemId);
    }
  },

  mainCategories: function() {
    return Discourse.Category.list().reject(
        c => c.get('parent_category_id') ||  c.get('isUncategorizedCategory')
      );
  }.property(),

  publicMainCategories: function(){
    return this.get("mainCategories").reject(c => c.get("read_restricted") || c.get("slug") === 'meta');
  }.property("mainCategories"),

  metaCategories: function(){
    return this.get("mainCategories").filter(c => c.get("read_restricted") || c.get("slug") === 'meta');
  }.property("mainCategories"),

  selectedCategory: function(){
    return Discourse.Category.idMap()[this.get("selectedCategoryId")] || this.get("categories")[0];
  }.property("categories", "selectedCategoryId"),

  subCategories: function(){
    const selectedCategoryId = this.get("selectedCategory.id");
    return Discourse.Category.list().reject(c => c.get('parent_category_id') !== selectedCategoryId);
  }.property("selectedCategory")

});