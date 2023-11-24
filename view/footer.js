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
    // Call the fetchData function
    const urlParamater = new URLSearchParams(window.location.search);
    const lan = urlParamater.get('lan');
    // instructionMsg hooks the span element which will appear dynamically in the middle of elements with the text altering between the messages inside of the instructions array
    const instructionMsg = React.useRef(null);
    // quizzDropDown hooks to the select element which is the drop down list
    const quizDropDown = React.useRef(null);
    // quizzMessage hooks to the span element which is correct or incorrect response based on the answer from the drop down list
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
    // events for the demo
    async function reviewRules(event, demoObj) {
        try {
        // validate that the demo steps are not empty  
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
            // loop through each steps in demo steps array 
            for (const step of demoObj.demoElements) {
                // holds clicked element
                const elementId = step.id;
                // holds the event for each step
                const event = step.event
                // call the function responsible for handling the event based on rules (wait for it to finish)
                await eventsHandler(elementId, event, step)
                // the counter to acknowledge when the steps are done (start the quiz)
                counter++
                //  quizz handler is called after all steps completed
                 // shows the quiz
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
        // target holds element 
        const target = document.getElementById(elementId)
        // oldtext holds the content of the target 
        const oldText = target.value
        // positioning the messages 
        instructionMsg.current.classList.add('position-absolute', 'top-0', 'start-50', 'translate-middle', 'badge',  'bg-danger');
        instructionMsg.current.style.zIndex = `5`;
        target.appendChild(instructionMsg.current);
        target.classList.add('position-relative');
        target.style.border = 'solid red 0.2rem';
        
        // scroll to the target smoothly
        target.scrollIntoView({ behavior: "smooth" });
        // this promise is for each specific step
        return new Promise((resolve) => {
            // if the event is input
            if (event === 'input') {
                // timeout callback  
                setTimeout(() => {
                    let prevType;
                    if (document.getElementById(elementId).type === 'password') {
                        prevType = document.getElementById(elementId).type;
                        document.getElementById(elementId).type = 'text';
                    }
                    // display this mesage when demonstrating for the input element 
                    document.getElementById(elementId).value = step.message;
                    // timeout callback 
                    setTimeout(() => {
                        // back to normal  (resolve the promise)
                        if (prevType) document.getElementById(elementId).type = 'password';
                        document.getElementById(elementId).value = oldText;
                        target.style.border = 'none';
                        instructionMsg.current.style.display = 'none';
                        target.parentElement.classList.remove('position-relative');
                        resolve('step finished');
                    }, 1500);
                }, 1000);
            }
            // if it is click event 
            if (event === 'click') {
                // display the message in the 0 position (click on the element)
                instructionMsg.current.textContent = step.message;
                instructionMsg.current.style.display = 'block';
                        // check if instruction msg is out of the page
                if (windowWidth - getAdjustedPosition(instructionMsg.current).right < 0) {
                    instructionMsg.current.style.whiteSpace = `pre-wrap`;
                }
                // timeout callback
                setTimeout(() => {
                    // change the color of button to green 
                    document.getElementById(elementId).style.backgroundColor = 'green';
                    // timeout callback 
                    setTimeout(() => {
                        // back to normal (resolve the promise)
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
    // the quiz function
    async function quizHandler(demoSteps) {
        // step 2 loop through each event to initiate the quiz for each step
        let counter = 0;
        // loop through each steps in demo steps array
        for (const step of demoSteps) {
            // holds clicked elements
            const elementId = step.id
            // holds the event/action 
            const event = step.event
            await quizStep(elementId, event, step);
            // return the drop down list to the default value (to be ready for the next quiz)
            quizDropDown.current.value = 'select an option'
            counter++;
            // display add demo container and help demo container, add demo button , and help demo button when quiz is over to carry on with the desired actions 
            // the end of the demonstarion
            if (counter === demoSteps.length) {
                if (document.getElementById('demosListContainer')) document.getElementById('demosListContainer').style.display = 'block';
                document.getElementById('demo-btn').style.display = 'block';
                const demoCanvas = document.getElementById('demo-display');
                demoCanvas.style.display = 'none';
            }
        }
    }
    // This funtion construct the quiz for each element in the steps
    async function quizStep(elementId, event, step) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // insert the drop down list and message in their correct places
        // target holds the element id of the element
        const target = document.getElementById(elementId);
        //Display the drop down and message in middle
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
            // check if quiz is out of place
        // display the message in the 0 position (click on the element)
        if (windowWidth - getAdjustedPosition(quizDropDown.current.parentElement).right < 0) {
            const wrongRight = windowWidth - getAdjustedPosition(quizDropDown.current.parentElement).right;
            quizDropDown.current.parentElement.style.left = `${Math.abs(wrongRight)}px`;
            quizMessage.current.style.left = `${Math.abs(wrongRight)}px`;
            quizDropDown.current.parentElement.classList.remove('start-50');
        }
        // the promise checks function is responsible for evaluating the user's answers 
        return new Promise((resolve) => {
            // check if the user answered correctly or not by an event listener on every change on the drop down list
            // this event listener is removed after the correct answer and added again in the next step
            const quizEvent = (e) => {
                checkAnswer(e, event, resolve, elementId, target, quizEvent, step)
            };
            quizDropDown.current.addEventListener('change', quizEvent)
        })

    }
    
        async function checkAnswer(e, event, previousResolve, elementId, target, quizEvent, step) {
            // check if the answer is correct
            if (e.currentTarget.value === event) {
            // right answer we can move on
            quizMessage.current.textContent = 'Correct';
            //set a timer for the quiz question for 1.5 sec
            setTimeout(() => {
                // position the quizz and hide message 
                target.parentElement.classList.remove('position-relative')
                quizMessage.current.textContent = '';
                quizDropDown.current.parentElement.style.display = 'none';
                quizDropDown.current.style.display = 'none';
                quizMessage.current.style.display = 'none';
                target.style.border = 'none';
                quizDropDown.current.removeEventListener('change', quizEvent)
                // indicate that steps and quiz question have been completed for this event
                previousResolve(true);
            }, 1000 * 1.5);
            } else {
            // wrong answer repeat the only the step
            quizMessage.current.textContent = 'Incorrect';
            // after one second repeat the step 
            setTimeout(async () => {
                // hide any messages and the frop down list to prepare to demonstrate the single wrong answered step
                quizMessage.current.style.textContent = '';
                quizDropDown.current.parentElement.style.display = 'none';
                quizDropDown.current.style.display = 'none';
                quizMessage.current.style.display = 'none';
                let repeatStep;
                // validate if the event is not hover then 
                // hover requires the position object
                // store the result of repeated step 
                repeatStep = await eventsHandler(elementId, event, step)
                // keep on repeating and display the drop down and messages
                if (repeatStep === 'step finished') {
                // step was demonstrated now repeat the quiz until the right answers is provided
                quizMessage.current.textContent = '';
                target.style.border = 'none';
                quizDropDown.current.parentElement.style.display = 'block';
                quizDropDown.current.style.display = 'block';
                quizMessage.current.style.display = 'block';
                }
                //timer for 1.5 sec
            }, 1000 * 1.5)
            }
        }
        console.log()
    return (
        <>
            <button id='demo-btn' onClick={ () => setDemosVisualiser((prev) => !prev)} style={{bottom: '0', position: 'fixed', left: `${language === 'en' ? 0 : ''}`, right: `${language === 'ar' ? 0 : ''}`,}}> {!demosVisualiser ? Object.keys(languageData).length > 0 ? languageData.footer.helpBtbUnhide[language] : '' : Object.keys(languageData).length > 0 ? languageData.footer.helpBtbHide[language] : '' }</button>
            {demosVisualiser && (
                // dir={Object.keys(languageData).length > 0 ? languageData.direction[language] : ''}
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
                            {/* ul holding a  list of all published demos of the application */}
                            <ul style={{fontWeight:'bold'}}>
                                <strong>{Object.keys(languageData).length > 0 ? languageData.footer.listText[language] : '' }</strong>
                                {listOfDemos.map((demo) => {
                                    // extract the name
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
                                                    // execute the event
                                                    reviewRules(e, demoObj);
                                                }}>{Object.keys(languageData).length > 0 ? languageData.footer.reviewBtn[language] : '' }</button>
                                            </div>
                                            <span ref={instructionMsg} style={{display: 'none'}}></span>
                                            {/* quiz drop down list & message indicating correct or incorrect answers*/}
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