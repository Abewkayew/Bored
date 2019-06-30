import Firebase from '../../utils/Config';

export const addUser =  (user) => {
    Firebase.ref('/users').push({
        name: user
    });
}