// idが"quest"から始まる要素内のフォームが変更されたときに呼び出される関数を定義する
function handleFormChange() {
    // フォームの値を取得する
    const input_values = {
        field: ['A', 'B', 'C', 'D'],
        fieldName: ['questA', 'questB', 'questC', 'questD'],
        questName: $('input[id^="quest-name"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get(),
        sealLevel: $('input[id^="seal-level"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get(),
        currentPoint: $('input[id^="current-point"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get(),
        avgTime: $('select[id^="average-time"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get(),
        clearTurn: $('select[id^="clear-turn"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get(),
        correctRate: $('select[id^="correct-rate"]').map(function () {
            return escapeJs(escapeHtml($(this).val()));
        }).get()
    };

    const point_array = [];
    for (let i = 0; i < 4; i++) {
        point_array.push({
            field: input_values['field'][i],
            fieldName: input_values['fieldName'][i],
            sealLevelPoint: level[input_values['sealLevel'][i]],
            currentPoint: input_values['currentPoint'][i],
            avgTimePoint: bonus_calc(i, input_values['avgTime'][i], input_values['sealLevel'][i]),
            clearTurnPoint: bonus_calc(i, input_values['clearTurn'][i], input_values['sealLevel'][i]),
            correctRatePoint: bonus_calc(i, input_values['correctRate'][i], input_values['sealLevel'][i]),
            getPoint: 0,
        });
        point_array[i]['getPoint'] = point_array[i]['sealLevelPoint'] + point_array[i]['avgTimePoint'] + point_array[i]['clearTurnPoint'] + point_array[i]['correctRatePoint'];
        $('#on_casual').prop('checked') ? point_array[i]['getPoint'] = point_array[i]['getPoint'] * 3 : '';
    };
    //console.log(input_values, point_array);

    for (let i = 0; i < point_array.length; i++) {
        $(`.quest${point_array[i]['field']}-name`).html(`${input_values['questName'][i] ? input_values['questName'][i] : `クエスト${point_array[i]['field']}`}`);

        $(`#get-point${point_array[i]['field']}`).html(`${point_array[i]['getPoint'].toLocaleString()}<span class="small"> Pt</span>`);

        $(`#quest${point_array[i]['field']}-get-point`).html(`${point_array[i]['getPoint'].toLocaleString()}<span class="small"> Pt</span>`);

        $(`#quest${point_array[i]['field']}-seal-level`).html(`<span class="small">Lv. </span>${input_values['sealLevel'][i]}`);

        $(`#quest${point_array[i]['field']}-current-point`).html(`${Number(input_values['currentPoint'][i]).toLocaleString()}<span class="small"> Pt</span>`);

        $(`#quest${point_array[i]['field']}-avg-rank`).html(`<img class="no-save mb-0" src="image/grade_${input_values['avgTime'][i]}_mkjhbji.png" style="height:1.75em;">`);

        //$(`#quest${point_array[i]['field']}-avg-rank-border`).html(`${(bonus_border['avg'][Math.floor(input_values['sealLevel'][i]/5)]).toFixed(1)}秒以内でSS`);

        $(`#quest${point_array[i]['field']}-turn-rank`).html(`<img class="no-save mb-0" src="image/grade_${input_values['clearTurn'][i]}_mkjhbji.png" style="height:1.75em;">`);

        //$(`#quest${point_array[i]['field']}-turn-rank-border`).html(`${(bonus_border['turn'][Math.floor(input_values['sealLevel'][i]/5)])}ﾀｰﾝ以内でSS`);

        $(`#quest${point_array[i]['field']}-correct-rank`).html(`<img class="no-save mb-0" src="image/grade_${input_values['correctRate'][i]}_mkjhbji.png" style="height:1.75em;">`);

        //$(`#quest${point_array[i]['field']}-correct-rank-border`).html(`${(bonus_border['correct'][Math.floor(input_values['sealLevel'][i]/5)])}%以上でSS`);
    };

    const date = new Date();
    $('#generate-date').html(`generated ${date.getFullYear()}/${('00' + (date.getMonth() + 1)).slice(-2)}/${('00' + (date.getDate())).slice(-2)}`);


    $('#which-mode').html($('#on_casual').prop('checked') ? '<span class="col d-inline-block text-bg-success text-center py-1">カジュアルモード</span>' : '<span class="col d-inline-block text-bg-danger text-center py-1">チャレンジモード</span>');
    point_calc(point_array);
};

handleFormChange();

// idが"quest"から始まる要素内のフォームの変更を監視する
$('[id^="quest"] select').on('change', handleFormChange);
$('#on_casual').on('change', handleFormChange);

$('[id^="trialCountRadioInput"] input').on('change', handleFormChange);


$('input[id^="trialCountRadio"]').on('change', function () {
    const value = $(this).val();
    //console.log(value)

    if (value == 1) {
        $('#trialCountRadioInput1 input').prop('disabled', false);
        $('#trialCountRadioInput2 input').prop('disabled', true);

    } else if (value == 2) {
        $('#trialCountRadioInput1 input').prop('disabled', true);
        $('#trialCountRadioInput2 input').prop('disabled', false);
    };
    handleFormChange();
})

// input要素に対して、値が変更されたときのイベントを設定する
$('[id^="quest"] input[class^="seal-level"]').on('change', function () {
    let value = ($(this).val()); // 入力値を取得する

    //エスケープ処理
    //value = escapeHtml(value);
    //value = escapeJs(value);
    //value = Number(toHalf(value));

    if (value <= 0) { // 入力値が0以下の場合
        value = 0; // 入力値を0にする
    } else if (value >= 35) { // 入力値が30以上の場合
        value = 30; // 入力値を30にする
    };

    $(this).val(value);
    handleFormChange();
});

// input要素に対して、値が変更されたときのイベントを設定する
$('[id^="quest"] input[class^="current-point"]').on('change', function () {
    let value = $(this).val(); // 入力値を取得する

    //エスケープ処理
    //value = escapeHtml(value);
    //value = escapeJs(value);
    //value = Number(toHalf(value));

    if (value <= 0) { // 入力値が0以下の場合
        value = 0; // 入力値を0にする
    } else if (String(value).length >= 7) { // 入力値が7桁以上の場合
        value = String(value).slice(0, 7); // 入力値を7桁にする
    };
    if (value > 3000000) { // 入力値が3000000以上の場合
        value = 3000000; // 入力値を3000000にする
    };
    $(this).val(value);
    handleFormChange();
});

// input要素に対して、値が変更されたときのイベントを設定する
$('input[class^="trial-count"]').on('change', function () {
    let value = $(this).val(); // 入力値を取得する

    //エスケープ処理
    //value = escapeHtml(value);
    //value = escapeJs(value);
    //value = Number(toHalf(value));

    if (value <= 0) { // 入力値が0以下の場合
        value = 0; // 入力値を0にする
    } else if (value >= 100) { // 入力値が100以上の場合
        value = 100; // 入力値を100にする
    };
    $(this).val(value);
    handleFormChange();
});

// input要素に対して、値が変更されたときのイベントを設定する
$('input[id^="quest-name"]').on('change', function () {
    let value = $(this).val(); // 入力値を取得する

    //エスケープ処理
    //value = escapeHtml(value);
    //value = escapeJs(value);

    //$(this).val(es(value));
    handleFormChange();
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
function point_calc(arr) {

    const calclated = [];

    function dateCount(date1, date2) {
        function dateDiff(date1, date2) {
            const diffInMs = new Date(date2) - new Date(date1);
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            return diffInDays;
        };
        let date = dateDiff(date1, date2);
        if (!$('#on_today').prop('checked')) {
            date = date - 1;
        };
        if (date < 0) {
            date = 0;
        } else if (date > 20) {
            date = 20;
        };

        return date * 5;
    };
    const trialRadio1 = dateCount($('#trial-count-date1').val(), $('#trial-count-date2').val());
    const trialRadio2 = Number(escapeJs(escapeHtml($('#trial-count').val())));
    console.log(trialRadio1, trialRadio2);

    const trialCount = $('#trialCountRadio1').prop('checked') ? trialRadio1 : trialRadio2;
    //console.log(trialCount);


    const point = [
        Number(arr[0]['getPoint']),
        Number(arr[1]['getPoint']),
        Number(arr[2]['getPoint']),
        Number(arr[3]['getPoint'])
    ];
    //console.log(point);

    //個別等級　必要挑戦回数
    const currentPoint = [
        Number(arr[0]['currentPoint']),
        Number(arr[1]['currentPoint']),
        Number(arr[2]['currentPoint']),
        Number(arr[3]['currentPoint']),
    ];
    //console.log(currentPoint);

    const SG = []; //single count
    for (let i = 0; i < point.length; i++) {
        SG.push(single.map(element => {
            return Math.ceil((element - currentPoint[i] >= 0 ? element - currentPoint[i] : 0) / point[i]);
        }));
    };
    //console.log(SG);


    const A = SG[0];
    const B = SG[1];
    const C = SG[2];
    const D = SG[3];

    for (let i = 0; i < 5; i++) {
        let minCost = Infinity;
        let minDays = Infinity;
        let variance = Infinity;
        let totalPoint = whole[i];

        // 最適な組み合わせ
        let bestResult = null;

        // 条件に合致する全ての組み合わせを保存するための配列
        const allResults = [{
            arr: [0, 0, 0, 0],
            indexes: [0, 0, 0, 0],
            days: Infinity,
            cost: Infinity,
            variance: Infinity
        }];


        for (let a = 0; a < A.length && A[a] <= trialCount; a++) {
            for (let b = 0; b < B.length && A[a] + B[b] <= trialCount; b++) {
                for (let c = 0; c < C.length && A[a] + B[b] + C[c] <= trialCount; c++) {
                    for (let d = 0; d < D.length && A[a] + B[b] + C[c] + D[d] <= trialCount; d++) {
                        const COST = A[a] + B[b] + C[c] + D[d];
                        const POINT = a + b + c + d;

                        if (POINT >= totalPoint) {
                            const arr = [SG[0][a], SG[1][b], SG[2][c], SG[3][d]];
                            const DAYS = arr.reduce((acc, cur) => {
                                return acc + Math.ceil(cur / 5);
                            }, 0);
                            const AVG = arr.reduce((acc, val) => acc + val) / arr.length;
                            const VARY = arr.reduce((acc, val) => acc + Math.pow(val - AVG, 2), 0) / arr.length;

                            allResults.push({
                                arr,
                                indexes: [a, b, c, d],
                                days: DAYS,
                                cost: COST,
                                variance: VARY
                            });
                        };
                    };
                };
            };
        };

        // 最適な組み合わせを選択
        if (allResults.length > 0) {
            // 優先度①　総回数最小
            allResults.sort((a, b) => a.cost - b.cost);

            // 優先度②　各日数最小
            const minCostResults = allResults.filter(
                result => result.cost === allResults[0].cost
            );
            minCostResults.sort((a, b) => a.days - b.days);

            // 優先度③　分散最小
            const minDaysResults = minCostResults.filter(
                result => result.days === minCostResults[0].days
            );
            minDaysResults.sort((a, b) => a.variance - b.variance);

            bestResult = minDaysResults[0];
        }

        // bestResultに最適な組み合わせが保存される
        console.log(`個別等級${totalPoint}`, bestResult);

        calclated.push([bestResult['arr'], bestResult['indexes']]);
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
        let progress = [
            `<div class="progress rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="${calclated[i][1][0]}" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: ${calclated[i][1][0] / 40 * 100}%"><div class="progress-bar" style="background: linear-gradient(to bottom, rgba(254,169,223,0) 0%,rgba(254,169,223,100) 40%);"></div></div>`,
            `<div class="progress rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="${calclated[i][1][1]}" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: ${calclated[i][1][1] / 40 * 100}%"><div class="progress-bar" style="background: linear-gradient(to bottom, rgba(89,206,230,0) 0%,rgba(89,206,230,100) 40%)"></div></div>`,
            `<div class="progress rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="${calclated[i][1][2]}" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: ${calclated[i][1][2] / 40 * 100}%"><div class="progress-bar" style="background: linear-gradient(to bottom, rgba(253,235,72,0) 0%,rgba(253,235,72,100) 40%);"></div></div>`,
            `<div class="progress rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="${calclated[i][1][3]}" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: ${calclated[i][1][3] / 40 * 100}%"><div class="progress-bar" style="background: linear-gradient(to bottom, rgba(144,74,216,0) 0%,rgba(144,74,216,100) 40%);"></div></div>`,
            `<div class="progress rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="${40 - calclated[i][1].reduce((acc, cur) => {
            return acc + cur;
        }, 0)}" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: ${(40 - calclated[i][1].reduce((acc, cur) => {
            return acc + cur;
        }, 0)) / 40 * 100}%"><div class="progress-bar" style="background-color:transparent;"></div></div>`,
        ];
        $(`#${sougou_tokyu[i]}-progress`).html(progress.join('\n'));

        let progress_scale = [];
        for (let j = 0; j < 40; j++) {
            if (j == 0) {
                progress_scale.push(`<div class="progress border border-top-0 border-bottom-0 border-start-0 rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="1" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: 2.5%; border-width: 0.75px!important;"><div class="progress-bar bg-transparent" style=""></div></div>`);
            } else if (j == 39) {
                progress_scale.push(`<div class="progress border border-top-0 border-bottom-0 border-end-0 rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="1" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: 2.5%; border-width: 0.75px!important;"><div class="progress-bar bg-transparent" style=""></div></div>`);
            } else {
                progress_scale.push(`<div class="progress border border-top-0 border-bottom-0 rounded-0 bg-transparent" role="progressbar" aria-label="Segment one" aria-valuenow="1" aria-valuemin="0" aria-valuemax="40" style="height:2.5em; width: 2.5%; border-width: 0.75px!important;"><div class="progress-bar bg-transparent" style=""></div></div>`);
            };
        };
        $(`.progress-scale`).html(progress_scale.join('\n'));


        $(`#${sougou_tokyu[i]}-questA-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][0]]}.png" style="height:2.50em;">`);
        $(`#${sougou_tokyu[i]}-questA-single-point`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${(single[calclated[i][1][0]] - currentPoint[0] >= 0 ? single[calclated[i][1][0]] - currentPoint[0] : 0).toLocaleString()}</span>`);
        $(`#${sougou_tokyu[i]}-questA-single-count`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${calclated[i][0][0]}<span class="d-inline-block small mx-1">/ ${trialCount}</span></span>`);

        $(`#${sougou_tokyu[i]}-questB-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][1]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questB-single-point`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${(single[calclated[i][1][1]] - currentPoint[1] >= 0 ? single[calclated[i][1][1]] - currentPoint[1] : 0).toLocaleString()}</span>`);
        $(`#${sougou_tokyu[i]}-questB-single-count`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${calclated[i][0][1]}<span class="d-inline-block small mx-1">/ ${trialCount}</span></span>`);

        $(`#${sougou_tokyu[i]}-questC-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][2]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questC-single-point`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${(single[calclated[i][1][2]] - currentPoint[2] >= 0 ? single[calclated[i][1][2]] - currentPoint[2] : 0).toLocaleString()}</span>`);
        $(`#${sougou_tokyu[i]}-questC-single-count`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${calclated[i][0][2]}<span class="d-inline-block small mx-1">/ ${trialCount}</span></span>`);

        $(`#${sougou_tokyu[i]}-questD-single-rank`).html(`<img class="no-save" src="image/${kobetsu_image[calclated[i][1][3]]}.png" style="height:2.5em;">`);
        $(`#${sougou_tokyu[i]}-questD-single-point`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${(single[calclated[i][1][3]] - currentPoint[3] >= 0 ? single[calclated[i][1][3]] - currentPoint[3] : 0).toLocaleString()}</span>`);
        $(`#${sougou_tokyu[i]}-questD-single-count`).html(`<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${calclated[i][0][3]}<span class="d-inline-block small mx-1">/ ${trialCount}</span></span>`);

        $(`#${sougou_tokyu[i]}-count-margin`).html(calclated[i][1].reduce((acc, cur) => {
            return acc + cur;
        }, 0) > 0 ? `<span class="small" style="font-size:0.7em;">あと</span><span class="d-inline-block text-center" style="width:5.25em;">${calclated[i][0].reduce((acc, cur) => {
            return acc + cur;
        }, 0)}<span class="d-inline-block small mx-1">/ ${trialCount}</span></span>` : `<span class="d-inline-block small mx-1 text-danger">達成不可</span>`);

    };


};

function escapeHtml(str) {
    return str.replace(/[&'`"<>]/g, function (match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
            '\\': '\\'
        } [match];
    });
};

function escapeJs(str) {
    return str.replace(/[\\'"\/\b\f\n\r\t]/g, function (match) {
        return {
            '\\': '\\\\',
            '"': '\\"',
            "'": "\\'",
            '/': '\\/',
            '\b': '\\b',
            '\f': '\\f',
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t'
        } [match];
    });
};

function toHalf(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};
