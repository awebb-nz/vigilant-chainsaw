var jsMulticlickGrid = (function (jspsych) {
  "use strict";

  const info = {
    name: "multiclick-grid",
    parameters: {
      clicks: {
        type: jspsych.ParameterType.INT,
        default: undefined,
      },
      grid_state: {
        type: jspsych.ParameterType.OBJECT,
        array: true,
        default: undefined,
      },
    },
  };

  /**
   * **MultiClickGridPlugin**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author YOUR NAME
   */
  class MultiClickGridPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      console.log("tgs", trial.grid_state)

      display_element.innerHTML = MultiClickGridPlugin.generateGrid(trial.grid_state);

      this.jsPsych.pluginAPI.setTimeout(function () {
        endTrial();
      }, 1500);

      const endTrial = () => {
        display_element.innerHTML = "";
        // data saving
        var trial_data = {
          parameter_name: "parameter value",
        };
        // end trial
        this.jsPsych.finishTrial(trial_data);
      }
    }

    static generateGrid(grid_state) {
      var html = '<div id="multiclick-grid" css="display: none;">';
    
       html +=
      '<table id="multiclick-grid-table" ' +
      'style="border-collapse: collapse; margin-left: auto; margin-right: auto;">';

      for (var row = 0; row < grid_state.rows; row++) {
        let rowId = "multiclick-grid-row-" + row;
        html += "<tr id=" + rowId + ">";
        for (var col = 0; col < grid_state.columns; col++) {
          let colId = "multiclick-grid-table-cell-" + row + "-" + col;
          html += "<td id=" + colId + ">";
          let divId = colId + "-value";
          let value = grid_state.at(row, col);
          html += "<div id=" + divId + ">" + value + "</div>";
          html += "</td>";
        }
        html += "</tr>";
      }

      html += "</div>";
      return html
    }
  }
  MultiClickGridPlugin.info = info;

  return MultiClickGridPlugin;
})(jsPsychModule);
