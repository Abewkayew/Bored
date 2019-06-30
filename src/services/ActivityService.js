import Firebase from '../../utils/Config';

export const addActivity =  (activityName) => {
    Firebase.ref('/activitye').push({
        name: activityName
    });
}