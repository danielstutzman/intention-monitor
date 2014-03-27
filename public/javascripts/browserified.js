require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/IntentionComponent.coffee":[function(require,module,exports){
module.exports=require('YTn6Uo');
},{}],"YTn6Uo":[function(require,module,exports){
var IntentionComponent, type, _;

_ = require('underscore');

type = React.PropTypes;

IntentionComponent = React.createClass({
  displayName: 'IntentionComponent',
  propTypes: {
    minutesSoFar: type.number.isRequired,
    minutesEstimate: type.number.isRequired,
    doCommand: type.func.isRequired
  },
  getInitialState: function() {
    return {
      minutesSoFarEdit: null,
      minutesEstimateEdit: null
    };
  },
  render: function() {
    var br, button, dd, div, dl, dt, formatTime, ifNull, input, label, maybePaused, textarea, _ref,
      _this = this;
    _ref = React.DOM, button = _ref.button, br = _ref.br, div = _ref.div, dd = _ref.dd, dl = _ref.dl, dt = _ref.dt, input = _ref.input, label = _ref.label, textarea = _ref.textarea;
    formatTime = function(minutes) {
      var h, m;
      h = Math.floor(minutes / 60).toString();
      m = (minutes % 60).toString();
      if (m.length === 1) {
        m = "0" + m;
      }
      return "" + h + ":" + m;
    };
    ifNull = function(x, y) {
      if (x === null) {
        return y;
      } else {
        return x;
      }
    };
    maybePaused = this.props.isPaused ? 'paused' : '';
    return div({
      className: "section " + maybePaused
    }, div({
      className: 'key-label'
    }, 'F2'), div({
      className: 'time'
    }, input({
      className: 'js-minutes-so-far',
      type: 'text',
      value: ifNull(this.state.minutesSoFarEdit, formatTime(this.props.minutesSoFar)),
      onBlur: function(e) {
        _this.setState({
          minutesSoFarEdit: null
        });
        return _this.props.doCommand('set_minutes_so_far', e.target.value);
      },
      onChange: function(e) {
        return _this.setState({
          minutesSoFarEdit: e.target.value
        });
      }
    }), br({}), label({}, 'SO FAR'), br({}), input({
      type: 'text',
      value: ifNull(this.state.minutesEstimateEdit, formatTime(this.props.minutesEstimate)),
      onBlur: function(e) {
        _this.setState({
          minutesEstimateEdit: null
        });
        return _this.props.doCommand('set_minutes_estimate', e.target.value);
      },
      onChange: function(e) {
        return _this.setState({
          minutesEstimateEdit: e.target.value
        });
      }
    }), br({}), label({}, 'ESTIMATE')), textarea({
      defaultValue: ''
    }), div({
      className: 'pause-symbol'
    }, _.map([1, 2, 3], function(i) {
      return div({
        key: i
      });
    })));
  }
});

module.exports = IntentionComponent;


},{"underscore":"hXF8Wu"}],"Hgo3l8":[function(require,module,exports){
var ACKNOWLEDGED, IntentionComponent, IntentionSection, LATE, OKAY, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

IntentionComponent = require('./app/IntentionComponent.coffee');

_ref = [1, 2, 3], OKAY = _ref[0], LATE = _ref[1], ACKNOWLEDGED = _ref[2];

IntentionSection = (function() {
  function IntentionSection(targetDiv) {
    this.togglePause = __bind(this.togglePause, this);
    this.focus = __bind(this.focus, this);
    this.run = __bind(this.run, this);
    this._updateFlashingStatus = __bind(this._updateFlashingStatus, this);
    this._setRedBackground = __bind(this._setRedBackground, this);
    this._render = __bind(this._render, this);
    var parseTime,
      _this = this;
    this.targetDiv = targetDiv;
    this.flashingInterval = null;
    this.flashingStatus = OKAY;
    parseTime = function(text) {
      var h, m, _ref1;
      if (text.split(':').length > 1) {
        _ref1 = text.split(':'), h = _ref1[0], m = _ref1[1];
        return parseInt(h) * 60 + parseInt(m);
      } else {
        return parseInt(text);
      }
    };
    this.props = {
      minutesSoFar: 0,
      minutesEstimate: 15,
      isPaused: false,
      doCommand: function(command, args) {
        switch (command) {
          case 'set_minutes_so_far':
            _this.props.minutesSoFar = parseTime(args);
            _this._updateFlashingStatus();
            return _this._render();
          case 'set_minutes_estimate':
            _this.props.minutesEstimate = parseTime(args);
            _this._updateFlashingStatus();
            return _this._render();
        }
      }
    };
  }

  IntentionSection.prototype._render = function() {
    return React.renderComponent(IntentionComponent(this.props), this.targetDiv);
  };

  IntentionSection.prototype._setRedBackground = function(addRed) {
    var classes;
    classes = (this.targetDiv.className || '').split(' ');
    if (addRed) {
      if (classes.indexOf('flashing') === -1) {
        classes.push('flashing');
      }
    } else {
      classes = _.without(classes, 'flashing');
    }
    return this.targetDiv.className = classes.join(' ');
  };

  IntentionSection.prototype._updateFlashingStatus = function() {
    var toggleRedBackground,
      _this = this;
    toggleRedBackground = function() {
      var classes, isFlashing;
      classes = (_this.targetDiv.className || '').split(' ');
      isFlashing = classes.indexOf('flashing') !== -1;
      return _this._setRedBackground(!isFlashing);
    };
    if (this.props.isPaused) {
      return this._setRedBackground(false);
    } else {
      if (this.props.minutesSoFar <= this.props.minutesEstimate) {
        if (this.flashingStatus !== OKAY) {
          this.flashingStatus = OKAY;
          return this._setRedBackground(false);
        }
      } else {
        if (this.flashingStatus !== LATE) {
          this.flashingStatus = LATE;
          return this.flashingInterval = window.setInterval(toggleRedBackground, 1000);
        }
      }
    }
  };

  IntentionSection.prototype.run = function() {
    var everyMinute,
      _this = this;
    everyMinute = function() {
      if (!_this.props.isPaused) {
        _this.props.minutesSoFar += 1;
        _this._updateFlashingStatus();
        return _this._render();
      }
    };
    window.setInterval(everyMinute, 60 * 1000);
    this._render();
    return window.addEventListener('keydown', function(e) {
      if (_this.flashingStatus === LATE) {
        window.clearInterval(_this.flashingInterval);
        _this._setRedBackground(true);
        return _this.flashingStatus = ACKNOWLEDGED;
      }
    });
  };

  IntentionSection.prototype.focus = function() {
    return this.targetDiv.querySelector('.js-minutes-so-far').focus();
  };

  IntentionSection.prototype.togglePause = function() {
    this.props.isPaused = !this.props.isPaused;
    this._updateFlashingStatus();
    return this._render();
  };

  return IntentionSection;

})();

module.exports = IntentionSection;


},{"./app/IntentionComponent.coffee":"YTn6Uo"}],"./app/IntentionSection.coffee":[function(require,module,exports){
module.exports=require('Hgo3l8');
},{}],"jx/gF3":[function(require,module,exports){
var ScheduleComponent, type, _;

_ = require('underscore');

type = React.PropTypes;

ScheduleComponent = React.createClass({
  displayName: 'ScheduleComponent',
  propTypes: {
    activitiesText: type.string.isRequired,
    notesText: type.string.isRequired,
    doCommand: type.func.isRequired,
    currentHour: type.number.isRequired
  },
  getInitialState: function() {
    return {
      textEdit: null
    };
  },
  render: function() {
    var activities, attemptedStart, br, div, left_for_hour, textarea, _ref,
      _this = this;
    _ref = React.DOM, br = _ref.br, div = _ref.div, textarea = _ref.textarea;
    left_for_hour = function(hour) {
      var ADJUST_RIGHT, FIRST_HOUR, PX_PER_HOUR;
      ADJUST_RIGHT = 25;
      PX_PER_HOUR = 47;
      FIRST_HOUR = 7;
      return (hour - FIRST_HOUR) * PX_PER_HOUR + ADJUST_RIGHT;
    };
    activities = _.map(this.props.activitiesText.split(/\n/), function(text) {
      var hourFinish, hourStart, name, parts;
      parts = text.split(' ');
      if (text === '') {

      } else if (parts[0].indexOf('-') === 0) {
        name = parts.slice(1, parts.length).join(' ');
        hourStart = null;
        hourFinish = -parseFloat(parts[0]);
      } else if (parts[0].indexOf('-') > 0) {
        name = parts.slice(1, parts.length).join(' ');
        hourStart = parseFloat(parts[0].split('-')[0]);
        hourFinish = parseFloat(parts[0].split('-')[1]);
      } else if (parseFloat(parts[0]) > 0) {
        name = parts.slice(1, parts.length).join(' ');
        hourStart = parseFloat(parts[0]);
        hourFinish = hourStart + 0.5;
      } else {
        name = text;
        hourStart = null;
        hourFinish = null;
      }
      return {
        name: name,
        hourStart: hourStart,
        hourFinish: hourFinish
      };
    });
    attemptedStart = Math.ceil((this.props.currentHour + 10 / 60) * 4) / 4;
    _.forEach(activities, function(activity) {
      var attemptedFinish, foundTime;
      if (activity.hourStart === null) {
        foundTime = false;
        while (!foundTime) {
          foundTime = true;
          attemptedFinish = attemptedStart + (activity.hourFinish || 0.4);
          _.forEach(activities, function(activity2) {
            if (activity2.hourStart !== null) {
              if (activity2.hourStart <= attemptedStart && activity2.hourFinish > attemptedStart) {
                foundTime = false;
              }
              if (activity2.hourStart > attemptedFinish && activity2.hourFinish <= attemptedFinish) {
                return foundTime = false;
              }
            }
          });
          if (!foundTime) {
            attemptedStart += 0.25;
          }
        }
        activity.hourStart = attemptedStart;
        return activity.hourFinish = attemptedFinish;
      }
    });
    return div({
      id: 'schedule',
      className: 'section',
      style: {
        position: 'relative'
      }
    }, div({
      className: 'key-label'
    }, 'F3'), br({}), _.map([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], function(hour) {
      return div({
        className: 'hour',
        key: hour
      }, hour);
    }), _.map(activities, function(activity, i) {
      return div({
        key: i,
        className: 'duration',
        style: {
          left: left_for_hour(activity.hourStart),
          width: left_for_hour(activity.hourFinish) - left_for_hour(activity.hourStart) - 2
        }
      }, activity.name);
    }), div({
      className: 'current-time',
      style: {
        left: left_for_hour(this.props.currentHour)
      }
    }), br({}), textarea({
      className: 'js-activities-text',
      value: this.props.activitiesText,
      onChange: function(e) {
        return _this.props.doCommand('change_activities', e.target.value);
      }
    }));
  }
});

module.exports = ScheduleComponent;


},{"underscore":"hXF8Wu"}],"./app/ScheduleComponent.coffee":[function(require,module,exports){
module.exports=require('jx/gF3');
},{}],"./app/ScheduleSection.coffee":[function(require,module,exports){
module.exports=require('ErCXZV');
},{}],"ErCXZV":[function(require,module,exports){
var ScheduleComponent, ScheduleSection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ScheduleComponent = require('./app/ScheduleComponent.coffee');

ScheduleSection = (function() {
  function ScheduleSection(targetDiv) {
    this.focus = __bind(this.focus, this);
    this.run = __bind(this.run, this);
    this.targetDiv = targetDiv;
  }

  ScheduleSection.prototype.run = function() {
    var everyMinute, props, render,
      _this = this;
    props = {
      activitiesText: "10 breakfast\n12 lunch\n16.5 exercise\n18 dinner\n19 vclean\n20 pclean",
      currentHour: null,
      doCommand: function(command, args) {
        if (command === 'change_activities') {
          props.activitiesText = args;
          return render();
        }
      }
    };
    render = function() {
      return React.renderComponent(ScheduleComponent(props), _this.targetDiv);
    };
    everyMinute = function() {
      props.currentHour = (new Date()).getHours() + (new Date()).getMinutes() / 60;
      return render();
    };
    window.setInterval(everyMinute, 60 * 1000);
    return everyMinute();
  };

  ScheduleSection.prototype.focus = function() {
    return this.targetDiv.querySelector('.js-activities-text').focus();
  };

  return ScheduleSection;

})();

module.exports = ScheduleSection;


},{"./app/ScheduleComponent.coffee":"jx/gF3"}],"react":[function(require,module,exports){
module.exports=require('hk3hw+');
},{}],"hk3hw+":[function(require,module,exports){
module.exports = window.React;

},{}],"underscore":[function(require,module,exports){
module.exports=require('hXF8Wu');
},{}],"hXF8Wu":[function(require,module,exports){
module.exports = window._;

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsL2Rldi9pbnRlbnRpb24tbW9uaXRvci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2RhbmllbC9kZXYvaW50ZW50aW9uLW1vbml0b3IvYXBwL0ludGVudGlvbkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsL2Rldi9pbnRlbnRpb24tbW9uaXRvci9hcHAvSW50ZW50aW9uU2VjdGlvbi5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsL2Rldi9pbnRlbnRpb24tbW9uaXRvci9hcHAvU2NoZWR1bGVDb21wb25lbnQuY29mZmVlIiwiL1VzZXJzL2RhbmllbC9kZXYvaW50ZW50aW9uLW1vbml0b3IvYXBwL1NjaGVkdWxlU2VjdGlvbi5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsL2Rldi9pbnRlbnRpb24tbW9uaXRvci9hcHAvc2hpbXMvcmVhY3QuanMiLCIvVXNlcnMvZGFuaWVsL2Rldi9pbnRlbnRpb24tbW9uaXRvci9hcHAvc2hpbXMvdW5kZXJzY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBQSx1QkFBQTs7QUFBQSxDQUFBLEVBQU8sSUFBQSxLQUFBOztBQUNQLENBREEsRUFDTyxDQUFQLENBQVksSUFEWjs7QUFHQSxDQUhBLEVBR3FCLEVBQUssTUFBTCxPQUFyQjtDQUVFLENBQUEsU0FBQSxTQUFBO0NBQUEsQ0FFQSxPQUFBO0NBQ0UsQ0FBaUIsRUFBakIsRUFBNEIsSUFBNUIsRUFBQTtDQUFBLENBQ2lCLEVBQWpCLEVBQTRCLElBRDVCLEtBQ0E7Q0FEQSxDQUVpQixFQUFqQixLQUFBLENBRkE7SUFIRjtDQUFBLENBT0EsQ0FBaUIsTUFBQSxNQUFqQjtXQUNFO0NBQUEsQ0FBa0IsRUFBbEIsRUFBQSxVQUFBO0NBQUEsQ0FDcUIsRUFEckIsRUFDQSxhQUFBO0NBRmU7Q0FQakIsRUFPaUI7Q0FQakIsQ0FXQSxDQUFRLEdBQVIsR0FBUTtDQUNOLE9BQUEsa0ZBQUE7T0FBQSxLQUFBO0NBQUEsQ0FBRSxDQUFGLENBQUEsQ0FBK0QsQ0FBL0QsQ0FBMEQsQ0FBMUQ7Q0FBQSxFQUVhLENBQWIsR0FBYSxFQUFDLENBQWQ7Q0FDRSxHQUFBLE1BQUE7Q0FBQSxDQUFJLENBQUEsQ0FBSSxDQUFKLENBQUosQ0FBZSxDQUFYO0NBQUosQ0FDSSxDQUFBLEdBQUosQ0FBSyxDQUFEO0NBQ0osR0FBZSxDQUFZLENBQTNCO0NBQUEsRUFBSyxLQUFMO1FBRkE7Q0FHQSxDQUFBLENBQUUsVUFBRjtDQU5GLElBRWE7Q0FGYixDQVFhLENBQUosQ0FBVCxFQUFBLEdBQVU7Q0FDUixHQUFHLENBQUssQ0FBUjtDQUFBLGNBQWtCO01BQWxCLEVBQUE7Q0FBQSxjQUF5QjtRQURsQjtDQVJULElBUVM7Q0FSVCxDQUFBLENBWUssQ0FETCxDQUNXLEdBQVQsR0FERjtDQUdJLEVBQUosUUFBQTtDQUFJLENBQWMsQ0FBUyxHQUFyQixHQUFBLENBQVksQ0FBZDtDQUNFLENBQUosQ0FBQSxHQURGO0NBQ00sQ0FBYSxJQUFYLEdBQUEsRUFBRjtDQUROLENBQ2tDLENBQ2hDLENBREEsRUFBQTtDQUNJLENBQWEsSUFBWCxHQUFBO0NBRUYsQ0FERixHQUFBLENBREY7Q0FFSSxDQUFXLElBQVgsR0FBQSxVQUFBO0NBQUEsQ0FDTSxFQUFOLEVBQUE7Q0FEQSxDQUVPLEVBQVEsQ0FBZixDQUFBLElBQ0UsRUFBQSxJQURLO0NBRlAsQ0FJUSxDQUFBLEdBQVIsR0FBUztDQUNQLElBQUMsR0FBRDtDQUFVLENBQWtCLEVBQWxCLE1BQUEsTUFBQTtDQUFWLFNBQUE7Q0FDQyxDQUFzQyxHQUF0QyxDQUE4QyxHQUEvQyxNQUFBLEtBQUE7Q0FORixNQUlRO0NBSlIsQ0FPVSxDQUFBLEdBQVYsRUFBQSxDQUFXO0NBQ1IsSUFBQSxHQUFELE9BQUE7Q0FBVSxDQUFrQixHQUFsQixDQUEwQixJQUExQixNQUFBO0NBREYsU0FDUjtDQVJGLE1BT1U7Q0FUZCxDQVdFLEdBQ0EsQ0FYQSxFQVdBO0NBSUUsQ0FBTSxFQUFOLEVBQUE7Q0FBQSxDQUNPLEVBQVEsQ0FBZixDQUFBLElBQ0UsS0FBQSxJQURLO0NBRFAsQ0FHUSxDQUFBLEdBQVIsR0FBUztDQUNQLElBQUMsR0FBRDtDQUFVLENBQXFCLEVBQXJCLE1BQUEsU0FBQTtDQUFWLFNBQUE7Q0FDQyxDQUF3QyxHQUF4QyxDQUFnRCxHQUFqRCxNQUFBLE9BQUE7Q0FMRixNQUdRO0NBSFIsQ0FNVSxDQUFBLEdBQVYsRUFBQSxDQUFXO0NBQ1IsSUFBQSxHQUFELE9BQUE7Q0FBVSxDQUFxQixHQUFyQixDQUE2QixJQUE3QixTQUFBO0NBREYsU0FDUjtDQVBGLE1BTVU7Q0F0QmQsQ0F3QkUsR0FDQSxDQVZBLEVBYUYsRUFIRTtDQUdPLENBQWMsSUFBZCxNQUFBO0NBOUJYLENBZ0NFLENBQUEsR0FGQTtDQUVJLENBQWEsSUFBWCxHQUFBLEtBQUY7Q0FBZ0MsQ0FBRCxDQUFBLEdBQW5DLEdBQW1DO0NBQXlCLEVBQUosVUFBQTtDQUFJLENBQU8sQ0FBTCxLQUFBO0NBQWIsT0FBTztDQUFyQixJQUFjO0NBMURyRCxFQVdRO0NBaEJWLENBR3FCOztBQThEckIsQ0FqRUEsRUFpRWlCLEdBQVgsQ0FBTixXQWpFQTs7OztBQ0FBLElBQUEsZ0VBQUE7R0FBQSwrRUFBQTs7QUFBQSxDQUFBLEVBQXFCLElBQUEsV0FBckIsZUFBcUI7O0FBRXJCLENBRkEsQ0FFaUMsS0FBSjs7QUFFdkIsQ0FKTjtDQU1lLENBQUEsQ0FBQSxNQUFBLGlCQUFDO0NBQ1osZ0RBQUE7Q0FBQSxvQ0FBQTtDQUFBLGdDQUFBO0NBQUEsb0VBQUE7Q0FBQSw0REFBQTtDQUFBLHdDQUFBO0NBQUEsT0FBQSxDQUFBO09BQUEsS0FBQTtDQUFBLEVBQWEsQ0FBYixLQUFBO0NBQUEsRUFDb0IsQ0FBcEIsWUFBQTtDQURBLEVBRWtCLENBQWxCLFVBQUE7Q0FGQSxFQUlZLENBQVosS0FBQTtDQUNFLFNBQUEsQ0FBQTtDQUFBLEVBQUcsQ0FBQSxDQUFBLENBQUg7Q0FDRSxDQUFDLENBQVEsQ0FBSSxDQUFKLEdBQVQ7Q0FDUyxDQUFULENBQWMsS0FBZCxPQUFBO01BRkYsRUFBQTtDQUlXLEdBQVQsSUFBQSxPQUFBO1FBTFE7Q0FKWixJQUlZO0NBSlosRUFXRSxDQURGLENBQUE7Q0FDRSxDQUFjLElBQWQsTUFBQTtDQUFBLENBQ2lCLElBQWpCLFNBQUE7Q0FEQSxDQUVVLEdBRlYsQ0FFQSxFQUFBO0NBRkEsQ0FHVyxDQUFBLENBQUEsRUFBWCxDQUFXLEVBQVg7Q0FDRSxNQUFBLFNBQU87Q0FBUCxjQUNPLEtBRFA7Q0FFSSxFQUFzQixDQUFBLENBQXJCLElBQXFCLEdBQXRCO0NBQUEsSUFDQyxPQUFELFNBQUE7Q0FDQyxJQUFBLEVBQUQsWUFBQTtDQUpKLGNBS08sT0FMUDtDQU1JLEVBQXlCLENBQUEsQ0FBeEIsSUFBd0IsR0FBekIsR0FBQTtDQUFBLElBQ0MsT0FBRCxTQUFBO0NBQ0MsSUFBQSxFQUFELFlBQUE7Q0FSSixRQURTO0NBSFgsTUFHVztDQWZGLEtBQ1g7Q0FERixFQUFhOztDQUFiLEVBMEJTLElBQVQsRUFBUztDQUNELENBQTRDLEVBQVIsQ0FBckMsSUFBTCxFQUFBLElBQUEsR0FBc0I7Q0EzQnhCLEVBMEJTOztDQTFCVCxFQTZCbUIsR0FBQSxHQUFDLFFBQXBCO0NBQ0UsTUFBQSxDQUFBO0NBQUEsQ0FBVSxDQUFBLENBQVYsQ0FBVSxFQUFWLEVBQXFCO0NBQ3JCLEdBQUEsRUFBQTtBQUNrRSxDQUFoRSxHQUFnQyxDQUErQixDQUEvRCxDQUF1QyxHQUFQO0NBQWhDLEdBQUEsR0FBTyxDQUFQLEVBQUE7UUFERjtNQUFBO0NBR0UsQ0FBNkIsQ0FBbkIsR0FBVixDQUFBLEdBQVU7TUFKWjtDQUtDLEVBQXNCLENBQXRCLEdBQTZCLEVBQXBCLEVBQVY7Q0FuQ0YsRUE2Qm1COztDQTdCbkIsRUFxQ3VCLE1BQUEsWUFBdkI7Q0FDRSxPQUFBLFdBQUE7T0FBQSxLQUFBO0NBQUEsRUFBc0IsQ0FBdEIsS0FBc0IsVUFBdEI7Q0FDRSxTQUFBLFNBQUE7Q0FBQSxDQUFVLENBQUEsQ0FBeUIsQ0FBdkIsQ0FBWixDQUFBLEVBQXFCO0FBQ3dCLENBRDdDLEVBQ2EsRUFBK0IsQ0FBNUMsQ0FBb0IsR0FBcEI7QUFDb0IsQ0FBbkIsSUFBQSxLQUFELEdBQUEsSUFBQTtDQUhGLElBQXNCO0NBSXRCLEdBQUEsQ0FBUyxHQUFUO0NBQ0csR0FBQSxDQUFELFFBQUEsSUFBQTtNQURGO0NBR0UsR0FBRyxDQUFNLENBQVQsTUFBRyxHQUFIO0NBQ0UsR0FBRyxDQUFtQixHQUF0QixNQUFHO0NBQ0QsRUFBa0IsQ0FBakIsTUFBRCxJQUFBO0NBQ0MsR0FBQSxDQUFELFlBQUE7VUFISjtNQUFBLEVBQUE7Q0FLRSxHQUFHLENBQW1CLEdBQXRCLE1BQUc7Q0FDRCxFQUFrQixDQUFqQixNQUFELElBQUE7Q0FDQyxDQUEyRCxDQUF4QyxDQUFuQixFQUF5QixLQUFOLEtBQXBCLENBQUEsRUFBb0I7VUFQeEI7UUFIRjtNQUxxQjtDQXJDdkIsRUFxQ3VCOztDQXJDdkIsRUFzREEsTUFBSztDQUNILE9BQUEsR0FBQTtPQUFBLEtBQUE7Q0FBQSxFQUFjLENBQWQsS0FBYyxFQUFkO0FBQ00sQ0FBSixHQUFHLENBQUUsQ0FBTCxFQUFBO0NBQ0UsR0FBdUIsQ0FBdEIsR0FBRCxJQUFBO0NBQUEsSUFDQyxHQUFELGFBQUE7Q0FDQyxJQUFBLEVBQUQsUUFBQTtRQUpVO0NBQWQsSUFBYztDQUFkLENBS2dDLENBQUssQ0FBckMsRUFBTSxLQUFOO0NBTEEsR0FNQSxHQUFBO0NBRU8sQ0FBNEIsQ0FBQSxHQUE3QixHQUFOLEVBQUEsS0FBQTtDQUVFLEdBQUcsQ0FBQyxDQUFKLFFBQUc7Q0FDRCxJQUFzQixDQUFoQixFQUFOLEtBQUEsR0FBQTtDQUFBLEdBQ0EsQ0FBQyxHQUFELFNBQUE7Q0FDQyxFQUFpQixFQUFqQixTQUFELENBQUE7UUFMK0I7Q0FBbkMsSUFBbUM7Q0EvRHJDLEVBc0RLOztDQXRETCxFQXNFTyxFQUFQLElBQU87Q0FDSixHQUFBLENBQUQsSUFBVSxFQUFWLEVBQUEsT0FBQTtDQXZFRixFQXNFTzs7Q0F0RVAsRUF5RWEsTUFBQSxFQUFiO0FBQ3FCLENBQW5CLEVBQWtCLENBQWxCLENBQU0sR0FBTjtDQUFBLEdBQ0EsaUJBQUE7Q0FDQyxHQUFBLEdBQUQsSUFBQTtDQTVFRixFQXlFYTs7Q0F6RWI7O0NBTkY7O0FBb0ZBLENBcEZBLEVBb0ZpQixHQUFYLENBQU4sU0FwRkE7Ozs7OztBQ0FBLElBQUEsc0JBQUE7O0FBQUEsQ0FBQSxFQUFPLElBQUEsS0FBQTs7QUFDUCxDQURBLEVBQ08sQ0FBUCxDQUFZLElBRFo7O0FBR0EsQ0FIQSxFQUdvQixFQUFLLE1BQUwsTUFBcEI7Q0FFRSxDQUFBLFNBQUEsUUFBQTtDQUFBLENBRUEsT0FBQTtDQUNFLENBQWdCLEVBQWhCLEVBQTJCLElBQTNCLElBQUE7Q0FBQSxDQUNnQixFQUFoQixFQUEyQixHQUEzQixDQURBO0NBQUEsQ0FFZ0IsRUFBaEIsS0FBQSxDQUZBO0NBQUEsQ0FHZ0IsRUFBaEIsRUFBMkIsSUFIM0IsQ0FHQTtJQU5GO0NBQUEsQ0FRQSxDQUFpQixNQUFBLE1BQWpCO1dBQ0U7Q0FBQSxDQUFVLEVBQVYsRUFBQSxFQUFBO0NBRGU7Q0FSakIsRUFRaUI7Q0FSakIsQ0FXQSxDQUFRLEdBQVIsR0FBUTtDQUNOLE9BQUEsMERBQUE7T0FBQSxLQUFBO0NBQUEsQ0FBRSxDQUFGLENBQUEsQ0FBNkIsRUFBTCxDQUF4QjtDQUFBLEVBRWdCLENBQWhCLEtBQWlCLElBQWpCO0NBQ0UsU0FBQSwyQkFBQTtDQUFBLENBQUEsQ0FBZSxHQUFmLE1BQUE7Q0FBQSxDQUFBLENBQ2MsR0FBZCxLQUFBO0NBREEsRUFFYSxHQUFiLElBQUE7Q0FDQyxFQUFPLENBQVAsTUFBRCxDQUFBLEVBQUE7Q0FORixJQUVnQjtDQUZoQixDQVFzRCxDQUF6QyxDQUFiLENBQXlCLElBQThCLENBQXZELElBQXdDO0NBQ3RDLFNBQUEsd0JBQUE7Q0FBQSxFQUFRLENBQUksQ0FBWixDQUFBO0NBQ0EsQ0FBQSxFQUFHLENBQVEsQ0FBWDtDQUFBO0NBRWMsRUFBTixDQUFBLENBQU0sQ0FGZCxDQUVRLENBRlI7Q0FHRSxFQUFPLENBQVAsQ0FBYSxHQUFiLGVBQThCO0NBQTlCLEVBQ2EsQ0FEYixJQUNBLENBQUE7QUFDYyxDQUZkLEVBRWEsRUFBa0IsR0FBL0IsRUFBQTtDQUNZLEVBQU4sQ0FBQSxDQUFNLENBTmQsQ0FNUSxDQU5SO0NBT0UsRUFBTyxDQUFQLENBQWEsR0FBYixlQUE4QjtDQUE5QixFQUNhLEVBQWlCLEdBQTlCLENBQUEsQ0FBYTtDQURiLEVBRWEsRUFBaUIsR0FBOUIsRUFBQTtDQUNpQixFQUFZLENBQXZCLENBQWlCLENBVnpCLEVBQUEsRUFVUTtDQUNOLEVBQU8sQ0FBUCxDQUFhLEdBQWIsZUFBOEI7Q0FBOUIsRUFDWSxFQUFpQixHQUE3QixDQUFBLENBQVk7Q0FEWixFQUVhLEtBQWIsQ0FBYSxDQUFiO01BYkYsRUFBQTtDQWVFLEVBQU8sQ0FBUCxJQUFBO0NBQUEsRUFDWSxDQURaLElBQ0EsQ0FBQTtDQURBLEVBRWEsQ0FGYixJQUVBLEVBQUE7UUFsQkY7YUFtQkE7Q0FBQSxDQUFFLEVBQUYsSUFBRTtDQUFGLENBQVEsTUFBQSxDQUFSO0NBQUEsQ0FBbUIsTUFBQSxFQUFuQjtDQXBCb0Q7Q0FBekMsSUFBeUM7Q0FSdEQsQ0E4QmlELENBQWhDLENBQWpCLENBQWtDLE1BQU4sR0FBNUI7Q0E5QkEsQ0ErQnNCLENBQUEsQ0FBdEIsR0FBQSxDQUFzQixDQUFDLENBQXZCO0NBQ0UsU0FBQSxnQkFBQTtDQUFBLEdBQUcsQ0FBc0IsQ0FBekIsRUFBVyxDQUFSO0NBQ0QsRUFBWSxFQUFaLEdBQUEsQ0FBQTtBQUNPLENBQVAsRUFBQSxNQUFBLE1BQU07Q0FDSixFQUFZLENBQVosS0FBQSxDQUFBO0NBQUEsRUFDa0IsQ0FBeUMsSUFBZixFQUE1QyxJQUFrQixDQUFsQjtDQURBLENBRXNCLENBQUEsSUFBdEIsRUFBdUIsQ0FBdkI7Q0FDRSxHQUFHLENBQXVCLElBQWQsR0FBWjtDQUNFLEVBQ3lCLENBRHRCLEtBQVMsQ0FDVixJQURGO0NBRUcsRUFBWSxFQUFaLElBQUEsT0FBQTtnQkFGSDtDQUdBLEVBQXlCLENBQXRCLEtBQVMsQ0FDVixJQURGLENBQUc7Q0FBSCxFQUVlLE1BQVosY0FBQTtnQkFOTDtjQURvQjtDQUF0QixVQUFzQjtBQVFsQixDQUFKLEdBQUcsS0FBSCxDQUFBO0NBQ0UsR0FBa0IsUUFBbEIsRUFBQTtZQVpKO0NBREEsUUFDQTtDQURBLEVBY3FCLEtBQXJCLENBQUEsS0FkQTtDQWVTLEVBQWEsS0FBZCxFQUFSLEtBQUE7UUFqQmtCO0NBQXRCLElBQXNCO0NBcUJwQixFQURGLFFBQUE7Q0FDRSxDQUFBLElBQUEsSUFBQTtDQUFBLENBQ1csSUFBWCxHQUFBO0NBREEsQ0FHRSxHQURGLENBQUE7Q0FDRSxDQUFVLE1BQVYsRUFBQTtRQUhGO0NBS0ksQ0FBSixDQUFBLEdBTkY7Q0FNTSxDQUFhLElBQVgsR0FBQSxFQUFGO0NBTk4sQ0FNa0MsQ0FFaEMsQ0FGQSxFQUFBLEdBRWdCLG9EQUFoQjtDQUNNLEVBQUosVUFBQTtDQUFJLENBQWEsSUFBYixFQUFFLENBQUE7Q0FBRixDQUEwQixDQUFMLENBQXJCLElBQXFCO0NBRFosQ0FFWCxFQURGLElBQUE7Q0FERixDQUdBLENBQUEsRUFIZSxHQUdHLENBQUMsQ0FBbkI7Q0FFSSxFQURGLFVBQUE7Q0FDRSxDQUFLLENBQUwsS0FBQTtDQUFBLENBQ1csTUFBWCxDQUFBLENBREE7Q0FBQSxDQUdFLEdBREYsR0FBQTtDQUNFLENBQU0sRUFBTixJQUE0QixDQUF0QixDQUFOLEdBQU07Q0FBTixDQUNPLENBQ0wsRUFERixHQUE2QixDQUMzQixDQURGLEdBQU87VUFKVDtDQU1TLENBQVQsRUFQRixJQUFBO0NBREYsQ0FTQSxDQUFBLEVBVGtCO0NBVWhCLENBQVcsSUFBWCxHQUFBLEtBQUE7Q0FBQSxDQUVFLEdBREYsQ0FBQTtDQUNFLENBQU0sRUFBTixDQUEwQixHQUExQixHQUFNLEVBQUE7UUFGUjtDQXJCSixDQXdCRSxJQUpBLEVBS0E7Q0FDRSxDQUFXLElBQVgsR0FBQSxXQUFBO0NBQUEsQ0FDTyxFQUFDLENBQVIsQ0FBQSxRQURBO0NBQUEsQ0FFVSxDQUFBLEdBQVYsRUFBQSxDQUFXO0NBQ1IsQ0FBcUMsR0FBckMsQ0FBNkMsR0FBOUMsTUFBQSxJQUFBO0NBSEYsTUFFVTtDQTVCZCxLQXlCRTtDQXhGSixFQVdRO0NBaEJWLENBR29COztBQWdHcEIsQ0FuR0EsRUFtR2lCLEdBQVgsQ0FBTixVQW5HQTs7Ozs7Ozs7QUNBQSxJQUFBLDhCQUFBO0dBQUEsK0VBQUE7O0FBQUEsQ0FBQSxFQUFvQixJQUFBLFVBQXBCLGVBQW9COztBQUVkLENBRk47Q0FJZSxDQUFBLENBQUEsTUFBQSxnQkFBQztDQUNaLG9DQUFBO0NBQUEsZ0NBQUE7Q0FBQSxFQUFhLENBQWIsS0FBQTtDQURGLEVBQWE7O0NBQWIsRUFHQSxNQUFLO0NBQ0gsT0FBQSxrQkFBQTtPQUFBLEtBQUE7Q0FBQSxFQUNFLENBREYsQ0FBQTtDQUNFLENBQWdCLElBQWhCLFFBQUEsMERBQUE7Q0FBQSxDQUNhLEVBRGIsRUFDQSxLQUFBO0NBREEsQ0FFVyxDQUFBLENBQUEsRUFBWCxDQUFXLEVBQVg7Q0FDRSxHQUFHLENBQVcsRUFBWCxDQUFILFdBQUE7Q0FDRSxFQUF1QixDQUF2QixDQUFLLEtBQUwsSUFBQTtDQUNBLEtBQUEsV0FBQTtVQUhPO0NBRlgsTUFFVztDQUhiLEtBQUE7Q0FBQSxFQU9TLENBQVQsRUFBQSxHQUFTO0NBQ0QsQ0FBMEMsR0FBM0MsSUFBTCxJQUFBLEVBQUEsRUFBc0I7Q0FSeEIsSUFPUztDQVBULEVBU2MsQ0FBZCxLQUFjLEVBQWQ7Q0FDRSxDQUFBLENBQW9CLENBQUssQ0FBcEIsQ0FBTCxFQUFvQixFQUEwQixDQUE5QztDQUNBLEtBQUEsT0FBQTtDQVhGLElBU2M7Q0FUZCxDQVlnQyxDQUFLLENBQXJDLEVBQU0sS0FBTjtDQUNBLFVBQUE7Q0FqQkYsRUFHSzs7Q0FITCxFQW1CTyxFQUFQLElBQU87Q0FDSixHQUFBLENBQUQsSUFBVSxFQUFWLEVBQUEsUUFBQTtDQXBCRixFQW1CTzs7Q0FuQlA7O0NBSkY7O0FBMEJBLENBMUJBLEVBMEJpQixHQUFYLENBQU4sUUExQkE7Ozs7OztBQ0FBO0FBQ0E7Ozs7QUNEQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJfICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpXG50eXBlID0gUmVhY3QuUHJvcFR5cGVzXG5cbkludGVudGlvbkNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZGlzcGxheU5hbWU6ICdJbnRlbnRpb25Db21wb25lbnQnXG5cbiAgcHJvcFR5cGVzOlxuICAgIG1pbnV0ZXNTb0ZhcjogICAgdHlwZS5udW1iZXIuaXNSZXF1aXJlZFxuICAgIG1pbnV0ZXNFc3RpbWF0ZTogdHlwZS5udW1iZXIuaXNSZXF1aXJlZFxuICAgIGRvQ29tbWFuZDogICAgICAgdHlwZS5mdW5jLmlzUmVxdWlyZWRcblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgbWludXRlc1NvRmFyRWRpdDogbnVsbFxuICAgIG1pbnV0ZXNFc3RpbWF0ZUVkaXQ6IG51bGxcblxuICByZW5kZXI6IC0+XG4gICAgeyBidXR0b24sIGJyLCBkaXYsIGRkLCBkbCwgZHQsIGlucHV0LCBsYWJlbCwgdGV4dGFyZWEgfSA9IFJlYWN0LkRPTVxuXG4gICAgZm9ybWF0VGltZSA9IChtaW51dGVzKSAtPlxuICAgICAgaCA9IE1hdGguZmxvb3IobWludXRlcyAvIDYwKS50b1N0cmluZygpXG4gICAgICBtID0gKG1pbnV0ZXMgJSA2MCkudG9TdHJpbmcoKVxuICAgICAgbSA9IFwiMCN7bX1cIiBpZiBtLmxlbmd0aCA9PSAxXG4gICAgICBcIiN7aH06I3ttfVwiXG5cbiAgICBpZk51bGwgPSAoeCwgeSkgLT5cbiAgICAgIGlmIHggPT0gbnVsbCB0aGVuIHkgZWxzZSB4XG5cbiAgICBtYXliZVBhdXNlZCA9XG4gICAgICBpZiBAcHJvcHMuaXNQYXVzZWQgdGhlbiAncGF1c2VkJyBlbHNlICcnXG5cbiAgICBkaXYgeyBjbGFzc05hbWU6IFwic2VjdGlvbiAje21heWJlUGF1c2VkfVwiIH0sXG4gICAgICBkaXYgeyBjbGFzc05hbWU6ICdrZXktbGFiZWwnIH0sICdGMidcbiAgICAgIGRpdiB7IGNsYXNzTmFtZTogJ3RpbWUnIH0sXG4gICAgICAgIGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lOiAnanMtbWludXRlcy1zby1mYXInXG4gICAgICAgICAgdHlwZTogJ3RleHQnXG4gICAgICAgICAgdmFsdWU6IGlmTnVsbChAc3RhdGUubWludXRlc1NvRmFyRWRpdCxcbiAgICAgICAgICAgIGZvcm1hdFRpbWUoQHByb3BzLm1pbnV0ZXNTb0ZhcikpXG4gICAgICAgICAgb25CbHVyOiAoZSkgPT5cbiAgICAgICAgICAgIEBzZXRTdGF0ZSBtaW51dGVzU29GYXJFZGl0OiBudWxsXG4gICAgICAgICAgICBAcHJvcHMuZG9Db21tYW5kICdzZXRfbWludXRlc19zb19mYXInLCBlLnRhcmdldC52YWx1ZVxuICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT5cbiAgICAgICAgICAgIEBzZXRTdGF0ZSBtaW51dGVzU29GYXJFZGl0OiBlLnRhcmdldC52YWx1ZVxuICAgICAgICBiciB7fVxuICAgICAgICBsYWJlbCB7fSxcbiAgICAgICAgICAnU08gRkFSJ1xuICAgICAgICBiciB7fVxuICAgICAgICBpbnB1dFxuICAgICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICAgIHZhbHVlOiBpZk51bGwoQHN0YXRlLm1pbnV0ZXNFc3RpbWF0ZUVkaXQsXG4gICAgICAgICAgICBmb3JtYXRUaW1lKEBwcm9wcy5taW51dGVzRXN0aW1hdGUpKVxuICAgICAgICAgIG9uQmx1cjogKGUpID0+XG4gICAgICAgICAgICBAc2V0U3RhdGUgbWludXRlc0VzdGltYXRlRWRpdDogbnVsbFxuICAgICAgICAgICAgQHByb3BzLmRvQ29tbWFuZCAnc2V0X21pbnV0ZXNfZXN0aW1hdGUnLCBlLnRhcmdldC52YWx1ZVxuICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT5cbiAgICAgICAgICAgIEBzZXRTdGF0ZSBtaW51dGVzRXN0aW1hdGVFZGl0OiBlLnRhcmdldC52YWx1ZVxuICAgICAgICBiciB7fVxuICAgICAgICBsYWJlbCB7fSxcbiAgICAgICAgICAnRVNUSU1BVEUnXG5cbiAgICAgIHRleHRhcmVhIGRlZmF1bHRWYWx1ZTogJydcblxuICAgICAgZGl2IHsgY2xhc3NOYW1lOiAncGF1c2Utc3ltYm9sJyB9LCBfLm1hcChbMS4uM10sIChpKSAtPiBkaXYoeyBrZXk6IGkgfSkpXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50aW9uQ29tcG9uZW50XG4iLCJJbnRlbnRpb25Db21wb25lbnQgPSByZXF1aXJlKCcuL2FwcC9JbnRlbnRpb25Db21wb25lbnQuY29mZmVlJylcblxuW09LQVksIExBVEUsIEFDS05PV0xFREdFRF0gPSBbMSwgMiwgM11cblxuY2xhc3MgSW50ZW50aW9uU2VjdGlvblxuXG4gIGNvbnN0cnVjdG9yOiAodGFyZ2V0RGl2KSAtPlxuICAgIEB0YXJnZXREaXYgPSB0YXJnZXREaXZcbiAgICBAZmxhc2hpbmdJbnRlcnZhbCA9IG51bGxcbiAgICBAZmxhc2hpbmdTdGF0dXMgPSBPS0FZXG5cbiAgICBwYXJzZVRpbWUgPSAodGV4dCkgLT5cbiAgICAgIGlmIHRleHQuc3BsaXQoJzonKS5sZW5ndGggPiAxXG4gICAgICAgIFtoLCBtXSA9IHRleHQuc3BsaXQoJzonKVxuICAgICAgICBwYXJzZUludChoKSAqIDYwICsgcGFyc2VJbnQobSlcbiAgICAgIGVsc2VcbiAgICAgICAgcGFyc2VJbnQodGV4dClcbiAgICBAcHJvcHMgPVxuICAgICAgbWludXRlc1NvRmFyOiAwXG4gICAgICBtaW51dGVzRXN0aW1hdGU6IDE1XG4gICAgICBpc1BhdXNlZDogZmFsc2VcbiAgICAgIGRvQ29tbWFuZDogKGNvbW1hbmQsIGFyZ3MpID0+XG4gICAgICAgIHN3aXRjaCBjb21tYW5kXG4gICAgICAgICAgd2hlbiAnc2V0X21pbnV0ZXNfc29fZmFyJ1xuICAgICAgICAgICAgQHByb3BzLm1pbnV0ZXNTb0ZhciA9IHBhcnNlVGltZShhcmdzKVxuICAgICAgICAgICAgQF91cGRhdGVGbGFzaGluZ1N0YXR1cygpXG4gICAgICAgICAgICBAX3JlbmRlcigpXG4gICAgICAgICAgd2hlbiAnc2V0X21pbnV0ZXNfZXN0aW1hdGUnXG4gICAgICAgICAgICBAcHJvcHMubWludXRlc0VzdGltYXRlID0gcGFyc2VUaW1lKGFyZ3MpXG4gICAgICAgICAgICBAX3VwZGF0ZUZsYXNoaW5nU3RhdHVzKClcbiAgICAgICAgICAgIEBfcmVuZGVyKClcblxuICBfcmVuZGVyOiA9PlxuICAgIFJlYWN0LnJlbmRlckNvbXBvbmVudChJbnRlbnRpb25Db21wb25lbnQoQHByb3BzKSwgQHRhcmdldERpdilcblxuICBfc2V0UmVkQmFja2dyb3VuZDogKGFkZFJlZCkgPT5cbiAgICBjbGFzc2VzID0gKEB0YXJnZXREaXYuY2xhc3NOYW1lIHx8ICcnKS5zcGxpdCgnICcpXG4gICAgaWYgYWRkUmVkXG4gICAgICBjbGFzc2VzLnB1c2goJ2ZsYXNoaW5nJykgdW5sZXNzIGNsYXNzZXMuaW5kZXhPZignZmxhc2hpbmcnKSAhPSAtMVxuICAgIGVsc2VcbiAgICAgIGNsYXNzZXMgPSBfLndpdGhvdXQoY2xhc3NlcywgJ2ZsYXNoaW5nJylcbiAgICBAdGFyZ2V0RGl2LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpXG5cbiAgX3VwZGF0ZUZsYXNoaW5nU3RhdHVzOiA9PlxuICAgIHRvZ2dsZVJlZEJhY2tncm91bmQgPSA9PlxuICAgICAgY2xhc3NlcyA9IChAdGFyZ2V0RGl2LmNsYXNzTmFtZSB8fCAnJykuc3BsaXQoJyAnKVxuICAgICAgaXNGbGFzaGluZyA9IGNsYXNzZXMuaW5kZXhPZignZmxhc2hpbmcnKSAhPSAtMVxuICAgICAgQF9zZXRSZWRCYWNrZ3JvdW5kICFpc0ZsYXNoaW5nXG4gICAgaWYgQHByb3BzLmlzUGF1c2VkXG4gICAgICBAX3NldFJlZEJhY2tncm91bmQgZmFsc2VcbiAgICBlbHNlXG4gICAgICBpZiBAcHJvcHMubWludXRlc1NvRmFyIDw9IEBwcm9wcy5taW51dGVzRXN0aW1hdGVcbiAgICAgICAgaWYgQGZsYXNoaW5nU3RhdHVzICE9IE9LQVlcbiAgICAgICAgICBAZmxhc2hpbmdTdGF0dXMgPSBPS0FZXG4gICAgICAgICAgQF9zZXRSZWRCYWNrZ3JvdW5kIGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIGlmIEBmbGFzaGluZ1N0YXR1cyAhPSBMQVRFXG4gICAgICAgICAgQGZsYXNoaW5nU3RhdHVzID0gTEFURVxuICAgICAgICAgIEBmbGFzaGluZ0ludGVydmFsID0gd2luZG93LnNldEludGVydmFsIHRvZ2dsZVJlZEJhY2tncm91bmQsIDEwMDBcblxuICBydW46ID0+XG4gICAgZXZlcnlNaW51dGUgPSA9PlxuICAgICAgaWYgIUBwcm9wcy5pc1BhdXNlZFxuICAgICAgICBAcHJvcHMubWludXRlc1NvRmFyICs9IDFcbiAgICAgICAgQF91cGRhdGVGbGFzaGluZ1N0YXR1cygpXG4gICAgICAgIEBfcmVuZGVyKClcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwgZXZlcnlNaW51dGUsIDYwICogMTAwMFxuICAgIEBfcmVuZGVyKClcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpID0+XG4gICAgICAjIHN0b3AgZmxhc2hpbmdcbiAgICAgIGlmIEBmbGFzaGluZ1N0YXR1cyA9PSBMQVRFXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsIEBmbGFzaGluZ0ludGVydmFsXG4gICAgICAgIEBfc2V0UmVkQmFja2dyb3VuZCB0cnVlXG4gICAgICAgIEBmbGFzaGluZ1N0YXR1cyA9IEFDS05PV0xFREdFRFxuXG4gIGZvY3VzOiA9PlxuICAgIEB0YXJnZXREaXYucXVlcnlTZWxlY3RvcignLmpzLW1pbnV0ZXMtc28tZmFyJykuZm9jdXMoKVxuXG4gIHRvZ2dsZVBhdXNlOiA9PlxuICAgIEBwcm9wcy5pc1BhdXNlZCA9ICFAcHJvcHMuaXNQYXVzZWRcbiAgICBAX3VwZGF0ZUZsYXNoaW5nU3RhdHVzKClcbiAgICBAX3JlbmRlcigpXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50aW9uU2VjdGlvblxuIiwiXyAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxudHlwZSA9IFJlYWN0LlByb3BUeXBlc1xuXG5TY2hlZHVsZUNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZGlzcGxheU5hbWU6ICdTY2hlZHVsZUNvbXBvbmVudCdcblxuICBwcm9wVHlwZXM6XG4gICAgYWN0aXZpdGllc1RleHQ6IHR5cGUuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICBub3Rlc1RleHQ6ICAgICAgdHlwZS5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIGRvQ29tbWFuZDogICAgICB0eXBlLmZ1bmMuaXNSZXF1aXJlZFxuICAgIGN1cnJlbnRIb3VyOiAgICB0eXBlLm51bWJlci5pc1JlcXVpcmVkXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHRleHRFZGl0OiBudWxsXG5cbiAgcmVuZGVyOiAtPlxuICAgIHsgYnIsIGRpdiwgdGV4dGFyZWEgfSA9IFJlYWN0LkRPTVxuXG4gICAgbGVmdF9mb3JfaG91ciA9IChob3VyKSAtPlxuICAgICAgQURKVVNUX1JJR0hUID0gMjVcbiAgICAgIFBYX1BFUl9IT1VSID0gNDdcbiAgICAgIEZJUlNUX0hPVVIgPSA3XG4gICAgICAoaG91ciAtIEZJUlNUX0hPVVIpICogUFhfUEVSX0hPVVIgKyBBREpVU1RfUklHSFRcblxuICAgIGFjdGl2aXRpZXMgPSBfLm1hcCBAcHJvcHMuYWN0aXZpdGllc1RleHQuc3BsaXQoL1xcbi8pLCAodGV4dCkgLT5cbiAgICAgIHBhcnRzID0gdGV4dC5zcGxpdCgnICcpXG4gICAgICBpZiB0ZXh0ID09ICcnXG4gICAgICAgICMgc2tpcCBpdFxuICAgICAgZWxzZSBpZiBwYXJ0c1swXS5pbmRleE9mKCctJykgPT0gMCAjIGUuZy4gLTIgbWVhbnMgbmV4dCBhdmFpbGFibGUgMiBob3Vyc1xuICAgICAgICBuYW1lID0gcGFydHNbMS4uLnBhcnRzLmxlbmd0aF0uam9pbignICcpXG4gICAgICAgIGhvdXJTdGFydCAgPSBudWxsXG4gICAgICAgIGhvdXJGaW5pc2ggPSAtcGFyc2VGbG9hdChwYXJ0c1swXSlcbiAgICAgIGVsc2UgaWYgcGFydHNbMF0uaW5kZXhPZignLScpID4gMCAjIGUuZy4gOC05IG1lYW5zIDggYS5tLiAtIDkgYS5tLlxuICAgICAgICBuYW1lID0gcGFydHNbMS4uLnBhcnRzLmxlbmd0aF0uam9pbignICcpXG4gICAgICAgIGhvdXJTdGFydCAgPSBwYXJzZUZsb2F0KHBhcnRzWzBdLnNwbGl0KCctJylbMF0pXG4gICAgICAgIGhvdXJGaW5pc2ggPSBwYXJzZUZsb2F0KHBhcnRzWzBdLnNwbGl0KCctJylbMV0pXG4gICAgICBlbHNlIGlmIHBhcnNlRmxvYXQocGFydHNbMF0pID4gMCAjIGUuZy4gMTEgbWVhbnMgMTEgYS5tLiAtIGRlZmF1bHRcbiAgICAgICAgbmFtZSA9IHBhcnRzWzEuLi5wYXJ0cy5sZW5ndGhdLmpvaW4oJyAnKVxuICAgICAgICBob3VyU3RhcnQgPSBwYXJzZUZsb2F0KHBhcnRzWzBdKVxuICAgICAgICBob3VyRmluaXNoID0gaG91clN0YXJ0ICsgMC41XG4gICAgICBlbHNlICMgZS5nLiBhY3Rpdml0eSB3aXRob3V0IHRpbWUgbGFiZWxcbiAgICAgICAgbmFtZSA9IHRleHRcbiAgICAgICAgaG91clN0YXJ0ID0gbnVsbFxuICAgICAgICBob3VyRmluaXNoID0gbnVsbFxuICAgICAgeyBuYW1lLCBob3VyU3RhcnQsIGhvdXJGaW5pc2ggfVxuXG4gICAgYXR0ZW1wdGVkU3RhcnQgPSBNYXRoLmNlaWwoKEBwcm9wcy5jdXJyZW50SG91ciArIDEwLzYwKSAqIDQpIC8gNFxuICAgIF8uZm9yRWFjaCBhY3Rpdml0aWVzLCAoYWN0aXZpdHkpIC0+XG4gICAgICBpZiBhY3Rpdml0eS5ob3VyU3RhcnQgPT0gbnVsbFxuICAgICAgICBmb3VuZFRpbWUgPSBmYWxzZVxuICAgICAgICB3aGlsZSAhZm91bmRUaW1lXG4gICAgICAgICAgZm91bmRUaW1lID0gdHJ1ZVxuICAgICAgICAgIGF0dGVtcHRlZEZpbmlzaCA9IGF0dGVtcHRlZFN0YXJ0ICsgKGFjdGl2aXR5LmhvdXJGaW5pc2ggfHwgMC40KVxuICAgICAgICAgIF8uZm9yRWFjaCBhY3Rpdml0aWVzLCAoYWN0aXZpdHkyKSAtPlxuICAgICAgICAgICAgaWYgYWN0aXZpdHkyLmhvdXJTdGFydCAhPSBudWxsXG4gICAgICAgICAgICAgIGlmIGFjdGl2aXR5Mi5ob3VyU3RhcnQgPD0gYXR0ZW1wdGVkU3RhcnQgJiZcbiAgICAgICAgICAgICAgICBhY3Rpdml0eTIuaG91ckZpbmlzaCA+IGF0dGVtcHRlZFN0YXJ0XG4gICAgICAgICAgICAgICAgIGZvdW5kVGltZSA9IGZhbHNlXG4gICAgICAgICAgICAgIGlmIGFjdGl2aXR5Mi5ob3VyU3RhcnQgPiBhdHRlbXB0ZWRGaW5pc2ggJiZcbiAgICAgICAgICAgICAgICBhY3Rpdml0eTIuaG91ckZpbmlzaCA8PSBhdHRlbXB0ZWRGaW5pc2hcbiAgICAgICAgICAgICAgICAgZm91bmRUaW1lID0gZmFsc2VcbiAgICAgICAgICBpZiAhZm91bmRUaW1lXG4gICAgICAgICAgICBhdHRlbXB0ZWRTdGFydCArPSAwLjI1XG4gICAgICAgIGFjdGl2aXR5LmhvdXJTdGFydCA9IGF0dGVtcHRlZFN0YXJ0XG4gICAgICAgIGFjdGl2aXR5LmhvdXJGaW5pc2ggPSBhdHRlbXB0ZWRGaW5pc2hcblxuXG4gICAgZGl2XG4gICAgICBpZDogJ3NjaGVkdWxlJ1xuICAgICAgY2xhc3NOYW1lOiAnc2VjdGlvbidcbiAgICAgIHN0eWxlOlxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXG4gICAgICBkaXYgeyBjbGFzc05hbWU6ICdrZXktbGFiZWwnIH0sICdGMydcbiAgICAgIGJyIHt9XG4gICAgICBfLm1hcCBbNy4uMjJdLCAoaG91cikgLT5cbiAgICAgICAgZGl2IHsgY2xhc3NOYW1lOiAnaG91cicsIGtleTogaG91ciB9LFxuICAgICAgICAgIGhvdXJcbiAgICAgIF8ubWFwIGFjdGl2aXRpZXMsIChhY3Rpdml0eSwgaSkgLT5cbiAgICAgICAgZGl2XG4gICAgICAgICAga2V5OiBpXG4gICAgICAgICAgY2xhc3NOYW1lOiAnZHVyYXRpb24nXG4gICAgICAgICAgc3R5bGU6XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0X2Zvcl9ob3VyKGFjdGl2aXR5LmhvdXJTdGFydClcbiAgICAgICAgICAgIHdpZHRoOiBsZWZ0X2Zvcl9ob3VyKGFjdGl2aXR5LmhvdXJGaW5pc2gpIC1cbiAgICAgICAgICAgICAgbGVmdF9mb3JfaG91cihhY3Rpdml0eS5ob3VyU3RhcnQpIC0gMlxuICAgICAgICAgIGFjdGl2aXR5Lm5hbWVcbiAgICAgIGRpdlxuICAgICAgICBjbGFzc05hbWU6ICdjdXJyZW50LXRpbWUnXG4gICAgICAgIHN0eWxlOlxuICAgICAgICAgIGxlZnQ6IGxlZnRfZm9yX2hvdXIoQHByb3BzLmN1cnJlbnRIb3VyKVxuICAgICAgYnIge31cbiAgICAgIHRleHRhcmVhXG4gICAgICAgIGNsYXNzTmFtZTogJ2pzLWFjdGl2aXRpZXMtdGV4dCdcbiAgICAgICAgdmFsdWU6IEBwcm9wcy5hY3Rpdml0aWVzVGV4dFxuICAgICAgICBvbkNoYW5nZTogKGUpID0+XG4gICAgICAgICAgQHByb3BzLmRvQ29tbWFuZCAnY2hhbmdlX2FjdGl2aXRpZXMnLCBlLnRhcmdldC52YWx1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlQ29tcG9uZW50XG4iLCJTY2hlZHVsZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vYXBwL1NjaGVkdWxlQ29tcG9uZW50LmNvZmZlZScpXG5cbmNsYXNzIFNjaGVkdWxlU2VjdGlvblxuXG4gIGNvbnN0cnVjdG9yOiAodGFyZ2V0RGl2KSAtPlxuICAgIEB0YXJnZXREaXYgPSB0YXJnZXREaXZcblxuICBydW46ID0+XG4gICAgcHJvcHMgPVxuICAgICAgYWN0aXZpdGllc1RleHQ6IFwiMTAgYnJlYWtmYXN0XFxuMTIgbHVuY2hcXG4xNi41IGV4ZXJjaXNlXFxuMTggZGlubmVyXFxuMTkgdmNsZWFuXFxuMjAgcGNsZWFuXCJcbiAgICAgIGN1cnJlbnRIb3VyOiBudWxsXG4gICAgICBkb0NvbW1hbmQ6IChjb21tYW5kLCBhcmdzKSAtPlxuICAgICAgICBpZiBjb21tYW5kID09ICdjaGFuZ2VfYWN0aXZpdGllcydcbiAgICAgICAgICBwcm9wcy5hY3Rpdml0aWVzVGV4dCA9IGFyZ3NcbiAgICAgICAgICByZW5kZXIoKVxuICAgIHJlbmRlciA9ID0+XG4gICAgICBSZWFjdC5yZW5kZXJDb21wb25lbnQoU2NoZWR1bGVDb21wb25lbnQocHJvcHMpLCBAdGFyZ2V0RGl2KVxuICAgIGV2ZXJ5TWludXRlID0gLT5cbiAgICAgIHByb3BzLmN1cnJlbnRIb3VyID0gKG5ldyBEYXRlKCkpLmdldEhvdXJzKCkgKyAobmV3IERhdGUoKSkuZ2V0TWludXRlcygpIC8gNjBcbiAgICAgIHJlbmRlcigpXG4gICAgd2luZG93LnNldEludGVydmFsIGV2ZXJ5TWludXRlLCA2MCAqIDEwMDBcbiAgICBldmVyeU1pbnV0ZSgpXG5cbiAgZm9jdXM6ID0+XG4gICAgQHRhcmdldERpdi5xdWVyeVNlbGVjdG9yKCcuanMtYWN0aXZpdGllcy10ZXh0JykuZm9jdXMoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlU2VjdGlvblxuIiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuUmVhY3Q7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5fO1xuIl19
