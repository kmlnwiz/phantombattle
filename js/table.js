$(function () {

    const SOUGOU = {
        'data': [
            [...Array(8)].map((element, i) => {
                return `<img class="no-save" src="image/${rank_image[i]}.png" style="height:1.75em;">`;
            }).reverse(),
            whole
        ],
        'thead': ['総合等級', '必要個別等級'],
    };

    const SINGLE = {
        'data': [
            [...Array(11)].map((element, i) => {
                return `<img class="no-save" src="image/${tokyu_image[i]}.png" style="height:1.75em;">`;
            }).reverse(),
            [...single].map(element => element.toLocaleString()).reverse()
        ],
        'thead': ['個別等級', '必要ポイント'],
    };

    const LEVEL = {
        'data': [Array.from({
                length: 35
            }, (_, i) => 34 - i),
            '',
            [...level].map(element => element.toLocaleString()).reverse(),
            '',
        ],
        'thead': ['刻印Lv.', '最大獲得Pt', '刻印Lv.クリアPt', '刻印レベルボーナス（SS）'],
    };
    LEVEL['data'][3] = LEVEL['data'][0].map(element => {
        return Math.floor(bonus[Math.floor(element / 5)] * bonus_rate[4]).toLocaleString();
    });
    LEVEL['data'][1] = LEVEL['data'][2].map((element, i) => {
        const level = Number(LEVEL['data'][2][i].replace(',', ''));
        const bonus = Number(LEVEL['data'][3][i].replace(',', ''));
        return (level + bonus * 3).toLocaleString();
    });

    const BONUS = {
        'data': [
            [...Array(7)].map((_, i) => `Lv.${i * 5} ～`).reverse(),
            [...bonus_border['avg']].map(element => element[0].toFixed(1) + ' 秒').reverse(),
            [...bonus_border['turn']].map(element => element[0] + ' ターン').reverse(),
            [...bonus_border['correct']].map(element => element[0] + ' %').reverse(),
        ],
        'thead': ['刻印Lv.', '平均解答時間', 'クリアターン', 'クイズ正解率'],
    }


    console.log(SOUGOU, SINGLE, LEVEL, BONUS);


    function generateTable(data, fs = 1) {
        let html = '';
        html +=
            `<table class="table table-hover table-sm align-middle" style="font-size:${fs}em;">` +
            `<thead class="">` +
            `<tr class="">`;

        for (let i = 0; i < data['thead'].length; i++) {
            html +=
                `<th class="text-center" scope="col">${data['thead'][i]}</th>`;
        };

        html +=
            `</tr>` +
            `</thead>` +
            `<tbody class="table-group-divider">`;

        for (let i = 0; i < data['data'][0].length; i++) {
            html += `<tr>`;
            for (let j = 0; j < data['data'].length; j++) {
                html +=
                    `<td class="text-center" scope="col">${data['data'][j][i]}</td>`;
            };
            html +=
                `</tr>`;
        };

        html +=
            `</tbody>` +
            `</table>`;

        return html;
    };

    $('#acc-item1').html(generateTable(SOUGOU));
    $('#acc-item2').html(generateTable(SINGLE));
    $('#acc-item3').html(generateTable(LEVEL, 0.9));
    $('#acc-item4').html(generateTable(BONUS, 0.9));
});
