ScheduleComponent = require('./app/ScheduleComponent.coffee')

class ScheduleSection
  constructor: (targetDiv) ->
    @targetDiv = targetDiv
  run: =>
    props =
      activitiesText: 'here'
      doCommand: (command, args) ->
        if command == 'change_activities'
          props.activitiesText = args
          render()
    render = =>
      React.renderComponent(ScheduleComponent(props), @targetDiv)
    render()

module.exports = ScheduleSection
