// initially based on ivyApps' ivy-videojs ember component.
// https://github.com/IvyApp/ivy-videojs/blob/master/addon/components/ivy-videojs.js

import videojs from 'videojs';
import vYoutube from 'discourse/plugins/techtalks-ui/vendor/videojs/videojs-youtube';
import vVimeo from 'discourse/plugins/techtalks-ui/vendor/videojs/videojs-vimeo';

export default Em.Component.extend({
  tagName: 'div',
  templateName: 'components/video-embed',

  concatenatedProperties: ['playerAttributeBindings'],
  naturalAspectRatio: 0.6525,

  playerEvents: {
    // player updates
    durationchange   : 'durationChange',
    loadedmetadata   : 'loadedMetadata',
    fullscreenchange : 'durationChange',
    timeupdate       : 'timeUpdate',
    volumechange     : 'volumeChange',

    // player states
    waiting          : 'waiting',
    play             : 'play',
    pause            : 'pause',
    seekin           : 'seeking',
    seeked           : 'seeked',
    ended            : 'ended'
  },

  playerAttributeBindings: [
    // 'autoplay',
    // 'controls',
    // 'currentHeight:height',
    // 'currentWidth:width',
    // 'loop',
    // 'muted',
    // 'playbackRate',
    'poster',
    // 'preload',
    // 'volume'
  ],

  setup: {
    'techOrder': ['html5', 'flash', 'youtube', 'vimeo'],
    'controls': true
  },

  autoresize: true,

  currentTimeDidChange: Ember.on('seeked', 'timeUpdate', function(player) {
    this.set('currentTime', player.currentTime());
  }),

  dimensionsDidChange: Ember.on('resize', function(player) {
    this.setProperties({
      currentHeight: player.height(),
      currentWidth:  player.width()
    });
  }),

  durationDidChange: Ember.on('durationChange', function(player) {
    this.set('duration', player.duration());
  }),

  volumeDidChange: Ember.on('volumeChange', function(player) {
    this.set('muted', player.muted());
    this.set('volume', player.volume());
  }),

  _applyPlayerAttribute: function(player, attrName, newValue) {
    var method = player[attrName];

    if (method) {
      var oldValue = method.call(player);

      if (oldValue !== newValue) {
        method.call(player, newValue, true);
      }
    }
  },

  _recalcSize: function(){
    const naturalAspectRatio = this.get('naturalAspectRatio'),
          parentWidth = this.$().width(),
          parentHeight = parseFloat(this.$().css("max-height"));

    var height = parentWidth * naturalAspectRatio,
        width = parentWidth;

    if (parentHeight && parentHeight != NaN && height > parentHeight){
      height = parentHeight;
      width = parentHeight / naturalAspectRatio;
    }

    return {
      height: height,
      width:  width
    }
  },

  _autoresizePlayer: function(player) {
    // Bail out early if the component is destroyed or in the process of being
    // destroyed. Setting a property on a destroyed object results in an error.
    if (this.isDestroying || this.isDestroyed) { return; }

    if (!this.get('autoresize')) { return; }

    const size = this._recalcSize();

    this.setProperties({
      currentHeight: size.height,
      currentWidth:  size.width
    });
  },

  _didInitPlayer: function(player) {
    this._setupPlayerAttributes(player);
    this._setupPlayerEvents(player);
    this._setupAutoresize(player);

    Ember.run(this, function() {
      this.sendAction('ready', player);
    });

    this.one('willDestroyElement', function() {
      player.dispose();
    });
  },

  _initPlayer: Ember.on('didInsertElement', function() {
    const self = this,
          element = this.$('video')[0],
          options = this.get('setup') || {},
          sizes = this._recalcSize();

    if(!options.width) options.width = sizes.width;
    if(!options.height) options.height = sizes.height;

    videojs(element, options, function() {
      self._didInitPlayer(this);
    });
  }),

  _registerPlayerObserver: function(property, target, observer) {
    var scheduledObserver = function() {
      Ember.run.scheduleOnce('render', this, observer);
    };

    this.addObserver(property, target, scheduledObserver);

    this.one('willClearRender', this, function() {
      this.removeObserver(property, target, scheduledObserver);
    });
  },

  _setupAutoresize: function(player) {
    this._setupResizeListener(player);

    var observer = function() {
      this._autoresizePlayer(player);
    };

    this._registerPlayerObserver('autoresize', this, observer);
    this._registerPlayerObserver('naturalAspectRatio', this, observer);

    Ember.run(this, function() {
      // Set the initial player size.
      Ember.run.scheduleOnce('render', this, observer);
    });
  },

  _setupPlayerAttributeBindingObservation: function(player, property, attrName) {
    var observer = function() {
      var propertyValue = this.get(property);
      this._applyPlayerAttribute(player, attrName, propertyValue);
    };

    this._registerPlayerObserver(property, this, observer);

    Ember.run(this, function() {
      if (this.isDestroyed) { return; }

      var propertyValue = this.get(property);

      // If the property is null or undefined, read the value from the player
      // as a default value. This way we automatically pick up defaults from
      // video.js without having to specify them here.
      if (Ember.isNone(propertyValue)) {
        propertyValue = player[attrName].call(player);
        this.set(property, propertyValue);
      }

      // Set the initial player value.
      this._applyPlayerAttribute(player, attrName, propertyValue);
    });
  },

  _setupPlayerAttributes: function(player) {
    for (var idx = 0; idx < this.playerAttributeBindings.length; idx++) {
      var binding = this.playerAttributeBindings[idx];
      var colonIndex = binding.indexOf(':'), property, attrName;

      if (colonIndex === -1) {
        property = binding;
        attrName = binding;
      } else {
        property = binding.substring(0, colonIndex);
        attrName = binding.substring(colonIndex + 1);
      }

      this._setupPlayerAttributeBindingObservation(player, property, attrName);
    }
  },

  _setupPlayerEventHandler: function(player, event, eventName) {
    var handlerFunction = Ember.run.bind(this, function(e) {
      this.trigger(eventName, player, e);
      this.sendAction('player-' + eventName, player, e);
    });

    // Bind an event handler to the player. We don't need to worry about
    // tearing it down since video.js does that for us on dispose.
    player.on(event, handlerFunction);
  },

  _setupPlayerEvents: function(player) {
    var event;
    var events = this.get('playerEvents');

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this._setupPlayerEventHandler(player, event, events[event]);
      }
    }
  },

  _setupResizeListener: function(player) {
    var handlerFunction = Ember.run.bind(this, function() {
      this._autoresizePlayer(player);
    });

    // Debounce the handler function so that it only fires once the window has
    // stopped resizing for 150ms.
    var debouncedFunction = function() {
      Ember.run.debounce(this, handlerFunction, 150);
    };

    Ember.$(window).on('resize', debouncedFunction);

    this.one('willClearRender', function() {
      Ember.$(window).off('resize', debouncedFunction);
    });
  }
});
