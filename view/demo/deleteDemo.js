let sharedIndicator;
const DemoDelete = () => {
    const [allDemosDomain,  setAllDemosDomain] = React.useState([]);
    const [deleteIndicator, setDeleteIndicator] = React.useState(false);
    React.useEffect(async () => {
        sharedIndicator = setDeleteIndicator
        const domain = window.location.hostname
        getDemosOfDomain(domain, setAllDemosDomain);
    }, [deleteIndicator])
    return (
        <section className='sec-flex-column'>
            {allDemosDomain.length > 0 && (
                <>
                    {allDemosDomain.map((demo) => {
                        return (
                            <section key={demo.title} className='sec-flex-column'>
                                <input value={demo.title} disabled></input>
                                <button onClick={(e) => {
                                    const demoName = e.currentTarget.previousSibling.value;
                                    deleteDemo(demoName, e.currentTarget, setDeleteIndicator);
                                }}>Delete Demo</button>
                            </section>
                        )
                    })}
                </>
            )
            }
        </section>
    )
}