(function splitCompositionIntoFramesDescendingOrder() {
    app.beginUndoGroup("Split Composition into Frames (Descending Order)");

    // Get the active composition
    var comp = app.project.activeItem;

    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select an active composition.");
        app.endUndoGroup();
        return;
    }

    // Prompt for the desired frame rate
    var frameRate = prompt("Enter the desired frame rate (e.g., 24):", comp.frameRate);
    if (!frameRate || isNaN(frameRate) || frameRate <= 0) {
        alert("Invalid frame rate.");
        app.endUndoGroup();
        return;
    }

    frameRate = parseFloat(frameRate);
    var frameDuration = 1 / frameRate;

    // Create a list of layers to split
    var originalLayers = [];
    for (var i = 1; i <= comp.numLayers; i++) {
        originalLayers.push(comp.layer(i));
    }

    // Track duplicated layers to reorder later
    var duplicatedLayers = [];

    // Iterate over each frame of the composition
    var numFrames = Math.floor(comp.duration / frameDuration);

    for (var t = 0; t < numFrames; t++) {
        var time = t * frameDuration;

        // Iterate through the original layers
        for (var j = 0; j < originalLayers.length; j++) {
            var layer = originalLayers[j];

            // Ensure the layer exists and is active at the current time
            if (layer && layer.inPoint <= time && layer.outPoint > time) {
                var splitLayer = layer.duplicate();
                splitLayer.inPoint = time;
                splitLayer.outPoint = time + frameDuration;
                splitLayer.startTime = time; // Adjust the layer's starting point
                duplicatedLayers.push(splitLayer);
            }
        }
    }

    // Arrange all duplicated layers in descending order
    for (var i = duplicatedLayers.length - 1; i >= 0; i--) {
        duplicatedLayers[i].moveToBeginning();
    }

    alert("Frames successfully split into separate layers in descending order!");
    app.endUndoGroup();
})();
