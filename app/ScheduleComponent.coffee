_    = require('underscore')
type = React.PropTypes

ScheduleComponent = React.createClass

  displayName: 'ScheduleComponent'

  propTypes:
    activitiesText: type.string.isRequired
    doCommand:     type.func.isRequired

  getInitialState: ->
    textEdit: null

  render: ->
    { br, div, textarea } = React.DOM

    left_for_hour = (hour) ->
      ADJUST_RIGHT = 25
      PX_PER_HOUR = 47
      FIRST_HOUR = 7
      (hour - FIRST_HOUR) * PX_PER_HOUR + ADJUST_RIGHT

    activities = _.map @props.activitiesText.split(/, ?/), (text) ->
      parts = text.split(' ')
      if parts[0].indexOf('-') != -1
        hourStart  = parseFloat(parts[0].split('-')[0])
        hourFinish = parseFloat(parts[0].split('-')[1])
        name = parts[1...parts.length].join(' ')
      else if parseFloat(parts[0]) > 0
        name = parts[1...parts.length].join(' ')
        hourStart = parseFloat(parts[0])
        hourFinish = hourStart + 0.5
      else
        name = text
        hourStart = null
        hourFinish = null
      { name, hourStart, hourFinish }

    currentHour = (new Date()).getHours() + (new Date()).getMinutes() / 60
    attemptedStart = Math.ceil(currentHour * 4) / 4
    _.forEach activities, (activity) ->
      if activity.hourStart == null
        foundTime = false
        while !foundTime
          foundTime = true
          attemptedFinish = attemptedStart + 0.4
          _.forEach activities, (activity2) ->
            if activity2.hourStart != null
              if activity2.hourStart <= attemptedStart &&
                activity2.hourFinish > attemptedStart
                 foundTime = false
              if activity2.hourStart > attemptedFinish &&
                activity2.hourFinish <= attemptedFinish
                 foundTime = false
          if !foundTime
            attemptedStart += 0.25
        activity.hourStart = attemptedStart
        activity.hourFinish = attemptedFinish


    div { id: 'schedule', className: 'section', style: { position: 'relative' } },
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
              left_for_hour(activity.hourStart)
          activity.name
      br {}
      textarea
        value: @props.activitiesText
        onChange: (e) =>
          @props.doCommand 'change_activities', e.target.value

module.exports = ScheduleComponent
