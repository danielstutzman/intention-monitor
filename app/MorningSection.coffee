MorningComponent = require('./app/MorningComponent.coffee')

class MorningSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @props = {}

  _render: () =>
    React.renderComponent(MorningComponent(@props), @targetDiv)

  run: =>
    @_render()

  focus: =>
    @targetDiv.querySelector('.js-morning-plan').focus()

module.exports = MorningSection
