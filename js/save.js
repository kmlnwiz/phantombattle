function getData() {
    const data = {};
    const settings = {};

    const trialCountRadio1 = {};
    trialCountRadio1['startDate'] = $('#trial-count-date1').val();
    trialCountRadio1['endDate'] = $('#trial-count-date2').val();
    trialCountRadio1['includeStartDate'] = $('#on_today').prop('checked');
    settings['trialCountRadio1'] = trialCountRadio1;

    const trialCountRadio2 = {};
    trialCountRadio2['remainAttempts'] = $('#trial-count').val();
    settings['trialCountRadio2'] = trialCountRadio2;

    settings['selected'] = $('input[name=trialCountRadio]:checked').prop('id');
    settings['isCasual'] = $('#on_casual').prop('checked');

    data['settings'] = settings;

    const quests = {
        questA: {},
        questB: {},
        questC: {},
        questD: {},
    }

    Object.keys(quests).forEach((key) => {
        const questData = {};
        const target = $(`#${key}`);
        questData['name'] = target.find('input[id^="quest-name"]').val();
        questData['level'] = target.find('input[id^="seal-level"]').val();
        questData['currentPoint'] = target.find('input[id^="current-point"]').val();

        const levelBonus = {};
        levelBonus['averageTime'] = target.find('select[id^="average-time"]').val();
        levelBonus['clearTurn'] = target.find('select[id^="clear-turn"]').val();
        levelBonus['correctRate'] = target.find('select[id^="correct-rate"]').val();

        questData['levelBonus'] = levelBonus;
        quests[key] = questData;
    });


    data['quests'] = quests;
    return data;
}

function setData(data) {
    const settings = data.settings;
    const trialCountRadio1 = settings.trialCountRadio1;
    $('#trial-count-date1').val(trialCountRadio1.startDate);
    $('#trial-count-date2').val(trialCountRadio1.endDate);
    $('#on_today').prop('checked', trialCountRadio1.includeStartDate);
    const trialCountRadio2 = settings.trialCountRadio2;
    $('#trial-count').val(trialCountRadio2.remainAttempts);
    $(`#${settings.selected}`).prop('checked', true).change();
    $('#on_casual').prop('checked', settings.isCasual);

    const quests = data.quests;
    Object.keys(quests).forEach((key) => {
        const questData = quests[key];
        const target = $(`#${key}`);
        target.find('input[id^="quest-name"]').val(questData.name);
        target.find('input[id^="seal-level"]').val(questData.level);
        target.find('input[id^="current-point"]').val(questData.currentPoint);

        const levelBonus = questData.levelBonus;
        target.find('select[id^="average-time"]').val(levelBonus.averageTime);
        target.find('select[id^="clear-turn"]').val(levelBonus.clearTurn);
        target.find('select[id^="correct-rate"]').val(levelBonus.correctRate);
    });
}


function save() {
    const data = getData();
    console.log('save!', data);
    
    localStorage.setItem('data', JSON.stringify(data));
}

function load() {
    const data = localStorage.getItem('data');
    if (data) {
        setData(JSON.parse(data));
    }
    return data;
}

function reset() {
    localStorage.removeItem('data');
    location.reload();
}


function setAction() {
    $('input').change(() => {
        save();
    });
    $('select').change(() => {
        save();
    });
}
