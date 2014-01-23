(function() {
  var Faked, fakeModal, fakeModalConf, layout, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Faked = (function(_super) {
    __extends(Faked, _super);

    function Faked() {
      _ref = Faked.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Faked.prototype.render = function() {
      this.$el.html('<a class="close" href="#">CLOSE</a><div class="sofaked">test</div>');
      return this;
    };

    return Faked;

  })(Backbone.View);

  layout = _.template("<div class=\"overlay\"></div>\n<div class=\"modal-container\">\n  <div class=\"content\">\n    <a class=\"close\" href=\"#\">CLOSE</a>\n  </div>\n</div>");

  fakeModal = '<p class="modaltpl"> My supa fake modal text.</p>';

  fakeModalConf = fakeModal + '<section><button class="cancel"><button class="confirm"></section>';

  describe('Modal', function() {
    beforeEach(function() {
      return this.modal = new Backbone.Modal({
        layout: layout
      });
    });
    afterEach(function() {
      return this.modal.remove();
    });
    it.skip('exist as a sys command', function() {
      return expect(this.modal).to.be.an["instanceof"](Backbone.Modal);
    });
    it('display a view', function() {
      var faked;
      faked = new Faked;
      this.modal.display(faked);
      return expect(this.modal.$('.content .sofaked')).to.have.length(1);
    });
    describe('should close when clik on', function() {
      beforeEach(function() {
        this.modal.display(new Faked);
        this.spyClose = sinon.spy();
        return this.modal.on('closed', this.spyClose);
      });
      afterEach(function() {
        return this.modal.off('closed', this.spyClose);
      });
      it('.close', function() {
        this.modal.$('.close').click();
        return expect(this.spyClose).to.have.been.called;
      });
      return it('.overlay', function() {
        this.modal.$('.overlay').trigger('click');
        return expect(this.spyClose).to.have.been.called;
      });
    });
    describe('when display a string', function() {
      beforeEach(function() {
        return this.m = this.modal.display(fakeModal);
      });
      it('display the string as content', function() {
        return expect(this.modal.$('.content .modaltpl')).to.have.length(1);
      });
      return describe('when closing', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spyNot, this.spy);
          return this.m.close();
        });
        return it('notify promise as failed', function() {
          expect(this.spy).to.have.been.calledOnce;
          return expect(this.spyNot).to.not.have.been.called;
        });
      });
    });
    describe('when notify a string', function() {
      beforeEach(function() {
        return this.m = this.modal.notify(fakeModalConf);
      });
      it('display the string as content', function() {
        return expect(this.modal.$('.content .modaltpl')).to.have.length(1);
      });
      describe('when closing', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spy, this.spyNot);
          return this.m.close();
        });
        return it('resolve promise as ok', function() {
          expect(this.spy).to.have.been.calledOnce;
          return expect(this.spyNot).to.not.have.been.called;
        });
      });
      return describe('when confirm', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spy, this.spyNot);
          return this.m.$('.confirm').click();
        });
        return it('resolve promise as ok', function() {
          expect(this.spy).to.have.been.calledOnce;
          return expect(this.spyNot).to.not.have.been.called;
        });
      });
    });
    return describe('when confirm a string', function() {
      beforeEach(function() {
        return this.m = this.modal.confirm(fakeModalConf);
      });
      it('display the string as content', function() {
        return expect(this.modal.$('.content .modaltpl')).to.have.length(1);
      });
      describe('when closing', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spy, this.spyNot);
          return this.m.close();
        });
        return it('resolve promise as not ok', function() {
          expect(this.spyNot).to.have.been.calledOnce;
          return expect(this.spy).to.not.have.been.called;
        });
      });
      describe('when confirm', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spy, this.spyNot);
          return this.m.$('.confirm').click();
        });
        return it('resolve promise as ok', function() {
          expect(this.spy).to.have.been.calledOnce;
          return expect(this.spyNot).to.not.have.been.called;
        });
      });
      return describe('when cancel', function() {
        beforeEach(function() {
          this.spy = sinon.spy();
          this.spyNot = sinon.spy();
          this.m.getPromise().then(this.spy, this.spyNot);
          return this.m.$('.cancel').click();
        });
        return it('resolve promise as nok', function() {
          expect(this.spyNot).to.have.been.calledOnce;
          return expect(this.spy).to.not.have.been.called;
        });
      });
    });
  });

}).call(this);
