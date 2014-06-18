BedtimeComponent = require('./app/BedtimeComponent.coffee')

class BedtimeSection

  constructor: (targetDiv, storage) ->
    @targetDiv = targetDiv
    @storage = storage
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
      plan: @storage.getItem('BedtimeSection') || ''
      planHighlightedLineNum: 0 # 0 means no highlight, 1 means 1st line
      doCommand: (command, args) =>
        if command == 'change_time'
          @props.timeHour = parseTimeInput(args)
          @_render()
        else if command == 'change_plan'
          @props.plan = args
          @storage.setItem 'BedtimeSection', @props.plan
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

  changePlanHighlightedLineNum: (delta) =>
    boundsCheck = (x, lower, upper) ->
      if x < lower then lower else if x > upper then upper else x
    @props.planHighlightedLineNum = boundsCheck(
      @props.planHighlightedLineNum + delta,
      0, @props.plan.split("\n").length)
    @_render()

  hasHighlightedLineNum: =>
    @props.planHighlightedLineNum > 0

module.exports = BedtimeSection
