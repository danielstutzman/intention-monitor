_    = require('underscore')
type = React.PropTypes

IntentionComponent = React.createClass

  displayName: 'IntentionComponent'

  propTypes:
    minutesSoFar:    type.number
    minutesEstimate: type.number
    doCommand:       type.func.isRequired

  getInitialState: ->
    minutesSoFarEdit: null
    minutesEstimateEdit: null

  render: ->
    { button, br, div, dd, dl, dt, input, label, textarea } = React.DOM

    formatDuration = (minutes) ->
      return '' if minutes == null
      h = Math.floor(minutes / 60).toString()
      m = (minutes % 60).toString()
      m = "0#{m}" if m.length == 1
      "#{h}:#{m}"

    ifNull = (x, y) ->
      if x == null then y else x

    maybePaused =
      if @props.isPaused then 'paused' else ''

    div { className: "section #{maybePaused}" },
      div { className: 'key-label' }, 'F2'
      div { className: 'time' },
        input
          className: 'js-minutes-so-far'
          type: 'text'
          value: ifNull(@state.minutesSoFarEdit,
            formatDuration(@props.minutesSoFar))
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
            formatDuration(@props.minutesEstimate))
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
        '(stand to'
        br {}
        'web browse)'

      textarea defaultValue: ''

      div { className: 'pause-symbol' }, _.map([1..3], (i) -> div({ key: i }))

module.exports = IntentionComponent
