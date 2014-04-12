MorningComponent = require('./app/MorningComponent.coffee')

class MorningSection

  constructor: (targetDiv) ->
    @targetDiv = targetDiv
    @props =
      plan: "F4 schedule tonight's bedtime\n" +
        "F3 check fridge & schedule any cooking\n" +
        "F3 check calendar & schedule any events\n" +
        "F3 check email & schedule any todos\n" +
        "F3 schedule other major known todos\n"
      planHighlightedLineNum: 1 # 0 means no highlight
      doCommand: (command, args) =>
        if command == 'change_plan'
          @props.plan = args
          @_render()

  _render: () =>
    React.renderComponent(MorningComponent(@props), @targetDiv)

  run: =>
    @_render()

  focus: =>
    @targetDiv.querySelector('.js-morning-plan').focus()

  changePlanHighlightedLineNum: (delta) =>
    boundsCheck = (x, lower, upper) ->
      if x < lower then lower else if x > upper then upper else x
    @props.planHighlightedLineNum = boundsCheck(
      @props.planHighlightedLineNum + delta,
      0, @props.plan.split("\n").length - 1)
    @_render()

module.exports = MorningSection
