$(document).ready(function() {
    $("#run").on("click", function (event) {
        var output = eval(parse($("#code").val()), createGlobalEnv());
        $("#run_output").html(output);
    });
    $("#clear").on("click", function (event) {
        $("#run_output").html("");
    });
});