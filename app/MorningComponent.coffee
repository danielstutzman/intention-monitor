_    = require('underscore')
type = React.PropTypes

MorningComponent = React.createClass

  displayName: 'MorningComponent'

  propTypes:
    plan:                   type.string.isRequired
    planHighlightedLineNum: type.number.isRequired
    doCommand:              type.func.isRequired

  getInitialState: -> {}

  render: ->
    { br, div, input, textarea } = React.DOM

    div
      id: 'morning'
      className: 'section'

      div { className: 'key-label' }, 'F1'

      textarea
        className: 'js-morning-plan'
        value: @props.plan
        onChange: (e) =>
          @props.doCommand 'change_plan', e.target.value

      if @props.planHighlightedLineNum > 0
        div
          className: 'morning-plan-highlight'
          style:
            top: "#{@props.planHighlightedLineNum * 30}px"

module.exports = MorningComponent
