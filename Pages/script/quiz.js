const parameters = new URLSearchParams(window.location.search);
const topic = parameters.get("gridRadios");
const bodyQuestions = document.querySelector(".body__questions");
const bodyTitle = document.querySelector(".body__title");
const bodyTopic = document.querySelector(".body__topic");
// const selectOptions = document.querySelector("select");
// const btnStart = document.querySelector(".btnStart");
const logo = document.querySelector("#logo");
const retryBtn = document.querySelector(".retryBtn");
const changeTopicBtn = document.querySelector(".changeTopic");
bodyTopic.innerHTML = `Topic : ${topic}`;
//render username to header
const tagUsername = document.querySelector(".username");
const userName = localStorage.getItem("username");
// console.log(userName === "undefined");
if (userName !== "undefined") {
  tagUsername.innerHTML = userName;
} else {
  let text = "You must login with your account !";
  if (confirm(text) == true) {
    location.assign("http://127.0.0.1:5501/Pages/login.html");
  } else {
    location.assign("http://127.0.0.1:5501/Pages/index.html");
  }
}

//  Ham render cac cau hoi
function renderQuestions(questions) {
  let htmls = questions.map((question, index) => {
    return `<form class="body__questions-item rounded border border-primary" id="${index}" onChange="handleChangeQuestion(this)">
       <span class="signalPass d-none"><i class="fas fa-2x fa-check-circle"></i></span>
       <span class="signalFail d-none"><i class="fas fa-2x fa-times-circle"></i></span>
       <span class="signalSurrender d-none"><i class="far fa-2x fa-flag"></i></span>
      <b class="body__questions__name"><span>${index + 1} </span>${
      question.question
    }</b>
      <div class="body__answer">
        <input type="radio" id="a${question._id}" name="answer" value="${
      question.answer1
    }" />
        <label for="a${question._id}">${question.answer1}</label><br />
      </div>
      <div class="body__answer">
        <input
          type="radio"
          id="b${question._id}"
          name="answer"
          value="${question.answer2}"
        />
        <label for="b${question._id}">${question.answer2}</label><br />
      </div>
      ${
        question.answer3 !== ""
          ? `
      <div class="body__answer">
        <input
          type="radio"
          id="c${question._id}"
          name="answer"
          value="${question.answer3}"
        />
        <label for="c${question._id}">${question.answer3}</label><br />
      </div>`
          : ""
      }
      ${
        question.answer4 !== ""
          ? `<div class="body__answer">
        <input
          type="radio"
          id="d${question._id}"
          name="answer"
          value="${question.answer4}"
        />
        <label for="d${question._id}">${question.answer4}</label><br />
      </div>`
          : ""
      }
      
      <span class="text-danger font-weight-bold resultText d-none"></span>
    </form>`;
  });
  bodyQuestions.innerHTML = htmls.join("");
}

fetch("https://onlinequiz-app-ver1.herokuapp.com/api/question/" + topic)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    renderQuestions(data);
    const dataSubmit = document.querySelectorAll(".body__questions-item");
    const btnSubmit = document.querySelector(".btnSubmit");

    // kiểm tra nếu chưa điền đủ đáp án thì chưa thể nhấn submit
    // ***********************************
    btnSubmit.addEventListener("click", function (event) {
      event.preventDefault();
      let array = [];
      dataSubmit.forEach((item, index) => {
        item.querySelectorAll(".body__answer").forEach((i, index) => {
          if (i.querySelector("input").checked) {
            // console.log(index);
            array.push(index);
          }
          return array;
        });
      });
      if (array.length < data.length) {
        alert("You have not completed the test !!!");
      } else {
        console.log(array);
        console.log("length array", array.length);
        const results = Replace(array);
        Testing(results);
        // console.log(dataSubmit);
        btnSubmit.setAttribute("disabled", "");
      }
    });
  })
  .catch((error) => console.log(error));
// Hàm thực thi kiểm tra
function Testing(array) {
  fetch("https://onlinequiz-app-ver1.herokuapp.com/api/question/" + topic)
    .then((res) => res.json())
    .then((data) => {
      let quantity = array.length;
      let correctResults = [];
      data.forEach((item, index) => {
        correctResults.push(item.correct);
      });
      console.log(array);
      // console.log("correctResults", correctResults);
      console.log(Result(array, correctResults, quantity));

      const totalScore = Result(array, correctResults, quantity);

      // render lai giao dien sau khi kiem tra xong
      const dataSubmit = document.querySelectorAll(".body__questions-item");
      bodyTitle.innerHTML = `Your total score is <b class="text-success">${Math.round(
        totalScore
      )}</b> <span class="text-danger">(${Math.round(totalScore)}/10) </span>
      <button class="btn btn-success retryBtn" onClick="retryQuiz()">Retry Quiz 🔥 </button>
      `;

      const resultFromWrongAnswer = wrongAnswers(array, correctResults);
      const indexWrongAnswers = resultFromWrongAnswer[2];
      const correctAnswers = resultFromWrongAnswer[3];

      console.log(correctAnswers);
      dataSubmit.forEach((question, index) => {
        question.classList.remove("border-primary");
        if (indexWrongAnswers.indexOf(index) !== -1) {
          question.classList.add("border-danger");
          question.querySelector(".signalFail").classList.remove("d-none");
          // innerHTML = `Correct answer is ${correctAnswers[index]} !`;
          const questionSite = question.querySelector(".resultText");
          questionSite.classList.remove("d-none");
          questionSite.innerHTML = `Correct answer is ${correctResults[index]}`;
          console.log("index", index);
          console.log("correctResults", correctResults);
        } else {
          question.classList.add("border-success");
          question.querySelector(".signalPass").classList.remove("d-none");
        }
      });

      backToTop();
    })
    .catch((error) => console.log(error));
}
// ****************
//Hàm chuyển đổi Number -> String
function Replace(array) {
  array.forEach((item, index) => {
    if (item === 0) {
      array.splice(index, 1, "A");
    } else if (item === 1) {
      array.splice(index, 1, "B");
    } else if (item === 2) {
      array.splice(index, 1, "C");
    } else {
      array.splice(index, 1, "D");
    }
  });
  return array;
}
// ***************************
// Hàm tính điểm
function Result(array1, array2, quantity) {
  let pointLadder = 10; //Thang điểm
  let dem = 0;
  let numberCorrectAnswers = array2.length;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] === array2[i]) {
      dem += 1;
    }
  }
  let finalResult = (dem / numberCorrectAnswers) * pointLadder;
  return finalResult;
}
// *************************

// Ham tim cau sai
function wrongAnswers(array1, array2) {
  let soCauSai = 0;
  let wrongAnswers = [];
  let correctAnswers = [];
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      soCauSai += 1;
      wrongAnswers.push(i);
      correctAnswers.push(array2[i]);
    }
  }
  let resultReturn = [];
  let soCauDung = array1.length - soCauSai;
  console.log("so cau sai :", soCauSai);
  console.log("so cau dung :", soCauDung);
  console.log("vi tri cac cau sai :", wrongAnswers);
  console.log("dap dung cho cac cau sai :", correctAnswers);

  resultReturn.push(soCauSai, soCauDung, wrongAnswers, correctAnswers);

  console.log("mang tra ve", resultReturn);
  return resultReturn;
}
// ***********************

// Ham back to top
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
// ************************
// Ham back to home page
logo.addEventListener("click", () => {
  goHomeOrChangeTopic();
});
//Ham thay doi topic
changeTopicBtn.onclick = () => {
  goHomeOrChangeTopic();
};
function goHomeOrChangeTopic() {
  const convertValue = document.querySelector("#done").textContent.split("/");
  const doneQuestions = convertValue[0];
  const sumQuestions = convertValue[1];

  if (
    // document.querySelector(".btnSubmit").getAttribute("disabled") === null
    doneQuestions / sumQuestions !==
    1
  ) {
    if (
      confirm(
        "You have not finished your quiz ? Are you sure you want to go back to the homepage?"
      )
    ) {
      window.location.replace(
        "https://nguyentamlong.github.io/ANDROID/Pages/index.html"
      );
    } else {
      return;
    }
  } else {
    window.location.replace(
      "https://nguyentamlong.github.io/ANDROID/Pages/index.html"
    );
  }
}
// ************************
// Ham lam lai lam kiem tra
function retryQuiz() {
  location.reload();
}
// ***********************

// Ham di chuyen len xuong
const toTopBtn = document.querySelector(".fa-arrow-alt-circle-up");
const toBottomBtn = document.querySelector(".fa-arrow-alt-circle-down");
toBottomBtn.onclick = () => {
  var elmnt = document.getElementById("footer");
  elmnt.scrollIntoView();
};
toTopBtn.onclick = () => {
  backToTop();
};
// ***********************
