_    = require('underscore')
type = React.PropTypes

BedtimeComponent = React.createClass

  displayName: 'BedtimeComponent'

  propTypes:
    timeHour:  type.number
    doCommand: type.func.isRequired

  getInitialState: ->
    timeEdit: null

  render: ->
    { br, div, input, textarea } = React.DOM

    formatTime = (hour) ->
      return '' if hour == null
      h = Math.floor(hour)
      m = (Math.floor(hour * 60) % 60).toString()
      m = "0#{m}" if m.length == 1
      "#{h}:#{m}"

    ifNull = (x, y) ->
      if x == null then y else x

    div
      id: 'bedtime'
      className: 'section'

      div { className: 'key-label' }, 'F4'
      br {}
      br {}

      'Bedtime:'
      input
        type: 'text'
        className: 'js-bedtime-time'
        value: ifNull(@state.timeEdit, formatTime(@props.timeHour))
        onChange: (e) =>
          @setState timeEdit: e.target.value
        onBlur: (e) =>
          @setState timeEdit: null
          @props.doCommand 'change_time', e.target.value

      br {}
      'Reason:'
      textarea
        className: 'js-bedtime-reason'
        value: @props.reason
        onChange: (e) =>
          @props.doCommand 'change_reason', e.target.value
        spellCheck: false

module.exports = BedtimeComponent
