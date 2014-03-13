IntentionSection = React.createClass
  displayName: "IntentionSection"
  propTypes: {}
  render: ->
    { button, br, div, dd, dl, dt, input, label, textarea } = React.DOM
    div { className: 'section' },
      div { className: 'time' },
        input { type: 'text', value: '0:15' }
        br {}
        label {},
          'SO FAR'
        br {}
        input { type: 'text', value: '0:15' }
        br {}
        label {},
          'ESTIMATE'
        br {}
        br {}
        button {},
          'Pause'
        button {},
          'Eject'
    
      dl {},
        dt {},
          'Now I will'
        dd {},
          textarea {},
            'code up mockups'
      dl {},
        dt {},
          'Goal'
        dd {},
          textarea {},
            'be recognized for my uniqueness'
      dl {},
        dt {},
          'Avoid'
        dd {},
          textarea {},
            'browsing Facebook or Reddit'
      dl {},
        dt {},
          'Difficulty'
        dd {},
          textarea {},
            'staying focused'
      dl {},
        dt {},
          'Done'
        dd {},
          textarea {},
            ''

module.exports = IntentionSection
