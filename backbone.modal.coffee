#= require mousetrap/mousetrap

Promise = $.Deferred

class SimpleText extends Backbone.View

  initialize: (options = {})->
    @content = options.content
    @promise = options.promise

  render: ->
    @$el.html @content
    @

# Custom modal.
#
# Features :
# - Layer
# - Close button (for modalised view with a promise options)
# - Handle backbone / tpl resource
class Backbone.Modal extends Backbone.View
  className: 'modal'

  events:
    'click .close': 'onClose'
    'click .cancel': 'onCanceled'
    'click .confirm': 'onConfirmed'
    'click .overlay': 'onClose'

  # @params options {object}
  # @params options.layout {function} rendering layout template callback
  initialize: (options)->
    @layout = options.layout

  # render a view inside the modalbox and open the modal.
  # @params view {BackBone.View || String}
  # @todo noop ?
  show: (v)->

  display: (content, options={})=>
    defaults =
      actAs:
        closed: 'reject'
    @open content, _.extend defaults, options

  notify: (content, options={})=>
    defaults =
      actAs:
        closed: 'resolve'
        confirmed: 'resolve'
    @open content, _.extend defaults, options

  confirm: (content, options={})=>
    defaults =
      actAs:
        closed: 'reject'
        canceled: 'reject'
        confirmed: 'resolve'
    @open content, _.extend defaults, options

  content: (view)->
    if view and view isnt @_view
      if _.isString view
        view = new SimpleText
          content: view
          promise: new Promise
      @_view?.remove()
      @_view = view
      if @$content
        @_view?.setElement @$content
    @_view

  eventActAs: (opts)->
    return unless @getPromise()?
    for name, order of opts
      @_view.listenTo @, name, @getPromise()?[order]
    @

  render: ->
    @$el.html @layout()
    @$close = @$ '.close'

    @$content = @$ '.content'
    if @$content isnt @content.$el
      @content()?.setElement @$content
    @content()?.render()
    @

  onCanceled: (event)->
    event?.preventDefault?()
    @canceled() unless @_lock
  canceled: ->
    @trigger 'canceled'
    @

  onConfirmed: (event)->
    event?.preventDefault?()
    @confirmed() unless @_lock
  confirmed: ->
    @trigger 'confirmed'
    @

  onClose: (event)->
    # be care, by using promise, event may be a model here
    event?.preventDefault?()
    @close() unless @_lock
  close: =>
    window.clearTimeout @_timeout if @_timeout?
    Mousetrap.unbind 'esc'
    @$el.hide()
    @trigger 'closed'
    @content()?.remove()
    @lock off
    @

  open: (content, options)=>
    @content content
    @eventActAs options.actAs
    @render()
    console.log options.lock
    @lock(options.lock? and options.lock)
    @$el.show()
    @adjustPosition()
    if options.timeout?
      @_timeout = window.setTimeout @close, options.timeout
    @trigger 'opened'
    @

  lock: (@_lock=on)->
    if @_lock
      @$close.remove()
      Mousetrap.unbind 'esc'
    else
      Mousetrap.bind 'esc', @close

  # @return current display promise (may be undefined)
  getPromise: ->
    @content()?.promise

  adjustPosition: ->
    @$('.modal-container').css 'top', ($('html').scrollTop() or $('body').scrollTop()) + 30
