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
      const endTrial = () => {
        display_element.innerHTML = "";
        console.log("tgs", trial.grid_state)
        this.jsPsych.finishTrial();
      }

      var totalClicks = 0;

      display_element.innerHTML = MultiClickGridPlugin.generateGrid(trial.grid_state);
      for (var row = 0; row < trial.grid_state.rows; row++) {
        for (var col = 0; col < trial.grid_state.columns; col++) {
          (function(r, c) {
            let cellId = MultiClickGridPlugin.generateCellId(r, c);
            var cell = display_element.querySelector(`#${cellId}`);
            cell.innerHTML = MultiClickGridPlugin.generateCell(trial.grid_state, r, c);
            cell.addEventListener("click", (_e) => {
              trial.grid_state.cells[[r, c]].clicks++;
              totalClicks++;
              if (totalClicks >= trial.clicks) {
                endTrial();
              }
              cell.innerHTML = MultiClickGridPlugin.generateCell(trial.grid_state, r, c);
            })
          })(row, col);
        }
      }
    }

    static generateCellId(row, col) {
      return "multiclick-grid-table-cell-" + row + "-" + col;
    }

    static generateCell(grid_state, row, col) {
      let cell = grid_state.cells[[row, col]];
      let value = cell.values[cell.clicks];
      let html = "<div>" + value + "</div>";
      return html
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
