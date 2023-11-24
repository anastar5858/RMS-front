const animationHanlder = (mode, cardContainer, setIndexCounter, lengthToCompare, index) => {
    // no animation should happen in these cases
    if (lengthToCompare === 0) {
        if (index - 1 < 0) return
    }
    if (lengthToCompare !== 0) {
        if (index + 1 > lengthToCompare) return
    }
    // next and prev radio buttons
    disableNavigation();
    // event listeners of animation endings
    // default
    const defaultEvent = () => {
        cardContainer.current.style.animation = 'none';
        enableNavigation();
        unhideElements();
        cardContainer.current.removeEventListener('animationend', defaultEvent);
        if (lengthToCompare === 0) {
            setIndexCounter(index > 0 ? index - 1 : index)
        } else {
            setIndexCounter(index < lengthToCompare ? index + 1 : index)    
        }
    }
    // rocket
    const rocketEvent = () => {
        const cardContainer =  document.getElementById('cardContainer')
        // revert all added configurations
        unhideElements()
        const countHeader = document.getElementById('rocketCount');
        if (countHeader) countHeader.remove();
        cardContainer.style.position = 'static';
        const rocketElipse = document.getElementById('ellipse-rocket');
        if (rocketElipse) rocketElipse.style.clipPath = 'none';
        const lines = [...document.getElementsByClassName('line-container')];
        if (lines.length > 0) lines.forEach((line) => line.remove());
        const clouds = [...document.getElementsByClassName('fireCloud')];
        if (clouds.length > 0) clouds.forEach((cloud) => cloud.remove());
        cardContainer.style.animation = 'none';
        enableNavigation();
        cardContainer.removeEventListener('animationend', rocketEvent);
        if (lengthToCompare === 0) {
            setIndexCounter(index > 0 ? index - 1 : index)
        } else {
            setIndexCounter(index < lengthToCompare ? index + 1 : index)    
        }
    }
    // fly
    const flyEvent = () => {
        const style = document.createElement('style');
        document.head.appendChild(style);
        const styleSheet = style.sheet;
        const cardContainer =  document.getElementById('cardContainer')
        cardContainer.style.animation = 'none'; 
        styleSheet.insertRule(`
        #ellipse::before {
            visibility: hidden;
          }
        `, styleSheet.cssRules.length);
        styleSheet.insertRule(`
          #ellipse::after {
            visibility: hidden;
          }
        `, styleSheet.cssRules.length);
        unhideElements();
        enableNavigation();
        cardContainer.removeEventListener('animationend', flyEvent);
        if (lengthToCompare === 0) {
            setIndexCounter(index > 0 ? index - 1 : index)
        } else {
            setIndexCounter(index < lengthToCompare ? index + 1 : index)    
        }
    }

    // only translation is applied
    if (mode === 'default') {
        hideElements();
        cardContainer.current.style.animation = 'translateY 3s 1';
        cardContainer.current.addEventListener('animationend', defaultEvent);
    }
    // rocket animation
    if (mode === 'rocket') {
        // make all content invisible
        hideElements();
        // add the counter header
        const counter = document.createElement('h1');
        counter.id = 'rocketCount';
        counter.textContent = '1';
        cardContainer.current.appendChild(counter);
        // make the card container position relative
        cardContainer.current.style.position = 'relative';
        // add the clip path
        document.getElementById('ellipse-rocket').style.clipPath = 'polygon(50% 18%, 100% 15%, 100% 100%, 0 100%, 0 15%)';
        let count = 0;
        let degrees = -10
        const prepareRocketLaunch = () => {
            document.getElementById('rocketCount').textContent = count + 1
            const cardContainer = document.getElementById('cardContainer');
            if (count === 9) {
                count = 0;
                degrees = -10;
                // show the cloud and translate
                const cloud = document.createElement('div');
                cloud.classList.add('fireCloud');
                cardContainer.appendChild(cloud);
                setTimeout(() => {
                    const cardContainer =  document.getElementById('cardContainer')
                    cardContainer.style.animation = 'translateY 3s 1 forwards';
                    cardContainer.addEventListener('animationend', rocketEvent);
                }  , 2000)
                return
            } else {
                const newLine = document.createElement('div');
                newLine.classList.add('line-container');
                newLine.style.transform = `rotate(${degrees}deg)`;
                count++
                degrees -= 20;
                cardContainer.appendChild(newLine)
                setTimeout(() => requestAnimationFrame(prepareRocketLaunch), 500)    
            }
        }
        requestAnimationFrame(prepareRocketLaunch);
    }
    // the fly animation
    if (mode === 'fly') {
        hideElements();
        const style = document.createElement('style');
        document.head.appendChild(style);
        const styleSheet = style.sheet;
        styleSheet.insertRule(`
        #ellipse::before {
            visibility: visible;
          }
        `, styleSheet.cssRules.length);
        
        styleSheet.insertRule(`
          #ellipse::after {
            visibility: visible;
          }
        `, styleSheet.cssRules.length);
        setTimeout(() => {
        const cardContainer =  document.getElementById('cardContainer')
        cardContainer.style.animation = 'translateY 3s 1'; 
        cardContainer.addEventListener('animationend', flyEvent); 
        }, 2000);  
    }
}

const hideElements = () => {
    document.getElementById('request-title').style.visibility = 'hidden';
    document.getElementById('request-desc').style.visibility = 'hidden';
    document.getElementById('request-status').style.visibility = 'hidden';
    document.getElementById('creator-sign').style.visibility = 'hidden';
    document.getElementById('date-sign').style.visibility = 'hidden';
    document.getElementById('live-edit-status').style.visibility = 'hidden';
    const deleteBtn = document.getElementById('delete-request-btn');
    if (deleteBtn) deleteBtn.style.visibility = 'hidden';
}

const unhideElements = () => {
    document.getElementById('request-title').style.visibility = 'visible';
    document.getElementById('request-desc').style.visibility = 'visible';
    document.getElementById('request-status').style.visibility = 'visible';
    document.getElementById('creator-sign').style.visibility = 'visible';
    document.getElementById('date-sign').style.visibility = 'visible';
    document.getElementById('live-edit-status').style.visibility = 'visible';
    const deleteBtn = document.getElementById('delete-request-btn');
    if (deleteBtn) deleteBtn.style.visibility = 'visible';
}

const disableNavigation = () => {
    document.getElementById('prev').disabled = true;
    document.getElementById('next').disabled = true;
    document.getElementById('default').disabled = true;
    document.getElementById('fly').disabled = true;
    document.getElementById('rocket').disabled = true;
}

const enableNavigation = () => {
    document.getElementById('prev').disabled = false;
    document.getElementById('next').disabled = false; 
    document.getElementById('default').disabled = false;
    document.getElementById('fly').disabled = false;
    document.getElementById('rocket').disabled = false; 
}