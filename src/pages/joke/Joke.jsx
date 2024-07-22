import React, { useEffect } from 'react';


const Joke = () => {


    useEffect(() => {

        const redirectUrl = 'https://youtu.be/PkT0PJwy8mI?si=sOLp2e3iYoCOdbk-';

        window.location.href = redirectUrl;
    }, []);

    return (<div>Загрузка...</div>);
};

export default Joke;
