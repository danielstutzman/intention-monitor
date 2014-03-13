_    = require('underscore')
type = React.PropTypes

IntentionComponent = React.createClass

  displayName: 'IntentionComponent'

  propTypes:
    hash:            type.object.isRequired
    minutesSoFar:    type.number.isRequired
    minutesEstimate: type.number.isRequired

  render: ->
    { button, br, div, dd, dl, dt, input, label, textarea } = React.DOM

    formatTime = (minutes) ->
      h = Math.floor(minutes / 60).toString()
      m = (minutes % 60).toString()
      m = "0#{m}" if m.length == 1
      "#{h}:#{m}"

    div { className: 'section' },
      div { className: 'time' },
        input
          type: 'text'
          value: formatTime(@props.minutesSoFar)
          readOnly: true
        br {}
        label {},
          'SO FAR'
        br {}
        input
          type: 'text'
          value: formatTime(@props.minutesEstimate)
          readOnly: true
        br {}
        label {},
          'ESTIMATE'
        br {}
        br {}
        button {},
          'Pause'
        button {},
          'Eject'

      _.map _.pairs(@props.hash), (key_value) ->
        [ key, value ] = key_value
        dl { key: key },
          dt {},
            key.replace(/_/g, ' ')
          dd {},
            textarea defaultValue: value

module.exports = IntentionComponent
