BedtimeComponent = require('./app/BedtimeComponent.coffee')

class BedtimeSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
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
        parseFloat(text)
    @props =
      timeHour: null
      doCommand: (command, args) =>
        if command == 'change_time'
          @props.timeHour = parseTimeInput(args)
          @_render()

  _render: () =>
    React.renderComponent(BedtimeComponent(@props), @targetDiv)

  run: =>
    @_render()

  focus: =>
    @targetDiv.querySelector('.js-bedtime-time').focus()

  isPastBedtime: =>
    currentHour = (new Date()).getHours() + (new Date()).getMinutes() / 60
    normalizeHour = (hour) ->
      if (hour < 4) then hour + 24 else hour
    @props.timeHour != null &&
      normalizeHour(currentHour) >= normalizeHour(@props.timeHour)

module.exports = BedtimeSection
