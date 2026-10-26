
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
    if (mypageArea.style.display === "block") { //ブロックとして表示
      mypageArea.style.display = "none";　//表示しない
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
      });

      div.append(returnBtn);
    }

    mypageArea.innerHTML = "";
    mypageArea.append(div);
    mypageArea.style.display = "block";
  });
});





////////////////////// ロッカー情報の初期読み込み ///////////////////////
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


////////////////////// 共通関数 //////////////////////

// 自分のロッカーを取得（1人1つ）→同姓同名の人の場合は対応不可
function getMyLocker() {
  const username = localStorage.getItem("username");

  for (let i = 0; i < lockerinfo.length; i++) {
    if (lockerinfo[i].user === username) {
      return lockerinfo[i];
    }
  }
  return null;
}

// ロッカー描画
function renderLockers() {
  const lockergrid = document.querySelector("#locker-grid");
  lockergrid.innerHTML = "";

  for (let index = 0; index < lockerinfo.length; index++) {
    const locker = lockerinfo[index];

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

      if (front.style.display !== "none") {
        front.style.display = "none";
        back.style.display = "block";
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

  for (let i = 0; i < lockerinfo.length; i++) {
    if (lockerinfo[i].id === id) {
      lockerinfo[i].status = "in use";
      lockerinfo[i].user = username;
      lockerinfo[i].unit = unitname;
      lockerinfo[i].start = today;
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーの利用を受け付けました。");
}

// ロッカー返却
function returnLocker(id) {
  for (let i = 0; i < lockerinfo.length; i++) {
    if (lockerinfo[i].id === id) {
      lockerinfo[i].status = "empty";
      lockerinfo[i].user = "";
      lockerinfo[i].unit = "";
      lockerinfo[i].start = "";
    }
  }

  localStorage.setItem("lockerinfo", JSON.stringify(lockerinfo));
  renderLockers();
  alert("ロッカーを返却しました。");
}



