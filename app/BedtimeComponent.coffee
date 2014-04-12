_    = require('underscore')
type = React.PropTypes

BedtimeComponent = React.createClass

  displayName: 'BedtimeComponent'

  propTypes:
    doCommand:      type.func.isRequired

  getInitialState: ->
    textEdit: null

  render: ->
    { br, div, textarea } = React.DOM

    div
      id: 'bedtime'
      className: 'section'

      div { className: 'key-label' }, 'F4'

module.exports = BedtimeComponent
