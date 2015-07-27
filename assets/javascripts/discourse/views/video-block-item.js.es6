import StringBuffer from 'discourse/mixins/string-buffer';

export default Discourse.View.extend(StringBuffer, {
  rawTemplate: 'video-block-item.raw',
  classNames: ["video-block-item"],
  attributeBindings: ["style"],
  topic: Em.computed.alias("content"),

  author: function(){
    return this.get("topic.posters")[0];
  }.property('topic.posters'),

  style: function(){
    return 'background-image: url(' + (this.get('topic.image_url') || '/plugins/techtalks-ui/thumbnail.png') + ')';
  }.property('topic.image_url')
});