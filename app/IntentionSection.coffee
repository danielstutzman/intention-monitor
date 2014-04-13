IntentionComponent = require('./app/IntentionComponent.coffee')

class IntentionSection

  constructor: (targetDiv, alertSection) ->
    @targetDiv = targetDiv
    @alertSection = alertSection

    parseTime = (text) ->
      if text.trim() == ''
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

  _updateFlashingStatus: =>
    if @props.minutesEstimate == null ||
       @props.minutesSoFar <= @props.minutesEstimate
      @alertSection.removeAlert 'over planned time limit'
    else
      @alertSection.addAlert 'over planned time limit'

  run: =>
    everyMinute = =>
      if @props.minutesEstimate != null
        @props.minutesSoFar += 1
        @_updateFlashingStatus()
        @_render()
    window.setInterval everyMinute, 60 * 1000
    @_render()

  focus: =>
    @targetDiv.querySelector('.js-minutes-so-far').focus()

  isWithinEstimate: =>
    @props.minutesEstimate != null &&
      @props.minutesSoFar <= @props.minutesEstimate

module.exports = IntentionSection
