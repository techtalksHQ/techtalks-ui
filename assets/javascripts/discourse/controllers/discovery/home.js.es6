import DiscoveryController from 'discourse/controllers/discovery';

export default DiscoveryController.extend({
  hasTopTopics: Em.computed.gt('model.top.topics.length', 0),
  allTopLoaded: Em.computed.empty('model.top.more_topics_url'),

  hasLatestTopics: Em.computed.gt('model.latest.topics.length', 0),
  allLatestLoaded: Em.computed.empty('model.latest.more_topics_url'),
});