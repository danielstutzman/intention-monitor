BedtimeComponent = require('./app/BedtimeComponent.coffee')

class BedtimeSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv

  run: =>
    props =
      activitiesText: ''
      currentHour: null
      doCommand: (command, args) ->
        if command == 'change_activities'
          props.activitiesText = args
          render()
    render = =>
      React.renderComponent(BedtimeComponent(props), @targetDiv)
    render()

  focus: =>
    null

module.exports = BedtimeSection
