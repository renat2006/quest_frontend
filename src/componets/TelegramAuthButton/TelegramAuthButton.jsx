import React, {useEffect} from 'react';

const TelegramAuthButton = () => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'kilometrZero_authorization_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');

        document.getElementById('telegram-login-button').appendChild(script);

        window.onTelegramAuth = function (user) {
            alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        };

    }, []);

    return (
        <div id="telegram-login-button"></div>
    );
};

export default TelegramAuthButton;
