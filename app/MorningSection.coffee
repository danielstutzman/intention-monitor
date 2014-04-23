MorningComponent = require('./app/MorningComponent.coffee')

class MorningSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @lastDayWithHighlightInit = null
    @props =
      plan: """
               NO FACEBOOK OR EMAIL OR NEWS until done:
               F3 check calendar & schedule any events
               F3 check emails/texts & schedule any todos
               respond to any time-critical emails/texts
               F3 check Things app & schedule any todos
               F3 check fridge & schedule any cooking
               eat breakfast
               5 min meditation
               cry
               shower
               """
      planHighlightedLineNum: 0 # 0 means no highlight, 1 means 1st line
      doCommand: (command, args) =>
        if command == 'change_plan'
          @props.plan = args
          @_render()

  _render: () =>
    React.renderComponent(MorningComponent(@props), @targetDiv)

  run: =>
    initHighlightIfNeeded = =>
      now = new Date()
      todaysDate = "#{now.getFullYear()}-#{now.getMonth()+1}-#{now.getDate()}"
      if @lastDayWithHighlightInit == null
        @lastDayWithHighlightInit = todaysDate
        # don't highlight morning tasks the first day the app was run
      else if @lastDayWithHighlightInit != todaysDate
        @lastDayWithHighlightInit = todaysDate
        if @props.planHighlightedLineNum == 0
          @props.planHighlightedLineNum = 1
          @_render()
    window.setInterval initHighlightIfNeeded, 3000
    @_render()

  focus: =>
    @targetDiv.querySelector('.js-morning-plan').focus()

  changePlanHighlightedLineNum: (delta) =>
    boundsCheck = (x, lower, upper) ->
      if x < lower then lower else if x > upper then upper else x
    @props.planHighlightedLineNum = boundsCheck(
      @props.planHighlightedLineNum + delta,
      0, @props.plan.split("\n").length)
    @_render()

  hasHighlightedLineNum: =>
    @props.planHighlightedLineNum > 0

module.exports = MorningSection
