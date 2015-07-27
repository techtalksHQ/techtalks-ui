import ShowFooter from "discourse/mixins/show-footer";
import buildTopicRoute from 'discourse/routes/build-topic-route';

export default buildTopicRoute('top', {
  deactivate(){
    $('body').removeClass('on-home');
  },
  beforeModel(){
    $('body').addClass('on-home');
  },

  renderTemplate() {
    this.render('navigation/home', { outlet: 'navigation-bar' });
    this.render('discovery/topics', { outlet: 'list-container' });
  },

  titleToken: function() {
    return "Voted. Curated. Moderated. Only the best videos in tech.";
  }
});
