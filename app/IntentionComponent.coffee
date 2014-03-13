_    = require('underscore')
type = React.PropTypes

IntentionComponent = React.createClass

  displayName: 'IntentionComponent'

  propTypes:
    hash: type.object.isRequired

  render: ->
    { button, br, div, dd, dl, dt, input, label, textarea } = React.DOM
    div { className: 'section' },
      div { className: 'time' },
        input { type: 'text', value: '0:15' }
        br {}
        label {},
          'SO FAR'
        br {}
        input { type: 'text', value: '0:15' }
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
        dl {},
          dt {},
            key.replace(/_/g, ' ')
          dd {},
            textarea {},
              value

module.exports = IntentionComponent
