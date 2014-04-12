class AlertSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @flashingInterval = null
    @currentMessage = ''
    @isFlashing = false
    @listener1 = null
    @listener2 = null

  showAlert: (message) =>
    @_stateTransition message, true

  stopFlashingAndKeepAlert: =>
    @_stateTransition @currentMessage, false

  stopFlashingAndHideAlert: =>
    @_stateTransition '', false

  _setMessageIsShowing: (isMessageShowing) =>
    classes = (@targetDiv.className || '').split(' ')
    if isMessageShowing
      classes.push('flashing') unless classes.indexOf('flashing') != -1
    else
      classes = _.without(classes, 'flashing')
    @targetDiv.className = classes.join(' ')

  _stateTransition: (newCurrentMessage, newIsFlashing) =>
    @currentMessage = newCurrentMessage
    @targetDiv.innerHTML = @currentMessage

    if @isFlashing
      if newIsFlashing
        # stay flashing
      else
        # stop flashing
        window.clearInterval @flashingInterval
        @_setMessageIsShowing true
        window.removeEventListener 'keydown', @listener1
        window.removeEventListener 'mousemove', @listener2
        @isFlashing = false
    else # i.e. if not @isFlashing
      if newIsFlashing
        # start flashing
        toggleRedBackground = =>
          classes = (@targetDiv.className || '').split(' ')
          isShowing = classes.indexOf('flashing') != -1
          @_setMessageIsShowing !isShowing
        @flashingInterval = window.setInterval toggleRedBackground, 1000
        @listener1 = window.addEventListener 'keydown', (e) =>
          @stopFlashingAndHideAlert()
        @listener2 = window.addEventListener 'mousemove', (e) =>
          @stopFlashingAndHideAlert()
        @isFlashing = true
      else
        # stay not flashing

  run: =>
    @_stateTransition '', false

module.exports = AlertSection
