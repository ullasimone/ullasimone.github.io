(async () => {
    function getSkillAmountsArrayFromLocalStorage() {
        const storedSkillAmountsArray = localStorage.getItem('skillAmountsArray');
        if (storedSkillAmountsArray) {
          return JSON.parse(storedSkillAmountsArray);
        } else {
          return []; // Return an empty array or handle the case when the data is not available in local storage
        }
      }
      const skillAmountsArray = getSkillAmountsArrayFromLocalStorage();
      console.log("Radarcharts dataarray",skillAmountsArray);
const radarChartDiv = document.getElementById('radarCanvas');
      new Chart(radarChartDiv, {
        type: "radar",
      data: {
        labels: [
          "Go",
          "HTML",
          "JS",
          "Game",
          "Algorithms",
        ],
        datasets: [
          {
            label: "Skill level",
            fill: true,
            lineTension: 0,
            backgroundColor: "#007200",
            borderColor: "#9acd32",
            borderCapStyle: "butt",
            borderJoinStyle: "miter",
            pointBorderColor: "#9acd32",
            pointBackgroundColor: "#007200",
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#007200",
            pointHoverBorderColor: "#007200",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 5,
            data: skillAmountsArray,
 
          },
        ],
      },
      options: {
        plugins:{
          legend:{
            display:false
          },
          label:{
            display:false
          }
        },
        scales: {
          r:{
            angleLines:{
              color: "#007200",
            },
            grid:{
              color: "#007200",
            },
            pointLabels:{
              color: "#9acd32",
            },
            ticks:{
              display: false,
            }
          },
        },
        scale: {
          ticks: {
            min: 0,
            max: 50,
            stepSize: 25,
            color: "#9acd32",
          },
        },
        responsive: true,
      },
    });
})();