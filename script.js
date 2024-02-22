function createCanvas(canvas, gridSize) {

    gridSize = parseInt(gridSize);

    for (let i = 0; i < gridSize; i++) {
        const canvasRow = document.createElement('div');
        canvasRow.className = 'canvas-row';
       
        for (let j = 0; j < gridSize; j++) {
            const canvasPixel = document.createElement('div');
            canvasPixel.className = 'canvas-pixel';
            
            canvasPixel.addEventListener('mouseover', () => {
                let randomColorToggle = document.getElementById('toggle-random-color').checked;
                let opacityModeToggle = document.getElementById('toggle-opacity-mode').checked;

                let isBlankPixel = Boolean();

                // backgroundColor property is empty string even if 'rgba(255, 255, 255, 1.0)' assigned
                // in CSS, so use that to check for an existing color
                if (canvasPixel.style.backgroundColor == "") {
                    isBlankPixel = true;
                } else {
                    isBlankPixel = false;
                    currentColor = parseRGBA(canvasPixel.style.backgroundColor);

                    // alpha value missing if alpha is already 1.0, so manually push onto array
                    // returned from parseRGBA()
                    if (currentColor.length === 3) {
                        currentColor.push(1.0);
                    };
                }

                // if blank pixel, add either
                // - random color at min opacity (10%)
                // - black at min opacity (10%)
                // - random color at full opacity
                // - black at full opacity

                // ...otherwise, don't overwrite existing colors, only add opacity

                if (isBlankPixel) {
                    if (randomColorToggle && opacityModeToggle) {
                        let randomColor = getRandomRGBA(0.1);
                        canvasPixel.style.backgroundColor = `rgba(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]}, ${randomColor[3]})`;
                    } else if (!randomColorToggle && opacityModeToggle) {
                        canvasPixel.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    } else if (randomColorToggle && !opacityModeToggle) {
                        let randomColor = getRandomRGBA(1);
                        canvasPixel.style.backgroundColor = `rgba(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]}, ${randomColor[3]})`;
                    } else {
                        canvasPixel.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
                    }

                } else {
                    if (opacityModeToggle) {
                        newColor = addOpacity(currentColor, 0.1);
                        canvasPixel.style.backgroundColor = `rgba(${newColor[0]}, ${newColor[1]}, ${newColor[2]}, ${newColor[3]})`;
                    } else {
                        return;
                    }

                }

            });
            
            canvasRow.appendChild(canvasPixel);
        }

        canvas.appendChild(canvasRow);

        document.querySelector('.canvas-statistics').innerText = `Current grid size: ${gridSize} x ${gridSize}`;

    }
}


function removeCanvas(canvas) {
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}


function getRandomRGBA(alpha) {
    const rVal = Math.floor(Math.random() * 255);
    const gVal = Math.floor(Math.random() * 255);
    const bVal = Math.floor(Math.random() * 255);
    // for now, fixed alpha as specified as argument
    return [rVal, gVal, bVal, alpha];
}


function parseRGBA(input) {
    rgbaArr = input.match(/rgba?|(\d+(\.\d+)?%?)|(\.\d+)/g);

    // first element matches 'rgba', so just shift off of array
    rgbaArr.shift();
    return rgbaArr.map(Number);
}


function addOpacity(color, opacity) {
    let alpha = color[3] + opacity;
    if (alpha > 1) {
        alpha = 1;
    }
    color[3] = alpha
    return color;
}


const startButton = document.querySelector('.start-button');
const clearButton = document.querySelector('.clear-button');
const canvas = document.querySelector('.canvas');

let gridSize = 16;

startButton.addEventListener('click', () => {
    gridSize = prompt('Specify square grid size (max of 100):', gridSize);
    
    while (gridSize > 100) {
        gridSize = prompt('Please specify a square grid size size less than or equal to 100:', gridSize);
    }

    removeCanvas(canvas);
    createCanvas(canvas, gridSize);
});

clearButton.addEventListener('click', () => {
    if (confirm('Clear the canvas?')) {
        removeCanvas(canvas);
        createCanvas(canvas, gridSize);
    }
});

// default canvas on page load
createCanvas(canvas, gridSize);