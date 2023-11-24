const DemoForm = () => {
    const demoTitle = React.useRef(null);
    const demoUrl = React.useRef(null);
    const demoElementsList = React.useRef(null);
    const [elementsCount, setElementsCount] = React.useState(0);
    const [elementsCountArr, setElementsCountArr] = React.useState([]);
    React.useEffect(() => {
        // max 10
        if (elementsCount <=10 && elementsCount > 0) {
            const arr = [];
            for (let i = 1; i <= elementsCount; i++) {
                arr.push(i);
            }
            setElementsCountArr(arr);
        }
        if (elementsCount === '0') {
            console.log(elementsCount);
            setElementsCountArr([]);
        } 
    }, [elementsCount])
    return (
        <>
            <h1 className='header-middle'>Welcome Develepor Create a demo for your features</h1>
            <form id='demo-form' className='plain-surface'>
            <section className='sec-flex'>
                <input ref={demoTitle} className='w-30 middle media-wide' type='text' placeholder='Title'></input>
                <input ref={demoUrl} className='w-30 middle media-wide' type='text' placeholder='Url'></input>
            </section>
            <section className='sec-flex w-center'>
                <input onInput={(e) => setElementsCount(e.currentTarget.value)} className='middle media-wide' type='number' placeholder='Elements'></input>
            </section>
            <section ref={demoElementsList} className='sec-flex-column'>
                {elementsCountArr.map((e) => {
                    return (
                        <div key={e} className='sec-flex-column'>
                            <input key={`id${e}`} className='w-30 middle media-wide' type='text' placeholder={` ${e} Element DOM Id`}></input>
                            <input key={`event${e}`} className='w-30 middle media-wide' type='text' placeholder={`${e} DOM Event Name`}></input>
                            <input key={`message${e}`} className='w-30 middle media-wide' type='text' placeholder={`${e} User Message`}></input>
                        </div>
                    )
                })}
            </section>
            <section id='request-btn' >
                <button id='publish-demo-btn' onClick={(e) => {
                    e.preventDefault();
                    validateDemo(demoTitle.current.value, demoUrl.current.value, demoElementsList)
                }} className='middle'>Publish</button>
            </section>
            </form>
        </>
    )
}