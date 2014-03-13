IntentionComponent = require('./app/IntentionComponent.coffee')

class IntentionSection
  constructor: (targetDiv) ->
    @targetDiv = targetDiv
  run: =>
    props =
      hash:
        now_i_will: ''
        goal:       ''
        avoid:      ''
        difficulty: ''
        done:       ''
      minutesSoFar: 0
      minutesEstimate: 15
    everyMinute = =>
      props.minutesSoFar += 1
      React.renderComponent(IntentionComponent(props), @targetDiv)
    window.setInterval everyMinute, 60 * 1000
    React.renderComponent(IntentionComponent(props), @targetDiv)

module.exports = IntentionSection
