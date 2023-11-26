const getAdjustedPosition = (element) => {
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    return {
        top: rect.top + scrollY,
        left: rect.left + scrollX,
        right: rect.right + scrollX,
        bottom: rect.bottom + scrollY,
        width: rect.width,
        height: rect.height
    };
}
let sharedLanFooter;
const Footer = () => {
    const urlParamater = new URLSearchParams(window.location.search);
    const lan = urlParamater.get('lan');
    const instructionMsg = React.useRef(null);
    const quizDropDown = React.useRef(null);
    const quizMessage = React.useRef(null);
    const [listOfDemos, setListOfDemo] = React.useState([]);
    const [demosVisualiser, setDemosVisualiser] = React.useState(false);
    const [activeDemo, setActiveDemo] = React.useState([]);
    const [language, setLanguage] = React.useState(lan ? lan : 'en');
    const [languageData, setLanguageData] = React.useState({});
    React.useEffect(() => {
        fetchLanguageData(setLanguageData);
        sharedLanFooter = setLanguage;
        fetchAllDemos(setListOfDemo);
    }, [])
    async function reviewRules(event, demoObj) {
        try {
        if (Object.keys(demoObj).length > 0) {
            event.preventDefault();
            const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            const demoCanvas = document.getElementById('demo-display');
            demoCanvas.width = windowWidth;
            demoCanvas.height = windowHeight;
            demoCanvas.style.display = 'block';
            document.getElementById('demosListContainer').style.display = 'none';
            document.getElementById('demo-btn').style.display = 'none';
            let counter = 0
            for (const step of demoObj.demoElements) {
                const elementId = step.id;
                const event = step.event
                await eventsHandler(elementId, event, step)
                counter++
                if (counter === demoObj.demoElements.length) {
                    quizHandler(demoObj.demoElements);
                }
            }
        }
        } catch (e) {
            if (document.getElementById('demosListContainer')) document.getElementById('demosListContainer').style.display = 'block';
            document.getElementById('demo-btn').style.display = 'block';
            const demoCanvas = document.getElementById('demo-display');
            demoCanvas.style.display = 'none';
        }
     }
     function eventsHandler(elementId, event, step) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const target = document.getElementById(elementId)
        const oldText = target.value
        instructionMsg.current.classList.add('position-absolute', 'top-0', 'start-50', 'translate-middle', 'badge',  'bg-danger');
        instructionMsg.current.style.zIndex = `5`;
        target.appendChild(instructionMsg.current);
        target.classList.add('position-relative');
        target.style.border = 'solid red 0.2rem';
        target.scrollIntoView({ behavior: "smooth" });
        return new Promise((resolve) => {
            if (event === 'input') {
                setTimeout(() => {
                    let prevType;
                    if (document.getElementById(elementId).type === 'password') {
                        prevType = document.getElementById(elementId).type;
                        document.getElementById(elementId).type = 'text';
                    }
                    document.getElementById(elementId).value = step.message;
                    setTimeout(() => {
                        if (prevType) document.getElementById(elementId).type = 'password';
                        document.getElementById(elementId).value = oldText;
                        target.style.border = 'none';
                        instructionMsg.current.style.display = 'none';
                        target.parentElement.classList.remove('position-relative');
                        resolve('step finished');
                    }, 1500);
                }, 1000);
            }
            if (event === 'click') {
                instructionMsg.current.textContent = step.message;
                instructionMsg.current.style.display = 'block';
                if (windowWidth - getAdjustedPosition(instructionMsg.current).right < 0) {
                    instructionMsg.current.style.whiteSpace = `pre-wrap`;
                }
                setTimeout(() => {
                    document.getElementById(elementId).style.backgroundColor = 'green';
                    setTimeout(() => {
                        document.getElementById(elementId).style.backgroundColor = '';
                        target.style.border = 'none';
                        instructionMsg.current.style.removeProperty('white-space');
                        instructionMsg.current.style.display = 'none';
                        target.parentElement.classList.remove('position-relative');
                        console.log('ummmm', instructionMsg.current.style.display, instructionMsg.current);
                        resolve('step finished');
                    }, 1500);
                }, 1000);
            }
        });
    }
    async function quizHandler(demoSteps) {
        let counter = 0;
        for (const step of demoSteps) {
            const elementId = step.id
            const event = step.event
            await quizStep(elementId, event, step);
            quizDropDown.current.value = 'select an option'
            counter++;
            if (counter === demoSteps.length) {
                if (document.getElementById('demosListContainer')) document.getElementById('demosListContainer').style.display = 'block';
                document.getElementById('demo-btn').style.display = 'block';
                const demoCanvas = document.getElementById('demo-display');
                demoCanvas.style.display = 'none';
            }
        }
    }
    async function quizStep(elementId, event, step) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const target = document.getElementById(elementId);
        quizDropDown.current.parentElement.style.display = 'block';
        quizDropDown.current.style.display = 'block';
        quizMessage.current.style.display = 'block';
        target.parentElement.appendChild(quizDropDown.current.parentElement);
        target.parentElement.appendChild(quizMessage.current);
        target.style.border = 'solid red 0.2rem';
        target.classList.add('position-relative');
        const targetDimensions = getAdjustedPosition(target);
        const formDimensions = getAdjustedPosition(target.parentElement);
        const topOffset = targetDimensions.top - formDimensions.top;
        quizDropDown.current.parentElement.classList.add('position-absolute', 'badge',  'bg-danger');
        quizDropDown.current.classList.add('badge',  'bg-danger');
        quizMessage.current.classList.add('position-absolute', 'badge',  'bg-danger');
        quizDropDown.current.parentElement.style.top = `${target.parentElement.tagName === 'FORM' ? topOffset : targetDimensions.top}px`;
        quizDropDown.current.style.zIndex = `5`;
        quizDropDown.current.parentElement.style.zIndex = `5`;
        quizDropDown.current.parentElement.style.left = `${targetDimensions.left}px`;
        quizMessage.current.style.top = `${target.parentElement.tagName === 'FORM' ? topOffset : targetDimensions.top}px`;
        quizMessage.current.style.zIndex = `5`;
        quizMessage.current.style.left = `${targetDimensions.left}px`;
        if (windowWidth - getAdjustedPosition(quizDropDown.current.parentElement).right < 0) {
            const wrongRight = windowWidth - getAdjustedPosition(quizDropDown.current.parentElement).right;
            quizDropDown.current.parentElement.style.left = `${Math.abs(wrongRight)}px`;
            quizMessage.current.style.left = `${Math.abs(wrongRight)}px`;
            quizDropDown.current.parentElement.classList.remove('start-50');
        }
        return new Promise((resolve) => {
            const quizEvent = (e) => {
                checkAnswer(e, event, resolve, elementId, target, quizEvent, step)
            };
            quizDropDown.current.addEventListener('change', quizEvent)
        })

    }
    
        async function checkAnswer(e, event, previousResolve, elementId, target, quizEvent, step) {
            if (e.currentTarget.value === event) {
            quizMessage.current.textContent = 'Correct';
            setTimeout(() => {
                target.parentElement.classList.remove('position-relative')
                quizMessage.current.textContent = '';
                quizDropDown.current.parentElement.style.display = 'none';
                quizDropDown.current.style.display = 'none';
                quizMessage.current.style.display = 'none';
                target.style.border = 'none';
                quizDropDown.current.removeEventListener('change', quizEvent)
                previousResolve(true);
            }, 1000 * 1.5);
            } else {
            quizMessage.current.textContent = 'Incorrect';
            setTimeout(async () => {
                quizMessage.current.style.textContent = '';
                quizDropDown.current.parentElement.style.display = 'none';
                quizDropDown.current.style.display = 'none';
                quizMessage.current.style.display = 'none';
                let repeatStep;
                repeatStep = await eventsHandler(elementId, event, step)
                if (repeatStep === 'step finished') {
                quizMessage.current.textContent = '';
                target.style.border = 'none';
                quizDropDown.current.parentElement.style.display = 'block';
                quizDropDown.current.style.display = 'block';
                quizMessage.current.style.display = 'block';
                }
            }, 1000 * 1.5)
            }
        }
        console.log()
    return (
        <>
            <button id='demo-btn' onClick={ () => setDemosVisualiser((prev) => !prev)} style={{bottom: '0', position: 'fixed', left: `${language === 'en' ? 0 : ''}`, right: `${language === 'ar' ? 0 : ''}`,}}> {!demosVisualiser ? Object.keys(languageData).length > 0 ? languageData.footer.helpBtbUnhide[language] : '' : Object.keys(languageData).length > 0 ? languageData.footer.helpBtbHide[language] : '' }</button>
            {demosVisualiser && (
                        <div id='demosListContainer' style={{
                            backgroundColor:'lightgray',
                            bottom: '5%',
                            zIndex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '50%',
                            position: 'fixed',
                            gap: '1rem',
                            left: `${language === 'en' ? 0 : ''}`,
                            right: `${language === 'ar' ? 0 : ''}`
                          }} >
                            <ul style={{fontWeight:'bold'}}>
                                <strong>{Object.keys(languageData).length > 0 ? languageData.footer.listText[language] : '' }</strong>
                                {listOfDemos.map((demo) => {
                                    const name = demo.title;
                                    return (
                                        <li key={`${name}`}>
                                            <div  id={`${name}`} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                                <span>{name}</span>
                                                <button id={`${name}-demo`} onClick={(e) => {
                                                    let demoObj;
                                                    for (const demo of listOfDemos) {
                                                        if (demo.title === e.currentTarget.parentElement.id) {
                                                            demoObj = demo
                                                            e.currentTarget.style.backgroundColor = 'violet';
                                                            setActiveDemo(demo)
                                                        } else {
                                                            const demoCon = [...document.getElementById(demo.title).children]
                                                            demoCon[1].style.backgroundColor = 'buttonface';
                                                        }
                                                    }
                                                    reviewRules(e, demoObj);
                                                }}>{Object.keys(languageData).length > 0 ? languageData.footer.reviewBtn[language] : '' }</button>
                                            </div>
                                            <span ref={instructionMsg} style={{display: 'none'}}></span>
                                            <div id='custom-select-quiz-container' className="custom-select" style={{display: 'none'}}>
                                                <select id='custom-select-quiz-menu' ref={quizDropDown} style={{display: 'none'}}>
                                                <option id='quiz-answer-select' value='select an option'>{Object.keys(languageData).length > 0 ? languageData.footer.quizQuestion[language] : '' }</option>
                                                <option id='quiz-answer-click' value='click'>{Object.keys(languageData).length > 0 ? languageData.footer.quizClick[language] : ''}</option>
                                                <option id='quiz-answer-input' value='input'>{Object.keys(languageData).length > 0 ? languageData.footer.quizInput[language] : ''}</option>
                                                </select>
                                            </div>
                                            <span id='quiz-answer-message' ref={quizMessage} style={{display: 'none'}}></span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
            )}
        </>
    )
}