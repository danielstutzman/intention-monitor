IntentionComponent = require('./app/IntentionComponent.coffee')

[OKAY, LATE, ACKNOWLEDGED] = [1, 2, 3]

class IntentionSection
  constructor: (targetDiv) ->
    @targetDiv = targetDiv
  run: =>
    parseTime = (text) ->
      if text.split(':').length > 1
        [h, m] = text.split(':')
        parseInt(h) * 60 + parseInt(m)
      else
        parseInt(text)
    setRedBackground = (addRed) =>
      classes = (@targetDiv.className || '').split(' ')
      if addRed
        classes.push('flashing')
      else
        classes = _.without(classes, 'flashing')
      @targetDiv.className = classes.join(' ')
    toggleRedBackground = =>
      classes = (@targetDiv.className || '').split(' ')
      isFlashing = classes.indexOf('flashing') != -1
      setRedBackground !isFlashing
    flashingInterval = null
    flashingStatus = OKAY
    props =
      hash:
        now_i_will: ''
        goal:       ''
        avoid:      ''
        difficulty: ''
        done:       ''
      minutesSoFar: 0
      minutesEstimate: 15
      doCommand: (command, args) ->
        switch command
          when 'set_minutes_so_far'
            props.minutesSoFar = parseTime(args)
            updateFlashingStatus()
            render()
          when 'set_minutes_estimate'
            props.minutesEstimate = parseTime(args)
            updateFlashingStatus()
            render()

    render = =>
      React.renderComponent(IntentionComponent(props), @targetDiv)
    updateFlashingStatus = ->
      if props.minutesSoFar <= props.minutesEstimate
        if flashingStatus != OKAY
          flashingStatus = OKAY
          setRedBackground false
      else
        if flashingStatus != LATE
          flashingStatus = LATE
          flashingInterval = window.setInterval toggleRedBackground, 1000
    everyMinute = ->
      props.minutesSoFar += 1
      updateFlashingStatus()
      render()
    window.setInterval everyMinute, 60 * 1000
    render()

    window.addEventListener 'keydown', (e) =>
      if flashingStatus == LATE
        window.clearInterval flashingInterval
        setRedBackground true

module.exports = IntentionSection
