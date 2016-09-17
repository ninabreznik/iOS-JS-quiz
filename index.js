/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var FONT       = 'Baloo Chettan, cursive'
var yellow     = 'hsla(52,35%,63%,1)'
var white      = 'hsla(120,24%,96%,1)'
var violet     = 'hsla(329,25%,45%,1)'
var lightBrown = 'hsla(29,21%,67%,1)'
var darkBrown  = 'hsla(13,19%,45%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
//https://fonts.google.com/?query=baloo&selection.family=Baloo+Chettan
var font = yo `
  <style>
  @font-face {
    font-family: 'Baloo Chettan';
    font-style: normal;
    font-weight: 400;
    src: local('Baloo Chettan'), local('BalooChettan-Regular'), url(baloochettan-latin.woff) format('woff');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
    }
  </style>
`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/

var questions = [
  `
      It's a waste of time to learn any other language than #JavaScript.
      The future is with JS :)
  `,
  `
      Framework vs. #hypermodular development is like planned economy vs. free market.
  `,
  `
      Information asymmetry can best be broken by making everything #transparent.
  `,
  `
      Programming is the new literacy, everyone should learn it. All other jobs
      will be #automated.
  `,
  `
      Employment is for kids. Grown ups are #self-employed.
  `,
  `
    With #VR all the jobs will be remote. On-site gatherings will be for fun.
  `
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      touch-action: manipulation;
      background-color: ${yellow};
      text-align: center;
      font-family: ${FONT};
      padding-bottom: 150px;
    }
    .welcome {
      display: flex;
      align-self: center;
      text-transform: uppercase;
      font-size: 4em;
      padding: 15% 15% 3% 15%;
      color: ${darkBrown}
    }
    .question {
      font-size: 2em;
      color: ${white};
      padding: 5%;
      width: 90%;
      max-width: 1000px;
      margin: auto;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      font-size: 2em;
      font-color: ${darkBrown}
      background-color: ${white};
      padding: 5%;
      margin: 1%;
      border: 2px solid ${darkBrown};
      border-radius: 30%;
    }
    .answer:hover {
      opacity: 0.6;
    }
    .instruction {
      color: ${darkBrown};
      font-size: 1.5em;
      margin: 0 15%;
      padding: 10px;
    }
    .results {
      touch-action: manipulation;
      background-color: ${white};
      text-align: center;
      font-family: ${FONT};
      padding: 15% 3% 40% 3%;
    }
    .resultTitle{
      font-size: 4em;
      padding: 5% 5% 0 5%;
      color: ${darkBrown}
    }
    .back {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      padding-top: 5px;
      color: ${white};
      font-size: 25px;
    }
    .chooseChartOrPlayAgain {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .showChart, .playAgain {
      background-color: ${white};
      padding: 2%;
      border: 3px solid ${darkBrown};
      border-radius: 5%;
      font-size: 2em;
      color: ${violet};
      margin: 5%;
    }
    .myChart {
      width: 100%;
      height: 100%;
    }
    @media only screen and (max-width: 700px) {
      body {
        font-size:75%;
      }
    }
    @media only screen and (max-width: 400px) {
      body {
        font-size:50%;
      }
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          What type of JavaScript hacker are you?
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Choose how strongly do you agree with the statement<br>
          (1 - no way, 6 - totally)
        </div>
        <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}
  var state = 0;
  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}  style="width='100px;' height='100px;'"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}" onclick=${function(){createChart(ctx, data)}}>
        Yay, awesome!
      </div>
      <div class="${css.chooseChartOrPlayAgain}">
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
          Show results
        </div>
        <div class="${css.playAgain}" onclick=${playAgain}>Play again</div>
      </div>
        ${ctx}
    </div>
  `
	}

  function playAgain () {
    i = 0;
    question = questions[i]
    yo.update(element, template())
  }

  function back() {
    if (i > 0) {
      i = i-1
    }
    question = questions[i]
    yo.update(element, template())
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-15523.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-15523.firebaseio.com/results.json', responseHandler) //Firebase connected to Esova google account
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "JAVASCRIPT", "HYPERMODULARITY", "TRANSPARENCY",
          "AUTOMATION", "SELF-EMPLOYMENT", "VR"
        ],
        datasets: [
          {
            label: "My statments",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Others statements",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
