(function (global) {
    let alertTemplate = (alertMessage, alertClass) => `<div class="alert ${alertClass} alert-dismissible fade" role="alert"><span>${alertMessage}</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
    let presetBtnTemplate = (coffeeName, coffeePresetId) => `<div class="col-sm"><button type="button" class="btn btn-primary btn-lg btn-block" data-coffee-id="${coffeePresetId}">${coffeeName}</button></div>`;
    let coffeePresets = global._data.coffeePresets;

    let htmlStr = "";
    $.each(coffeePresets, function (index, value) {
        htmlStr += presetBtnTemplate(value.type, value.type);
    });

    $(document)
        .ready(function () {
            $("#coffeePresetContainer").html(htmlStr);
        })
        .on('click', '#coffeePresetContainer button[data-coffee-id]', function () {
            let coffeeId = $(this).attr('data-coffee-id');
            let preset = coffeePresets.find(function (value) {
                return value.type === coffeeId;
            });

            $("#coffeePresetContainer button[data-coffee-id]")
                .attr("disabled", "disabled");

            logCoffee(preset)
                .catch(data => {
                    $("#coffeePresetContainer button[data-coffee-id]")
                        .removeAttr("disabled");

                    showAlert("Something went wrong!", "alert-danger");
                })
                .then(data => {
                    $("#coffeePresetContainer button[data-coffee-id]")
                        .removeAttr("disabled");

                    showAlert("Log successfully submitted!", "alert-success");
                });
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
}(window))