(function (global) {
    let alertTemplate = (alertMessage, alertClass) => `<div class="alert ${alertClass} alert-dismissible fade" role="alert"><span>${alertMessage}</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
    let presetBtnTemplate = (coffeeName, coffeePresetId) => `<div class="col-sm"><button type="button" class="btn btn-primary btn-lg btn-block" data-coffee-id="${coffeePresetId}" data-toggle="button" aria-pressed="false" autocomplete="off">${coffeeName}</button></div>`;
    let statBtnTemplate = (statName, statKey, statValue) => `<div class="col-sm"><button type="button" class="btn btn-primary btn-lg btn-block" data-stat-key="${statKey}" data-stat-value="${statValue}" data-toggle="button" aria-pressed="false" autocomplete="off">${statValue}</button></div>`;
    let statTypeContainerTemplate = (statName) => `<div><h3>${statName}</h3><div class="row"></div></div>`;
    let coffeePresets = global._data.coffeePresets;

    let coffeePresetHtmlStr = "";
    let stats = {};
    $.each(coffeePresets, function (index, value) {
        coffeePresetHtmlStr += presetBtnTemplate(value.type, value.type);

        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                stats[key] = stats[key] || {};
                stats[key][value[key]] = 0;
            }
        }
    });

    let coffeeStatHtmlStr = "";
    let whitelistedStats = {class:true,beans:true,milk_tye:true,milk_used:true,coffee_used:true};
    for (var key in stats) {
        if (stats.hasOwnProperty(key) && whitelistedStats[key]) {
            let statName = toTitleCase(key.replace("_", " "));
            let statKey = key;
            let $typeContainer = $(statTypeContainerTemplate(statName));

            $.each(Object.keys(stats[key]), function (index, statKeyValue) {
                let compiled = statBtnTemplate(statName, statKey, statKeyValue);
                $typeContainer.find(".row").append($(compiled));
            });

            coffeeStatHtmlStr += $typeContainer.prop("outerHTML");
        }
    }

    $(document)
        .ready(function () {
            $("#coffeePresetContainer").html(coffeePresetHtmlStr);
            $("#coffeeStatsContainer").html(coffeeStatHtmlStr);
        })
        .on('click', '#coffeePresetContainer button[data-coffee-id]', function () {
            let coffeeId = $(this).attr('data-coffee-id');
            let preset = coffeePresets.find(function (value) {
                return value.type === coffeeId;
            });



            // $("#coffeePresetContainer button[data-coffee-id]")
            //     .attr("disabled", "disabled");

            // logCoffee(preset)
            //     .catch(data => {
            //         $("#coffeePresetContainer button[data-coffee-id]")
            //             .removeAttr("disabled");

            //         showAlert("Something went wrong!", "alert-danger");
            //     })
            //     .then(data => {
            //         $("#coffeePresetContainer button[data-coffee-id]")
            //             .removeAttr("disabled");

            //         showAlert("Log successfully submitted!", "alert-success");
            //     });
        });

    function showAlert(alertMessage, alertClass) {
        let $thisAlert = $(alertTemplate(alertMessage, alertClass));
        $(".alert-container").prepend($thisAlert);
        $thisAlert.addClass("show");
        setTimeout(() => {
            $thisAlert.remove();
        }, 3000);
    }

    function logCoffee(coffeelog) {
        var d = new Date();
        coffeelog.timestamp = d.toISOString();

        return new Promise(function (resolve, reject) {
            $.ajax("http://coffee-log.westeurope.cloudapp.azure.com:9200/coffee-log-" + d.toISOString().slice(0, 10) + "/_doc", {
                data: JSON.stringify(coffeelog),
                contentType: 'application/json',
                type: 'POST',
                success: resolve,
                error: reject
            });
        });
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }
}(window))