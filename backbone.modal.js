(function() {
  var $, Backbone, Modal, Mousetrap, Promise, SimpleText, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Mousetrap = (typeof require === "function" ? require("mousetrap") : void 0) || window.Mousetrap;

  $ = (typeof require === "function" ? require("jquery") : void 0) || window.$;

  _ = (typeof require === "function" ? require("undersore") : void 0) || window._;

  Promise = (typeof require === "function" ? require("promise") : void 0) || $.Deferred;

  Backbone = (typeof require === "function" ? require("backbone") : void 0) || window.Backbone;

  SimpleText = (function(_super) {
    __extends(SimpleText, _super);

    function SimpleText() {
      _ref = SimpleText.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SimpleText.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.content = options.content;
      return this.promise = options.promise;
    };

    SimpleText.prototype.render = function() {
      this.$el.html(this.content);
      return this;
    };

    return SimpleText;

  })(Backbone.View);

  Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      this.open = __bind(this.open, this);
      this.close = __bind(this.close, this);
      this.confirm = __bind(this.confirm, this);
      this.notify = __bind(this.notify, this);
      this.display = __bind(this.display, this);
      _ref1 = Modal.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Modal.prototype.className = 'modal';

    Modal.prototype.events = {
      'click .close': 'onClose',
      'click .cancel': 'onCanceled',
      'click .confirm': 'onConfirmed',
      'click .overlay': 'onClose'
    };

    Modal.prototype.initialize = function(options) {
      return this.layout = options.layout;
    };

    Modal.prototype.show = function(v) {};

    Modal.prototype.display = function(content, options) {
      var defaults;
      if (options == null) {
        options = {};
      }
      defaults = {
        actAs: {
          closed: 'reject'
        }
      };
      return this.open(content, _.extend(defaults, options));
    };

    Modal.prototype.notify = function(content, options) {
      var defaults;
      if (options == null) {
        options = {};
      }
      defaults = {
        actAs: {
          closed: 'resolve',
          confirmed: 'resolve'
        }
      };
      return this.open(content, _.extend(defaults, options));
    };

    Modal.prototype.confirm = function(content, options) {
      var defaults;
      if (options == null) {
        options = {};
      }
      defaults = {
        actAs: {
          closed: 'reject',
          canceled: 'reject',
          confirmed: 'resolve'
        }
      };
      return this.open(content, _.extend(defaults, options));
    };

    Modal.prototype.content = function(view) {
      var _ref2, _ref3;
      if (view && view !== this._view) {
        if (_.isString(view)) {
          view = new SimpleText({
            content: view,
            promise: new Promise
          });
        }
        if ((_ref2 = this._view) != null) {
          _ref2.remove();
        }
        this._view = view;
        if (this.$content) {
          if ((_ref3 = this._view) != null) {
            _ref3.setElement(this.$content);
          }
        }
      }
      return this._view;
    };

    Modal.prototype.eventActAs = function(opts) {
      var name, order, _ref2;
      if (this.getPromise() == null) {
        return;
      }
      for (name in opts) {
        order = opts[name];
        this._view.listenTo(this, name, (_ref2 = this.getPromise()) != null ? _ref2[order] : void 0);
      }
      return this;
    };

    Modal.prototype.render = function() {
      var _ref2, _ref3;
      this.$el.html(this.layout());
      this.$close = this.$('.close');
      this.$content = this.$('.content');
      if (this.$content !== this.content.$el) {
        if ((_ref2 = this.content()) != null) {
          _ref2.setElement(this.$content);
        }
      }
      if ((_ref3 = this.content()) != null) {
        _ref3.render();
      }
      return this;
    };

    Modal.prototype.onCanceled = function(event) {
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      if (!this._lock) {
        return this.canceled();
      }
    };

    Modal.prototype.canceled = function() {
      this.trigger('canceled');
      return this;
    };

    Modal.prototype.onConfirmed = function(event) {
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      if (!this._lock) {
        return this.confirmed();
      }
    };

    Modal.prototype.confirmed = function() {
      this.trigger('confirmed');
      return this;
    };

    Modal.prototype.onClose = function(event) {
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      if (!this._lock) {
        return this.close();
      }
    };

    Modal.prototype.close = function() {
      var _ref2;
      if (this._timeout != null) {
        window.clearTimeout(this._timeout);
      }
      Mousetrap.unbind('esc');
      this.$el.hide();
      this.trigger('closed');
      if ((_ref2 = this.content()) != null) {
        _ref2.remove();
      }
      this.lock(false);
      return this;
    };

    Modal.prototype.open = function(content, options) {
      this.content(content);
      this.eventActAs(options.actAs);
      this.render();
      console.log(options.lock);
      this.lock((options.lock != null) && options.lock);
      this.$el.show();
      this.adjustPosition();
      if (options.timeout != null) {
        this._timeout = window.setTimeout(this.close, options.timeout);
      }
      this.trigger('opened');
      return this;
    };

    Modal.prototype.lock = function(_lock) {
      this._lock = _lock != null ? _lock : true;
      if (this._lock) {
        this.$close.remove();
        return Mousetrap.unbind('esc');
      } else {
        return Mousetrap.bind('esc', this.close);
      }
    };

    Modal.prototype.getPromise = function() {
      var _ref2;
      return (_ref2 = this.content()) != null ? _ref2.promise : void 0;
    };

    Modal.prototype.adjustPosition = function() {
      return this.$('.modal-container').css('top', ($('html').scrollTop() || $('body').scrollTop()) + 30);
    };

    return Modal;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Modal;
  } else {
    Backbone.Modal = Modal;
  }

}).call(this);
