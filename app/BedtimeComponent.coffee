_    = require('underscore')
type = React.PropTypes

BedtimeComponent = React.createClass

  displayName: 'BedtimeComponent'

  propTypes:
    plan:                   type.string.isRequired
    planHighlightedLineNum: type.number.isRequired
    timeHour:               type.number
    doCommand:              type.func.isRequired

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

      textarea
        className: 'js-bedtime-plan'
        value: @props.plan
        onChange: (e) =>
          @props.doCommand 'change_plan', e.target.value
        spellCheck: false

      if @props.planHighlightedLineNum > 0
        div
          className: 'bedtime-plan-highlight'
          style:
            top: "#{@props.planHighlightedLineNum * 30 + 55}px"

module.exports = BedtimeComponent
