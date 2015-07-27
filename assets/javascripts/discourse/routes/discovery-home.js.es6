import ShowFooter from "discourse/mixins/show-footer";
import {findTopicList, filterQueryParams} from 'discourse/routes/build-topic-route';

export default Discourse.Route.extend({
  needs: ['discovery/home'],
  model(data, transition) {
    Discourse.ScreenTrack.current().stop();

    const findOpts = filterQueryParams(transition.queryParams),
          extras = { cached: this.isPoppedState(transition) };

    return Ember.RSVP.Promise.all([
        findTopicList(this.store, 'top', findOpts, extras),
        findTopicList(this.store, 'latest', findOpts, extras)
      ])
  },
  deactivate(){
    $('body').removeClass('on-home');
  },
  beforeModel(){
    $('body').addClass('on-home');
  },


  setupController(controller, model, trans) {
    this.controllerFor('discovery/home').setProperties({ model: {top: model[0], latest: model[1]}});
  },

  renderTemplate() {
    this.render('navigation/home', { outlet: 'navigation-bar' });
    this.render('discovery/home', { controller: 'discovery/home', outlet: 'list-container' });
  },

  titleToken: function() {
    return "Voted. Curated. Moderated. Only the best videos in tech.";
  }
});
