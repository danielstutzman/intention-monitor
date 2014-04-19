_    = require('underscore')
type = React.PropTypes

TextAreaComponent = React.createClass

  displayName: 'TextAreaComponent'

  propTypes:
    keyLabel:    type.string.isRequired
    sectionName: type.string.isRequired
    text:        type.string.isRequired
    doCommand:   type.func.isRequired

  getInitialState: -> {}

  render: ->
    { br, div, textarea } = React.DOM

    div
      className: 'section'

      div
        className: 'key-label'
        "#{@props.keyLabel} #{@props.sectionName}"
      br {}
      textarea
        className: 'js-text'
        value: @props.text
        onChange: (e) =>
          @props.doCommand 'change_text', e.target.value
        spellCheck: false

module.exports = TextAreaComponent
