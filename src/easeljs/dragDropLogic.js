
(function () {
    "use strict";

    var DragDropLogic = DragDropLogic || {};

    var _elementToMonitor;
    var _platformerGameInstance;

    // We need the canvas to monitor its drag&drop events
    // and the platformer game instance to trigger the loadnextlevel function
    DragDropLogic.monitorElement = function (elementToMonitor, platformerGameInstance) {
        _elementToMonitor = elementToMonitor;
        _platformerGameInstance = platformerGameInstance;

        _elementToMonitor.addEventListener("dragenter", DragDropLogic.drag, false);
        _elementToMonitor.addEventListener("dragover", DragDropLogic.drag, false);
        _elementToMonitor.addEventListener("drop", DragDropLogic.drop, false);
    };

    // We don't need to do specific actions
    // enter & over, we're only interested in drop
    DragDropLogic.drag = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };

    DragDropLogic.drop = function (e) {
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = dt.files;

        // Taking only the first dropped file
        var firstFileDropped = files[0];

        // Basic check of the type of file dropped
        if (firstFileDropped.type.indexOf("text") == 0) {
            var reader = new FileReader();
            // Callback function
            reader.onload = function (e) {
                // get file content
                var text = e.target.result;
                var textLevel = text.replace(/[\s\n\r\t]/g, '');
                // Warning, there is no real check on the consistency
                // of the file. 
                _platformerGameInstance.LoadThisTextLevel(textLevel);
            }
            // Asynchronous read
            reader.readAsText(firstFileDropped);
        }
    };

    window.DragDropLogic = DragDropLogic;
})();