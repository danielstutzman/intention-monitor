IntentionComponent = require('./app/IntentionComponent.coffee')

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
            render()
          when 'set_minutes_estimate'
            props.minutesEstimate = parseTime(args)
            render()
    render = =>
      React.renderComponent(IntentionComponent(props), @targetDiv)
    window.setInterval (-> props.minutesSoFar += 1; render()), 60 * 1000
    render()

module.exports = IntentionSection
