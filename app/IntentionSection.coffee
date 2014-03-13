IntentionComponent = require('./app/IntentionComponent.coffee')

class IntentionSection
  constructor: (targetDiv) ->
    @targetDiv = targetDiv
  run: =>
    hash =
      now_i_will: 'code up mockups'
      goal:       'be recognized for my uniqueness'
      avoid:      'browsing Facebook or Reddit'
      difficulty: 'staying focused'
      done:       ''
    React.renderComponent(IntentionComponent(hash: hash), @targetDiv)

module.exports = IntentionSection
