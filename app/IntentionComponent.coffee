_    = require('underscore')
type = React.PropTypes

IntentionComponent = React.createClass

  displayName: 'IntentionComponent'

  propTypes:
    hash:            type.object.isRequired
    minutesSoFar:    type.number.isRequired
    minutesEstimate: type.number.isRequired
    doCommand:       type.func.isRequired

  getInitialState: ->
    minutesSoFarEdit: null
    minutesEstimateEdit: null

  render: ->
    { button, br, div, dd, dl, dt, input, label, textarea } = React.DOM

    formatTime = (minutes) ->
      h = Math.floor(minutes / 60).toString()
      m = (minutes % 60).toString()
      m = "0#{m}" if m.length == 1
      "#{h}:#{m}"

    ifNull = (x, y) ->
      if x == null then y else x

    maybePaused =
      if @props.isPaused then 'paused' else ''

    div { className: "section #{maybePaused}" },
      div { className: 'time' },
        input
          type: 'text'
          value: ifNull(@state.minutesSoFarEdit,
            formatTime(@props.minutesSoFar))
          onBlur: (e) =>
            @setState minutesSoFarEdit: null
            @props.doCommand 'set_minutes_so_far', e.target.value
          onChange: (e) =>
            @setState minutesSoFarEdit: e.target.value
        br {}
        label {},
          'SO FAR'
        br {}
        input
          type: 'text'
          value: ifNull(@state.minutesEstimateEdit,
            formatTime(@props.minutesEstimate))
          onBlur: (e) =>
            @setState minutesEstimateEdit: null
            @props.doCommand 'set_minutes_estimate', e.target.value
          onChange: (e) =>
            @setState minutesEstimateEdit: e.target.value
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

      div { className: 'pause-symbol' }, [ div({}), div({}), div({}) ]

module.exports = IntentionComponent
