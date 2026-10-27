
////////////////////// ページ読み込み時の処理 //////////////////////
window.addEventListener("load", function () {

  // ユーザー登録
  let username = localStorage.getItem("username");
  let unitname = localStorage.getItem("unitname");

  // 初めてアクセスする場合の処理
  if (!username || !unitname) {
    username = window.prompt("名前を入力してください。");
    unitname = window.prompt("ユニット名を入力してください。");
    localStorage.setItem("username", username);
    localStorage.setItem("unitname", unitname);
  }

  // 初期表示（ロッカーを画面に出す）
  renderLockers();

  ////////////////////// マイページ //////////////////////
  const mypageButton = document.querySelector(".mypage-button");
  const mypageArea = document.querySelector("#mypage-area");

  mypageButton.addEventListener("click", function () {
    if (mypageArea.style.display === "block") { //ブロックとして表示する
      mypageArea.style.display = "none"; //表示しない
      return;
    }

    const username = localStorage.getItem("username");
    const unitname = localStorage.getItem("unitname");

    const div = document.createElement("div"); //マイページに載せる内容
    const myLocker = getMyLocker();
    div.innerHTML =
      "使用者: " + username + "<br>" +
      "ユニット名: " + unitname + "<br>";

    if (myLocker) {
      div.innerHTML += "使用ロッカー番号: " + myLocker.id + "<br>";

      const returnBtn = document.createElement("button");
      returnBtn.textContent = "ロッカーを返却する";
      returnBtn.className = "return-btn";

      returnBtn.addEventListener("click", function () {
        returnLocker(myLocker.id);
      });

      div.append(returnBtn);
    }

    mypageArea.innerHTML = "";
    mypageArea.append(div);
    mypageArea.style.display = "block";
  });
});







////////////////////// ロッカー情報の読み込み ///////////////////////
let lockerinfo = JSON.parse(localStorage.getItem("lockerinfo"));

if (!lockerinfo) {
  lockerinfo = [];
  for (let i = 1; i <= 25; i++) {
    lockerinfo.push({
      id: i,
      user: "",
      unit: "",
      status: "empty",
      start: ""
    });
  }
  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
}


////////////////////// 共通で使う関数 //////////////////////

// 自分のロッカーを取得（1人1つ）→同姓同名かつ同じユニットの場合は対応不可
function getMyLocker() {
  const username = localStorage.getItem("username");
  const unitname = localStorage.getItem("unitname");

  for (const locker of lockerinfo) {
    if (locker.user === username && locker.unit === unitname) {
      return locker;
    }
  }
  return null;
}

// ロッカー描画
function renderLockers() {
  const lockergrid = document.querySelector("#locker-grid");
  lockergrid.innerHTML = "";

  for (const locker of lockerinfo){

    const card = document.createElement("div");
    card.className = "locker-card";

    // 表
    const front = document.createElement("div");
    front.className = "locker-front";
    front.innerHTML =
      "番号: " + locker.id + "<br>" +
      "状態: " + locker.status + "<br>"; //→日本語表示にできず

    // 裏
    const back = document.createElement("div");
    back.className = "locker-back";
    back.style.display = "none"; //一時的に非表示にする
    back.innerHTML =
      "使用者: " + (locker.user || "なし") + "<br>" +
      "ユニット名: " + (locker.unit || "なし") + "<br>" +
      "利用開始日: " + (locker.start || "なし") + "<br>";

    // 空きロッカーだけ申請ボタン
    if (locker.status === "empty") {
      const applyBtnFront = document.createElement("button");
      applyBtnFront.textContent = "このロッカーを利用申請する";
      applyBtnFront.className = "apply-btn";
      applyBtnFront.addEventListener("click", function () {
        applyLocker(locker.id);
      });
      front.append(applyBtnFront);
    }

    card.append(front);
    card.append(back);
    lockergrid.append(card);

    // カードめくり
    card.addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") return;

      if (front.style.display !== "none") { //表が表示なら
        front.style.display = "none"; //表を非表示にして
        back.style.display = "block"; //裏をブロックとして表示
      } else {
        back.style.display = "none";
        front.style.display = "block";
      }
    });
  }
}

// ロッカー申請
function applyLocker(id) {
  const username = localStorage.getItem("username");
  const unitname = localStorage.getItem("unitname");
  const today = dayjs().format("YYYY年MM月DD日");

  const myLocker = getMyLocker();
  if (myLocker) {
    alert("すでにロッカーを使用中です。返却してから申請してください。");
    return;
  }

  for (const locker of lockerinfo) {
    if (locker.id === id) {
      locker.status = "in use";
      locker.user = username;
      locker.unit = unitname;
      locker.start = today;
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーの利用を受け付けました。");
}

// ロッカー返却
function returnLocker(id) {
  for (const locker of lockerinfo) {
    if (locker.id === id) {
      locker.status = "empty";
      locker.user = "";
      locker.unit = "";
      locker.start = "";
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーを返却しました。");
}



