////////////////////// ページ読み込み時の処理 //////////////////////
window.addEventListener("load", function () {

  // ユーザー登録
  let username = localStorage.getItem("username");
  let unitname = localStorage.getItem("unitname");

  if (!username || !unitname) {
    username = window.prompt("名前を入力してください。");
    unitname = window.prompt("ユニット名を入力してください。");
    localStorage.setItem("username", username);
    localStorage.setItem("unitname", unitname);
  }

  // 初期表示
  renderLockers();

  ////////////////////// マイページ //////////////////////
  const mypageButton = document.querySelector(".mypage-button");
  const mypageArea = document.querySelector("#mypage-area");

  mypageButton.addEventListener("click", function () {

    // トグル表示
    if (mypageArea.style.display === "block") {
      mypageArea.style.display = "none";
      return;
    }

    const username = localStorage.getItem("username");
    const unitname = localStorage.getItem("unitname");

    const div = document.createElement("div");
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
        mypageArea.style.display = "none"; // ←返却後に閉じる仕様
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
      status: "空き",
      start: ""
    });
  }
  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
}

////////////////////// 共通で使う関数 //////////////////////

// 自分のロッカー取得
function getMyLocker() {
  const username = localStorage.getItem("username");
  const unitname = localStorage.getItem("unitname");

  return lockerinfo.find(
    locker => locker.user === username && locker.unit === unitname
  ) || null;
}

// ロッカー描画
function renderLockers() {
  const lockergrid = document.querySelector("#locker-grid");
  lockergrid.innerHTML = "";

  for (const locker of lockerinfo) {

    const card = document.createElement("div");
    card.className = "locker-card";

    // 表
    const front = document.createElement("div");
    front.className = "locker-front";
    front.innerHTML =
      "番号: " + locker.id + "<br>" +
      "状態: " + locker.status + "<br>";

    // 空きロッカーだけ申請ボタン
    if (locker.status === "空き") {
      const applyBtnFront = document.createElement("button");
      applyBtnFront.textContent = "このロッカーを利用申請する";
      applyBtnFront.className = "apply-btn";

      applyBtnFront.addEventListener("click", function () {
        applyLocker(locker.id);
      });

      front.append(applyBtnFront);
    }

    // 裏
    const back = document.createElement("div");
    back.className = "locker-back";
    back.style.display = "none";

    back.innerHTML =
      "使用者: " + (locker.user || "なし") + "<br>" +
      "ユニット名: " + (locker.unit || "なし") + "<br>" +
      "利用開始日: " + (locker.start || "なし") + "<br>";

    card.append(front);
    card.append(back);
    lockergrid.append(card);

    // カードめくり
    card.addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") return;

      const isFront = front.style.display !== "none";
      front.style.display = isFront ? "none" : "block";
      back.style.display = isFront ? "block" : "none";
    });
  }
}

////////////////////// ロッカー申請 //////////////////////
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
      locker.status = "使用中";
      locker.user = username;
      locker.unit = unitname;
      locker.start = today;
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーの利用を受け付けました。");
}

////////////////////// ロッカー返却 //////////////////////
function returnLocker(id) {
  for (const locker of lockerinfo) {
    if (locker.id === id) {
      locker.status = "空き";
      locker.user = "";
      locker.unit = "";
      locker.start = "";
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーを返却しました。");
}
