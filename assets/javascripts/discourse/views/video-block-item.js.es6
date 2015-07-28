
import videojs from 'videojs';
import StringBuffer from 'discourse/mixins/string-buffer';

export default Discourse.View.extend(StringBuffer, {
  tagName: 'a',
  rawTemplate: 'video-block-item.raw',
  classNames: ["video-block-item"],
  attributeBindings: ["style", "href"],
  topic: Em.computed.alias("content"),

  href: function(){
    return this.get('topic.url');
  }.property('topic'),

  author: function(){
    return this.get("topic.posters")[0];
  }.property('topic.posters'),

  style: function(){
    return 'background-image: url(' + (this.get('topic.image_url') || '/plugins/techtalks-ui/thumbs/' + parseInt(Math.random() * 27) + '.jpg') + ')';
  }.property('topic.image_url'),

  click: function(evt){
    evt.preventDefault();
    Discourse.URL.routeTo(this.get("href"));
  }
});