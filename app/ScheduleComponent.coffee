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

    activities = _.map @props.activitiesText.split(/\n/), (text) ->
      parts = text.split(' ')
      if text == ''
        # skip it
      else if parts[0].indexOf('-') == 0 # e.g. -2 means next available 2 hours
        name = parts[1...parts.length].join(' ')
        hourStart  = null
        hourFinish = -parseFloat(parts[0])
      else if parts[0].indexOf('-') > 0 # e.g. 8-9 means 8 a.m. - 9 a.m.
        name = parts[1...parts.length].join(' ')
        hourStart  = parseFloat(parts[0].split('-')[0])
        hourFinish = parseFloat(parts[0].split('-')[1])
      else if parseFloat(parts[0]) > 0 # e.g. 11 means 11 a.m. - default
        name = parts[1...parts.length].join(' ')
        hourStart = parseFloat(parts[0])
        hourFinish = hourStart + 0.5
      else # e.g. activity without time label
        name = text
        hourStart = null
        hourFinish = null
      { name, hourStart, hourFinish }

    attemptedStart = Math.ceil((@props.currentHour + 10/60) * 4) / 4
    _.forEach activities, (activity) ->
      if activity.hourStart == null
        foundTime = false
        while !foundTime
          foundTime = true
          attemptedFinish = attemptedStart + (activity.hourFinish || 0.4)
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

module.exports = ScheduleComponent
