<!DOCTYPE html>
<html lang="ja">


<head>
    <meta charset="UTF-8" />
    <title>オフィスロッカー管理システム</title>
    <link rel="stylesheet" href="style.css"> <!-- CSS を読み込む -->
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
</head>


<body>
    <header class="header">
        <h1 class="header-title">オフィスロッカー管理システム</h1>
        <h3 class="header-mypage"><button class="mypage-button">マイページ</button></h3>
        <div id="mypage-area"></div>
    </header>

    <main>
        <div id="locker-grid" class="locker-grid"></div>
    </main>

    <script src="app.js"></script>
</body>

</html>

