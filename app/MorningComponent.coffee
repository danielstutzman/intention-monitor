_    = require('underscore')
type = React.PropTypes

MorningComponent = React.createClass

  displayName: 'MorningComponent'

  propTypes: {}

  getInitialState: -> {}

  render: ->
    { br, div, input, textarea } = React.DOM

    div
      id: 'morning'
      className: 'section'

      div { className: 'key-label' }, 'F1'

      textarea
        className: 'js-morning-plan'

module.exports = MorningComponent
