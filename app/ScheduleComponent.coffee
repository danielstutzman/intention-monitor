_    = require('underscore')
type = React.PropTypes

ScheduleComponent = React.createClass

  displayName: 'ScheduleComponent'

  propTypes:
    activitiesText: type.string.isRequired
    doCommand:      type.func.isRequired
    currentHour:    type.number.isRequired

  getInitialState: ->
    textEdit: null

  render: ->
    { br, div, textarea } = React.DOM

    left_for_hour = (hour) ->
      ADJUST_RIGHT = 25
      PX_PER_HOUR = 47
      FIRST_HOUR = 7
      (hour - FIRST_HOUR) * PX_PER_HOUR + ADJUST_RIGHT

    activities = []
    for text in @props.activitiesText.split(/\n/)
      parts = text.split(' ')
      if parts[0].indexOf('-') > 0 # e.g. 8-9 means 8 a.m. - 9 a.m.
        name = parts[1...parts.length].join(' ')
        hourStart  = parseFloat(parts[0].split('-')[0])
        hourFinish = parseFloat(parts[0].split('-')[1])
        activities.push { name, hourStart, hourFinish }

    div
      id: 'schedule'
      className: 'section'
      style:
        position: 'relative'

      div { className: 'key-label' }, 'F3'
      br {}
      _.map [7..22], (hour) ->
        div { className: 'hour', key: hour },
          hour
      _.map activities, (activity, i) ->
        div
          key: i
          className: 'duration'
          style:
            left: left_for_hour(activity.hourStart)
            width: left_for_hour(activity.hourFinish) -
              left_for_hour(activity.hourStart) - 2
          activity.name
      if @props.currentHour <= 23 # prevent horizontal scroll bar
        div
          className: 'current-time'
          style:
            left: left_for_hour(@props.currentHour)
      br {}
      textarea
        className: 'js-activities-text'
        value: @props.activitiesText
        onChange: (e) =>
          @props.doCommand 'change_activities', e.target.value
        spellCheck: false

module.exports = ScheduleComponent
