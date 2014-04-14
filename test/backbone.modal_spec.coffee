class Faked extends Backbone.View
  render: ->
    @$el.html '<a class="close" href="#">CLOSE</a><div class="sofaked">test</div>'
    @

layout = _.template """
<div class="overlay"></div>
<div class="modal-container">
  <div class="content"></div>
  <a class="close" href="#" id="closeCross">CLOSE</a>
</div>
"""
fakeModal = '<p class="modaltpl"> My supa fake modal text.</p>'
fakeModalConf = fakeModal + '<section><button class="cancel"><button class="confirm"></section>'

describe 'Modal', ->
  beforeEach ->
    @modal = new Backbone.Modal
      layout: layout
  afterEach ->
    @modal.remove()

  it.skip 'exist as a sys command', ->
    expect(@modal).to.be.an.instanceof Backbone.Modal

  it 'display a view', ->
    faked = new Faked
    @modal.display faked
    expect(@modal.$ '.content .sofaked').to.have.length 1

  describe 'should close when clik on', ->
    beforeEach ->
      @modal.display new Faked
      @spyClose = sinon.spy()
      @modal.on 'closed', @spyClose
    afterEach ->
      @modal.off 'closed', @spyClose

    it 'close not cross', ->
      @modal.$('.close').not('#closeCross').click()
      expect(@spyClose).to.have.been.calledOnce

    it 'close cross', ->
      @modal.$('#closeCross').click()
      expect(@spyClose).to.have.been.calledOnce

    it '.overlay', ->
      @modal.$('.overlay').trigger('click')
      expect(@spyClose).to.have.been.calledOnce

  describe 'with a timeout option', ->
    beforeEach ->
      @clock = sinon.useFakeTimers()
      @modal.display (new Faked), timeout: 3000
      @spyClose = sinon.spy()
      @modal.on 'closed', @spyClose

    afterEach ->
      @modal.off 'closed', @spyClose
      @clock.restore()

    describe 'when timeout is reach', ->
      beforeEach ->
        @clock.tick 3000

      it 'close', ->
        expect(@spyClose).to.have.been.calledOnce

    describe 'when clicking on a close', ->
      beforeEach ->
        @modal.$('.close').first().click()

      it '.close', ->
        expect(@spyClose).to.have.been.calledOnce

      describe 'when timeout is reach', ->
        beforeEach ->
          @clock.tick 4000

        it 'doesnt try to close again', ->
          expect(@spyClose).to.have.been.calledOnce

  describe 'when locked and timeouted', ->
    beforeEach ->
      @clock = sinon.useFakeTimers()
      @modal.display (new Faked), {timeout: 3000, lock: on}
      @spyClose = sinon.spy()
      @modal.on 'closed', @spyClose

    afterEach ->
      @modal.off 'closed', @spyClose
      @clock.restore()

    it 'display content', ->
      expect(@modal.$ '.content .sofaked').to.have.length 1

      it 'has no close cross', ->
        expect(@modal.$ '#closeCross').to.have.length 0

    it 'click on overlay is unaplicable', ->
      @modal.$('.overlay').trigger('click')
      expect(@spyClose).to.not.have.been.called

    describe 'when timeout is reach', ->
      beforeEach ->
        @clock.tick 3000

      it 'close', ->
        expect(@spyClose).to.have.been.calledOnce

  describe 'should not close when lock and click on', ->
    beforeEach ->
      @modal.display new Faked
      @spyClose = sinon.spy()
      @modal.lock()
      @modal.on 'closed', @spyClose
    afterEach ->
      @modal.off 'closed', @spyClose

    it 'has no close cross', ->
      expect(@modal.$ '#closeCross').to.have.length 0

    it '.overlay', ->
      @modal.$('.overlay').trigger('click')
      expect(@spyClose).to.not.have.been.called

  describe 'should not close when lock using options and click on', ->
    beforeEach ->
      @modal.display (new Faked), lock: on
      @spyClose = sinon.spy()
      @modal.on 'closed', @spyClose
    afterEach ->
      @modal.off 'closed', @spyClose

    it 'has no close cross', ->
      expect(@modal.$ '#closeCross').to.have.length 0

    it '.overlay', ->
      @modal.$('.overlay').trigger('click')
      expect(@spyClose).to.not.have.been.called

  describe 'when display a string', ->
    beforeEach ->
      @m = @modal.display fakeModal

    it 'display the string as content', ->
      expect(@modal.$ '.content .modaltpl').to.have.length 1

    describe 'when closing', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spyNot, @spy
        @m.close()

      it 'notify promise as failed', ->
        expect(@spy).to.have.been.calledOnce
        expect(@spyNot).to.not.have.been.called

  describe 'when notify a string', ->
    beforeEach ->
      @m = @modal.notify fakeModalConf

    it 'display the string as content', ->
      expect(@modal.$ '.content .modaltpl').to.have.length 1

    describe 'when closing', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spy, @spyNot
        @m.close()

      it 'resolve promise as ok', ->
        expect(@spy).to.have.been.calledOnce
        expect(@spyNot).to.not.have.been.called

    describe 'when confirm', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spy, @spyNot
        @m.$('.confirm').click()

      it 'resolve promise as ok', ->
        expect(@spy).to.have.been.calledOnce
        expect(@spyNot).to.not.have.been.called

  describe 'when confirm a string', ->
    beforeEach ->
      @m = @modal.confirm fakeModalConf

    it 'display the string as content', ->
      expect(@modal.$ '.content .modaltpl').to.have.length 1

    describe 'when closing', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spy, @spyNot
        @m.close()

      it 'resolve promise as not ok', ->
        expect(@spyNot).to.have.been.calledOnce
        expect(@spy).to.not.have.been.called

    describe 'when confirm', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spy, @spyNot
        @m.$('.confirm').click()

      it 'resolve promise as ok', ->
        expect(@spy).to.have.been.calledOnce
        expect(@spyNot).to.not.have.been.called

    describe 'when cancel', ->
      beforeEach ->
        @spy = sinon.spy()
        @spyNot = sinon.spy()
        @m.getPromise().then @spy, @spyNot
        @m.$('.cancel').click()

      it 'resolve promise as nok', ->
        expect(@spyNot).to.have.been.calledOnce
        expect(@spy).to.not.have.been.called
