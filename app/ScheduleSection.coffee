ScheduleComponent = require('./app/ScheduleComponent.coffee')

class ScheduleSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv

  run: =>
    props =
      activitiesText: "10 breakfast\n12 lunch\n16.5 exercise\n18 dinner\n19 vclean\n20 pclean"
      currentHour: null
      doCommand: (command, args) ->
        if command == 'change_activities'
          props.activitiesText = args
          render()
    render = =>
      React.renderComponent(ScheduleComponent(props), @targetDiv)
    everyMinute = ->
      props.currentHour = (new Date()).getHours() + (new Date()).getMinutes() / 60
      render()
    window.setInterval everyMinute, 60 * 1000
    everyMinute()

  focus: =>
    @targetDiv.querySelector('.js-activities-text').focus()

module.exports = ScheduleSection
