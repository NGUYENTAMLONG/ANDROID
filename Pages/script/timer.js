const selectOptions = document.querySelector("select");
// const bodyQuestions = document.querySelector(".body__questions");
const btnStart = document.querySelector(".btnStart");
btnStart.setAttribute("disabled", "");
selectOptions.addEventListener("change", () => {
  if (selectOptions.value !== "Choose time") {
    btnStart.removeAttribute("disabled");
  } else {
    btnStart.setAttribute("disabled", "");
  }
});
btnStart.addEventListener("click", () => {
  bodyQuestions.classList.remove("d-none");
  btnStart.classList.add("d-none");
  document.querySelector(".btnSubmit").classList.remove("d-none");
  selectOptions.setAttribute("disabled", "");

  // console.log(selectOptions.value);
  document.querySelector(".timeLeft").style.top = "55px";
  document.getElementById("timer").innerHTML = selectOptions.value + ":" + 00;
  if (selectOptions.value !== "it") {
    startTimer();
  } else {
    document.querySelector(
      ".timeLeft"
    ).innerHTML = `Done <b id="done"></b> | Infinite Time`;

    return;
  }
  function startTimer() {
    var presentTime = document.getElementById("timer").innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond(timeArray[1] - 1);
    if (s == 59) {
      m = m - 1;
    }
    if (m < 0) {
      alert("Over Time !!!");
      const btnSubmit = document.querySelector(".btnSubmit");
      btnSubmit.click();
      endQuiz();
      return;
    }

    document.getElementById("timer").innerHTML = m + ":" + s;
    const setTimer = setTimeout(startTimer, 1000);
    setTimer;
    const btnSubmit = document.querySelector(".btnSubmit");
    btnSubmit.onclick = () => {
      clearTimeout(setTimer);
      endQuiz();
    };
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {
      sec = "0" + sec;
    } // add zero in front of numbers < 10
    if (sec < 0) {
      sec = "59";
    }
    return sec;
  }
});

function endQuiz() {
  const dataSubmit = document.querySelectorAll(".body__questions-item");
  let array = [];
  let formChecked = [];
  dataSubmit.forEach((item, index) => {
    item.querySelectorAll(".body__answer").forEach((i, index) => {
      if (i.querySelector("input").checked) {
        // console.log(index);
        array.push(index);
        formChecked.push(i.parentElement.getAttribute("id"));
      }
      return array;
    });
  });
  //   console.log("TAMLONG ARRAY:", array);
  //   console.log("TAM LONG ARRAY FORM CHECKED:", formChecked);
  fetch("http://localhost:3333/api/question/" + topic)
    .then((res) => res.json())
    .then((data) => {
      let correctResults = [];
      data.forEach((item, index) => {
        correctResults.push(item.correct);
      });
      let userAnswers = Replace(array);
      console.log("correctAnswers:", correctResults);
      console.log("TAMLONG ARRAY:", userAnswers);
      console.log("TAM LONG ARRAY FORM CHECKED:", formChecked);
      const dataSubmit = document.querySelectorAll(".body__questions-item");
      let dem = 0;
      formChecked.forEach((item, index) => {
        if (userAnswers[index] === correctResults[item]) {
          dem += 1;
          dataSubmit[item]
            .querySelector(".signalPass")
            .classList.remove("d-none");
          dataSubmit[item].classList.add("border-success");
        } else {
          dataSubmit[item]
            .querySelector(".signalFail")
            .classList.remove("d-none");
          dataSubmit[item].classList.add("border-danger");
          const correctAnswerSite =
            dataSubmit[item].querySelector(".resultText");
          correctAnswerSite.classList.remove("d-none");
          correctAnswerSite.innerHTML = `Correct answer is ${correctResults[item]}`;
        }
      });
      let pointLadder = 10; //Thang điểm
      let finalResult = (dem / correctResults.length) * pointLadder;

      bodyTitle.innerHTML = `Your total score is <b class="text-success">${Math.round(
        finalResult
      )}</b> <span class="text-danger">(${Math.round(finalResult)}/10) </span>
      <button class="btn btn-success retryBtn" onClick="retryQuiz()">Retry Quiz 🔥 </button>
      `;
      dataSubmit.forEach((question, index) => {
        if (
          question.querySelector(".signalPass").getAttribute("class") ===
            "signalPass d-none" &&
          question.querySelector(".signalFail").getAttribute("class") ===
            "signalFail d-none"
        ) {
          question.querySelector(".signalSurrender").classList.remove("d-none");
          question.querySelector(".resultText").classList.remove("d-none");
          question.querySelector(
            ".resultText"
          ).innerHTML = `Correct answer is ${correctResults[index]}`;
        }
      });
    })
    .catch((error) => console.log(error));
}

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
// Ham xu li hien thi so cau da hoan thanh
let myArray = [];
function handleChangeQuestion(x) {
  const sumQuestions = document.querySelectorAll(
    ".body__questions-item"
  ).length; // lay tong so luong cac cau hoi
  let questionId = x.getAttribute("id");
  myArray.push(questionId);
  const uniqueMyArray = [...new Set(myArray)]; // tao mang k trung lap cac phan tu
  const doneQuestions = uniqueMyArray.length;
  // console.log(uniqueMyArray);
  if (doneQuestions < sumQuestions) {
    document.querySelector("#done").innerHTML =
      uniqueMyArray.length + "/" + sumQuestions;
  } else {
    document.querySelector("#done").innerHTML =
      uniqueMyArray.length +
      "/" +
      sumQuestions +
      " <i class='fas fa-check-circle doneIcon'></i>";
  }
}
