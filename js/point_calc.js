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

    $('#questA-get-point').html($('#on_casual').prop('checked') ? (point_array[0]['getPoint'] * 3).toLocaleString() : point_array[0]['getPoint'].toLocaleString());
    $('#questB-get-point').html($('#on_casual').prop('checked') ? (point_array[1]['getPoint'] * 3).toLocaleString() : point_array[1]['getPoint'].toLocaleString());
    $('#questC-get-point').html($('#on_casual').prop('checked') ? (point_array[2]['getPoint'] * 3).toLocaleString() : point_array[2]['getPoint'].toLocaleString());
    $('#questD-get-point').html($('#on_casual').prop('checked') ? (point_array[3]['getPoint'] * 3).toLocaleString() : point_array[3]['getPoint'].toLocaleString());

    $('#questA-seal-level').html(`<span class="small">Lv.</span>${input_values['sealLevel'][0]}`);
    $('#questB-seal-level').html(`<span class="small">Lv.</span>${input_values['sealLevel'][1]}`);
    $('#questC-seal-level').html(`<span class="small">Lv.</span>${input_values['sealLevel'][2]}`);
    $('#questD-seal-level').html(`<span class="small">Lv.</span>${input_values['sealLevel'][3]}`);

    $('#questA-avg-rank').html(input_values['avgTime'][0]);
    $('#questB-avg-rank').html(input_values['avgTime'][1]);
    $('#questC-avg-rank').html(input_values['avgTime'][2]);
    $('#questD-avg-rank').html(input_values['avgTime'][3]);

    $('#questA-turn-rank').html(input_values['clearTurn'][0]);
    $('#questB-turn-rank').html(input_values['clearTurn'][1]);
    $('#questC-turn-rank').html(input_values['clearTurn'][2]);
    $('#questD-turn-rank').html(input_values['clearTurn'][3]);

    $('#questA-correct-rank').html(input_values['correctRate'][0]);
    $('#questB-correct-rank').html(input_values['correctRate'][1]);
    $('#questC-correct-rank').html(input_values['correctRate'][2]);
    $('#questD-correct-rank').html(input_values['correctRate'][3]);

    $('#which-mode').html($('#on_casual').prop('checked') ? '<span class="col d-inline-block text-bg-success text-center py-1">カジュアルモード</span>' : '<span class="col d-inline-block text-bg-danger text-center py-1">チャレンジモード</span>');
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
        let priority = 20;
        let variance = 10000;
        let GOAL = whole[i];

        for (let a = 0; a < A.length && A[a] <= 100; a++) {
            for (let b = 0; b < B.length && A[a] + B[b] <= 100; b++) {
                for (let c = 0; c < C.length && A[a] + B[b] + C[c] <= 100; c++) {
                    for (let d = 0; d < D.length && A[a] + B[b] + C[c] + D[d] <= 100; d++) {
                        const totalCost = A[a]/5 + B[b]/5 + C[c]/5 + D[d]/5;
                        const totalPoints = a + b + c + d + 4;
                        if (totalPoints >= GOAL && totalCost <= minCost) {
                            let pri_num = 0;
                            let arr = [SG[0][a], SG[1][b], SG[2][c], SG[3][d]];

                            pri_num = arr.reduce((acc, cur) => {
                                return acc + Math.ceil(cur / 5);
                            }, 0);

                            const avg = arr.reduce((acc, val) => acc + val) / arr.length;
                            const vary = arr.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / arr.length;

                            if (priority >= pri_num && variance >= vary) {
                                minCost = totalCost;
                                result = [
                                    arr,
                                    [a + 1, b + 1, c + 1, d + 1],
                                ];
                                priority = pri_num
                                variance = vary;
                            };
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

        $(`#${sougou_tokyu[i]}-questA-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][0]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questA-single-point`).html((calclated[i][0][0] * point[0]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questA-single-count`).html(`${calclated[i][0][0]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questB-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][1]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questB-single-point`).html((calclated[i][0][1] * point[1]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questB-single-count`).html(`${calclated[i][0][1]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questC-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][2]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questC-single-point`).html((calclated[i][0][2] * point[2]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questC-single-count`).html(`${calclated[i][0][2]}<span class="d-inline-block small mx-1">/100</span>`);

        $(`#${sougou_tokyu[i]}-questD-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][3]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questD-single-point`).html((calclated[i][0][3] * point[3]).toLocaleString());
        $(`#${sougou_tokyu[i]}-questD-single-count`).html(`${calclated[i][0][3]}<span class="d-inline-block small mx-1">/100</span>`);

    };


};
