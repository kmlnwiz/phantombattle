// idが"quest"から始まる要素内のフォームが変更されたときに呼び出される関数を定義する
function handleFormChange() {
    // フォームの値を取得する
    const input_values = {
        fieldName: ['questA', 'questB', 'questC', 'questD'],
        sealLevel: $('input[id^="seal-level"]').map(function () {
            return $(this).val();
        }).get(),
        avgTime: $('select[id^="average-time"]').map(function () {
            return $(this).val();
        }).get(),
        clearTurn: $('select[id^="clear-turn"]').map(function () {
            return $(this).val();
        }).get(),
        correctRate: $('select[id^="correct-rate"]').map(function () {
            return $(this).val();
        }).get()
    };

    const point_array = [];
    for (let i = 0; i < 4; i++) {
        point_array.push({
            fieldName: input_values['fieldName'][i],
            sealLevelPoint: level[input_values['sealLevel'][i]],
            avgTimePoint: bonus_calc(i, input_values['avgTime'][i], input_values['sealLevel'][i]),
            clearTurnPoint: bonus_calc(i, input_values['clearTurn'][i], input_values['sealLevel'][i]),
            correctRatePoint: bonus_calc(i, input_values['correctRate'][i], input_values['sealLevel'][i]),
            getPoint: 0,
        });
        point_array[i]['getPoint'] = point_array[i]['sealLevelPoint'] + point_array[i]['avgTimePoint'] + point_array[i]['clearTurnPoint'] + point_array[i]['correctRatePoint'];
    };
    //console.log(input_values, point_array);

    $('#get-pointA').html($('#on_casual').prop('checked') ? (point_array[0]['getPoint'] * 3).toLocaleString() : point_array[0]['getPoint'].toLocaleString());
    $('#get-pointB').html($('#on_casual').prop('checked') ? (point_array[1]['getPoint'] * 3).toLocaleString() : point_array[1]['getPoint'].toLocaleString());
    $('#get-pointC').html($('#on_casual').prop('checked') ? (point_array[2]['getPoint'] * 3).toLocaleString() : point_array[2]['getPoint'].toLocaleString());
    $('#get-pointD').html($('#on_casual').prop('checked') ? (point_array[3]['getPoint'] * 3).toLocaleString() : point_array[3]['getPoint'].toLocaleString());

    point_calc()
};

handleFormChange();

// idが"quest"から始まる要素内のフォームの変更を監視する
$('[id^="quest"] select').on('change', handleFormChange);
$('#on_casual').on('change', handleFormChange);

// input要素に対して、値が変更されたときのイベントを設定する
$('[id^="quest"] input').on('change', function () {
    const value = $(this).val(); // 入力値を取得する

    if (value < 0 || value > 30) { // 入力値が0未満または30を超える場合
        $(this).val(''); // 入力値をクリアにする
    } else {
        handleFormChange();
    };
});

function bonus_calc(i, rank, seal) {
    let rate, base = bonus[Math.floor(seal / 5)];
    if (rank == "SS") {
        rate = bonus_rate[0];
    } else if (rank == "S") {
        rate = bonus_rate[1];
    } else if (rank == "A") {
        rate = bonus_rate[2];
    } else if (rank == "B") {
        rate = bonus_rate[3];
    } else if (rank == "C") {
        rate = bonus_rate[4];
    };
    return Math.floor(base * rate);
};


//幻闘戦　総合等級計算
function point_calc() {

    const calclated = [];

    const point = [
        Number($('#get-pointA').text().replace(/,/g, '')),
        Number($('#get-pointB').text().replace(/,/g, '')),
        Number($('#get-pointC').text().replace(/,/g, '')),
        Number($('#get-pointD').text().replace(/,/g, ''))
    ];
    //console.log(point);

    //個別等級　必要挑戦回数
    const SG = []; //single count
    for (let i = 0; i < point.length; i++) {
        SG.push(single.map(element => {
            return Math.ceil(element / point[i]);
        }));
    };
    console.log(SG);


    const A = SG[0];
    const B = SG[1];
    const C = SG[2];
    const D = SG[3];

    for (let i = 0; i < 5; i++) {
        let minCost = Infinity;
        let result = [];
        let GOAL = whole[i];

        for (let a = 0; a < A.length && A[a] <= 100; a++) {
            for (let b = 0; b < B.length && A[a] + B[b] <= 100; b++) {
                for (let c = 0; c < C.length && A[a] + B[b] + C[c] <= 100; c++) {
                    for (let d = 0; d < D.length && A[a] + B[b] + C[c] + D[d] <= 100; d++) {
                        const totalCost = A[a] + B[b] + C[c] + D[d];
                        const totalPoints = a + b + c + d + 4;
                        if (totalPoints >= GOAL && totalCost <= minCost) {
                            minCost = totalCost;
                            result = [
                                [SG[0][a], SG[1][b], SG[2][c], SG[3][d]],
                                [a + 1, b + 1, c + 1, d + 1],
                            ];
                        };
                    };
                };
            };
        };
        calclated.push(result);
    };

    for (let i = 0; i < calclated.length; i++) {
        calclated[i].length == 0 ? calclated[i] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ] : "";
    };

    if ($('#on_casual').prop('checked')) {
        calclated[0] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        calclated[1] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    };

    console.log("選択されたアイテム:", calclated);


    for (let i = 0; i < calclated.length; i++) {

        $(`#${sougou_tokyu[i]}-questA-single-rank`).html(`<img class="" src="https://i-cf.quiz.colopl.jp/img/event/class/${kobetsu_image[calclated[i][1][0]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questA-single-point`).html((calclated[i][0][0] * point[0]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questA-single-count`).html(`${calclated[i][0][0]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questB-single-rank`).html(`<img class="" src="https://i-cf.quiz.colopl.jp/img/event/class/${kobetsu_image[calclated[i][1][1]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questB-single-point`).html((calclated[i][0][1] * point[1]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questB-single-count`).html(`${calclated[i][0][1]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questC-single-rank`).html(`<img class="" src="https://i-cf.quiz.colopl.jp/img/event/class/${kobetsu_image[calclated[i][1][2]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questC-single-point`).html((calclated[i][0][2] * point[2]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questC-single-count`).html(`${calclated[i][0][2]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questD-single-rank`).html(`<img class="" src="https://i-cf.quiz.colopl.jp/img/event/class/${kobetsu_image[calclated[i][1][3]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questD-single-point`).html((calclated[i][0][3] * point[3]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questD-single-count`).html(`${calclated[i][0][3]}<span class="d-inline-block small mx-1">/100</span>`);

    };


};
