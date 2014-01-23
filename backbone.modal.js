(function() {
  var Promise, SimpleText, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Promise = $.Deferred;

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

  Backbone.Modal = (function(_super) {
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
      'click .close': 'close',
      'click .cancel': 'canceled',
      'click .confirm': 'confirmed',
      'click .overlay': 'close'
    };

    Modal.prototype.initialize = function(options) {
      return this.layout = options.layout;
    };

    Modal.prototype.show = function(v) {};

    Modal.prototype.display = function(content) {
      this.content(content);
      this.eventActAs({
        closed: 'reject'
      });
      return this.render().open();
    };

    Modal.prototype.notify = function(content) {
      this.content(content);
      this.eventActAs({
        closed: 'resolve',
        confirmed: 'resolve'
      });
      return this.render().open();
    };

    Modal.prototype.confirm = function(content) {
      this.content(content);
      this.eventActAs({
        closed: 'reject',
        canceled: 'reject',
        confirmed: 'resolve'
      });
      return this.render().open();
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

    Modal.prototype.canceled = function(event) {
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      this.trigger('canceled');
      return this;
    };

    Modal.prototype.confirmed = function(event) {
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      this.trigger('confirmed');
      return this;
    };

    Modal.prototype.close = function(event) {
      var _ref2;
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      Mousetrap.unbind('esc');
      this.$el.hide();
      this.trigger('closed');
      if ((_ref2 = this.content()) != null) {
        _ref2.remove();
      }
      return this;
    };

    Modal.prototype.open = function() {
      Mousetrap.bind('esc', this.close);
      this.$el.show();
      this.adjustPosition();
      this.trigger('opened');
      return this;
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

}).call(this);
