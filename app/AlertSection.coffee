_ = require('underscore')

class AlertSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @flashingInterval = null
    @isFlashing = false
    @listener1 = null
    @listener2 = null
    @currentAlerts = []

  addAlert: (message) =>
    newCurrentAlerts = _.union(@currentAlerts, message)
    @_stateTransition newCurrentAlerts

  removeAlert: (message) =>
    newCurrentAlerts = _.without(@currentAlerts, message)
    @_stateTransition newCurrentAlerts

  removeAllAlerts: =>
    @_stateTransition []

  _setMessageIsHighlighted: (isMessageShowing) =>
    classes = (@targetDiv.className || '').split(' ')
    if isMessageShowing
      classes.push('highlighted') unless classes.indexOf('highlighted') != -1
    else
      classes = _.without(classes, 'highlighted')
    @targetDiv.className = classes.join(' ')

  _stateTransition: (newCurrentAlerts) =>
    if newCurrentAlerts.length > 0
      newIsFlashing = true
      @targetDiv.innerHTML = newCurrentAlerts[0]
    else
      newIsFlashing = false
      @targetDiv.innerHTML = ''
    @currentAlerts = newCurrentAlerts

    if @isFlashing
      if newIsFlashing
        # stay flashing
      else
        # stop flashing
        window.clearInterval @flashingInterval
        @_setMessageIsHighlighted true
        window.removeEventListener 'keydown', @listener1
        window.removeEventListener 'mousemove', @listener2
        @isFlashing = false
    else # i.e. if not @isFlashing
      if newIsFlashing
        # start flashing
        toggleRedBackground = =>
          classes = (@targetDiv.className || '').split(' ')
          isHighlighted = classes.indexOf('highlighted') != -1
          @_setMessageIsHighlighted !isHighlighted
        @flashingInterval = window.setInterval toggleRedBackground, 1000
        @listener1 = window.addEventListener 'keydown', (e) =>
          window.removeEventListener 'keydown', @listener1
          window.removeEventListener 'mousemove', @listener2
          @removeAllAlerts()
        @listener2 = window.addEventListener 'mousemove', (e) =>
          window.removeEventListener 'keydown', @listener1
          window.removeEventListener 'mousemove', @listener2
          @removeAllAlerts()
        @isFlashing = true
      else
        # stay not flashing

  run: =>
    @_stateTransition []

module.exports = AlertSection
