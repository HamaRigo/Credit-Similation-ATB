import React from 'react';
import { notification } from 'antd';

class Notifications {
    openNotificationWithIcon = (type: string, message, icon?: React.ReactNode, duration?: number) => {
        notification[type]({
            placement: 'topRight',
            message: type,
            description: (
                <>
                    {message}
                    <div className="progress-bar">
                        <span className={duration ? 'percentage notif-login' : 'percentage'} />
                    </div>
                </>
            ),
            icon: icon,
            duration: duration,
        });
    };
}

export default new Notifications();