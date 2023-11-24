let sharedRouter;
let sharedLan;
const DashboardRouter = () => {
    const urlParamater = new URLSearchParams(window.location.search);
    const lan = urlParamater.get('lan')
    const [language, setLanguage] = React.useState(lan ? lan : 'en');
    const [route, SetRoute] = React.useState('create');
    React.useEffect(() => {
        sharedLan = setLanguage;
        sharedRouter = SetRoute
    }, []);
    return (
        <>
            {route === 'create' && (<CreateForm language={language}/>)}
            {route === 'manage' && (<ManageView language={language}/>)}
        </>
    ) 
}