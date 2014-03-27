IntentionComponent = require('./app/IntentionComponent.coffee')

[OKAY, LATE, ACKNOWLEDGED] = [1, 2, 3]

class IntentionSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @flashingInterval = null
    @flashingStatus = OKAY

    parseTime = (text) ->
      if text == ''
        null
      else if text.split(':').length > 1
        [h, m] = text.split(':')
        parseInt(h) * 60 + parseInt(m)
      else
        parseInt(text)
    @props =
      minutesSoFar: 0
      minutesEstimate: null
      isPaused: false
      doCommand: (command, args) =>
        switch command
          when 'set_minutes_so_far'
            @props.minutesSoFar = parseTime(args)
            @_updateFlashingStatus()
            @_render()
          when 'set_minutes_estimate'
            @props.minutesEstimate = parseTime(args)
            @_updateFlashingStatus()
            @_render()

  _render: =>
    React.renderComponent(IntentionComponent(@props), @targetDiv)

  _setRedBackground: (addRed) =>
    classes = (@targetDiv.className || '').split(' ')
    if addRed
      classes.push('flashing') unless classes.indexOf('flashing') != -1
    else
      classes = _.without(classes, 'flashing')
    @targetDiv.className = classes.join(' ')

  _updateFlashingStatus: =>
    toggleRedBackground = =>
      classes = (@targetDiv.className || '').split(' ')
      isFlashing = classes.indexOf('flashing') != -1
      @_setRedBackground !isFlashing
    if @props.isPaused
      @flashingStatus = OKAY
      @_setRedBackground false
    else if @props.minutesEstimate == null
      @flashingStatus = OKAY
      @_setRedBackground false
    else
      if @props.minutesSoFar <= @props.minutesEstimate
        if @flashingStatus != OKAY
          @flashingStatus = OKAY
          @_setRedBackground false
      else
        if @flashingStatus != LATE
          @flashingStatus = LATE
          @flashingInterval = window.setInterval toggleRedBackground, 1000

  run: =>
    everyMinute = =>
      if !@props.isPaused
        @props.minutesSoFar += 1
        @_updateFlashingStatus()
        @_render()
    window.setInterval everyMinute, 60 * 1000
    @_render()

    window.addEventListener 'keydown', (e) =>
      # stop flashing
      if @flashingStatus == LATE
        window.clearInterval @flashingInterval
        @_setRedBackground true
        @flashingStatus = ACKNOWLEDGED

  focus: =>
    @targetDiv.querySelector('.js-minutes-so-far').focus()

  togglePause: =>
    @props.isPaused = !@props.isPaused
    @_updateFlashingStatus()
    @_render()

  isWithinEstimate: =>
    @flashingStatus == OKAY && @props.minutesEstimate != null

module.exports = IntentionSection
