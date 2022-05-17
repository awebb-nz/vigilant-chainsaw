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
        type: jspsych.ParameterType.FUNCTION,
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
      var totalScore = 0;
      var clickSeq = new Array();
      var handlers = new Map();

      const updateStatus = (newScore, newClicks) => {
        display_element.querySelector("#multiclick-grid-status-score-value").innerHTML = newScore;
        display_element.querySelector("#multiclick-grid-status-clicks-value").innerHTML = newClicks;
      }

      const disableClicks = () => {
        for (var row = 0; row < trial.grid_state.rows; row++) {
          for (var col = 0; col < trial.grid_state.columns; col++) {
            let cellId = MultiClickGridPlugin.generateCellId(row, col);
            var tableCell = display_element.querySelector(`#${cellId}`);
            tableCell.removeEventListener("click", handlers[cellId]);
          }
        }
      }

      const enableClick = (r, c) => {
        let cellId = MultiClickGridPlugin.generateCellId(r, c);
        handlers[cellId] = (_e) => {
          var cell = trial.grid_state.cells[[r, c]];
          totalScore += cell.values[cell.clicks];
          clickSeq.push(cell.position);
          cell.clicks++;
          trial.grid_state.clicks++;
          updateStatus(totalScore, trial.clicks - trial.grid_state.clicks);
          if (trial.grid_state.clicks >= trial.clicks) {
            disableClicks();
            displaySummary();
          }
          tableCell.innerHTML = MultiClickGridPlugin.generateCell(trial.grid_state, r, c);
        };
        var tableCell = display_element.querySelector(`#${cellId}`);
        tableCell.innerHTML = MultiClickGridPlugin.generateCell(trial.grid_state, r, c);
        tableCell.addEventListener("click", handlers[cellId]);
      }

      const displaySummary = () => {
        display_element.innerHTML = "<div id='multiclick-grid-status'>" +
        "<div id='multiclick-grid-status-score'>" +
        "<label for='multiclick-grid-status-score-value'>Total score</label>" +
        "<p id='multiclick-grid-status-score-value'>" + totalScore +
        "</p></div></div>" +
        "<div>Press space to continue</div>";
        this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: endTrial,
          valid_responses: [' '],
          persist: false
        });
      }

      const endTrial = (_) => {
        display_element.innerHTML = "";
        let data = {
          grid: trial.grid_state.cells,
          score: totalScore,
          click_seq: clickSeq,
        }
        this.jsPsych.finishTrial(data);
      }

      display_element.innerHTML = "<div id='multiclick-grid-status'>" +
        "<div id='multiclick-grid-status-score'>" +
        "<label for='multiclick-grid-status-score-value'>Score</label>" +
        "<p id='multiclick-grid-status-score-value'></p>" +
        "</div>" +
        "<div id='multiclick-grid-status-clicks'>" +
        "<label for='multiclick-grid-clicks-value'>Clicks remaining</label>" +
        "<p id='multiclick-grid-status-clicks-value'></p>" +
        "</div></div>";
      display_element.innerHTML += MultiClickGridPlugin.generateGrid(trial.grid_state);

      updateStatus(totalScore, trial.clicks - trial.grid_state.clicks);
      for (var row = 0; row < trial.grid_state.rows; row++) {
        for (var col = 0; col < trial.grid_state.columns; col++) {
          enableClick(row, col);
        }
      }
    }

    static generateCellId(row, col) {
      return "multiclick-grid-table-cell-" + row + "-" + col;
    }

    static generateCell(grid_state, row, col) {
      let html = "<div>" + grid_state.current(row, col) + "</div>";
      return html
    }

    static generateGrid(grid_state) {
      var html = '<div id="multiclick-grid" css="display: none;">';

      html +=
        '<table id="multiclick-grid-table" class="grid"' +
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
