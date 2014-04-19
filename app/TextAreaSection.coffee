TextAreaComponent = require('./app/TextAreaComponent.coffee')

class TextAreaSection

  constructor: (keyLabel, sectionName, targetDiv, storage) ->
    @keyLabel    = keyLabel
    @sectionName = sectionName
    @targetDiv   = targetDiv
    @storage     = storage

  run: =>
    props =
      text: @storage.getItem(@sectionName) || ''
      keyLabel: @keyLabel
      sectionName: @sectionName
      doCommand: (command, args) =>
        if command == 'change_text'
          props.text = args
          @storage.setItem @sectionName, props.text
          render()
    render = =>
      React.renderComponent(TextAreaComponent(props), @targetDiv)
    render()

  focus: =>
    @targetDiv.querySelector('.js-text').focus()

module.exports = TextAreaSection
