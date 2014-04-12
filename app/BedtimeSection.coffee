BedtimeComponent = require('./app/BedtimeComponent.coffee')

class BedtimeSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv

  run: =>
    parseTimeInput = (text) ->
      if text.trim() == ''
        null
      else if parseInt(text) >= 100
        h = Math.floor(parseInt(text) / 100)
        m = parseInt(text) % 100
        h + (m / 60.0)
      else if text.split(':').length == 2
        h = parseInt(text.split(':')[0])
        m = parseInt(text.split(':')[1])
        h + (m / 60.0)
      else
        null
    props =
      timeHour: null
      doCommand: (command, args) ->
        if command == 'change_time'
          props.timeHour = parseTimeInput(args)
          console.log props
          render()
    render = =>
      React.renderComponent(BedtimeComponent(props), @targetDiv)
    render()

  focus: =>
    @targetDiv.querySelector('.js-bedtime-time').focus()

module.exports = BedtimeSection
