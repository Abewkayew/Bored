import {createSwitchNavigator, createAppContainer} from 'react-navigation'

// import the components
import Activities from '../src/screens/Activities_Lifetime/Activities';
import People from '../src/screens/People_Interface/People';
import Profile from '../src/screens/Profile_Interface/Profile';
import Invitation from '../src/screens/Invitation_Interface/Invitation';
import ChatContainer from '../src/screens/Chat_Interface/ChatContainer';
import SingleChat from '../src/screens/Chat_Interface/SingleChat';
import MyProfile from '../src/screens/Profile_Interface/MyProfile';
import Login from '../src/screens/LoginScreen/Login';
import Loading from '../src/screens/Loading_Screen/Loading';
import SignUp from '../src/screens/Signup_Screen/SignUp';
import CreateProfile from '../src/screens/Profile_Interface/CreateProfile';
import Promotion from '../src/screens/Promotion_Interface/Promotion';
import EditProfile from '../src/screens/Profile_Interface/EditProfile'

export const AppSwitchNavigator = createSwitchNavigator({
    Loading: {screen: Loading},
    Login: { screen: Login},
    SignUp: { screen: SignUp},
    CreateProfile: {screen: CreateProfile},
    Activity: { screen: Activities},
    People: {screen: People},
    Profile: {screen: Profile},
    Invitation: {screen: Invitation},
    ChatContainer: {screen: ChatContainer},
    SingleChat: {screen: SingleChat},
    MyProfile: {screen: MyProfile},
    Promotion: {screen: Promotion},
    EditProfile: {screen: EditProfile}
});

export const AppContainer = createAppContainer(AppSwitchNavigator);
