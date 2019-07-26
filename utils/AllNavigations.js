import {createSwitchNavigator, createAppContainer} from 'react-navigation'

// import the components
import Activities from '../src/screens/Activities_Lifetime/Activities'
import People from '../src/screens/People_Interface/People'
import Profile from '../src/screens/Profile_Interface/Profile'
import Invitation from '../src/screens/Invitation_Interface/Invitation'
import ChatContainer from '../src/screens/Chat_Interface/ChatContainer'
import SingleChat from '../src/screens/Chat_Interface/SingleChat'
import MyProfile from '../src/screens/Profile_Interface/MyProfile'
import Login from '../src/screens/LoginScreen/Login'
import Loading from '../src/screens/Loading_Screen/Loading'
import SignUp from '../src/screens/Signup_Screen/SignUp'
import CreateProfile from '../src/screens/Profile_Interface/CreateProfile'
import Promotion from '../src/screens/Promotion_Interface/Promotion'
import EditProfile from '../src/screens/Profile_Interface/EditProfile'
import SelectGender from '../src/screens/Signup_Screen/SelectGender'
import AddFirstName from '../src/screens/Signup_Screen/AddFirstName'
import AddDetails from '../src/screens/Signup_Screen/AddDetails'
import AddBestPicture from '../src/screens/Signup_Screen/AddBestPicture'
import SelectSource from '../src/screens/Signup_Screen/SelectSource'
import FinalStep from '../src/screens/Signup_Screen/FinalStep'

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
    EditProfile: {screen: EditProfile},
    SelectGender: {screen: SelectGender},
    AddFirstName: {screen: AddFirstName},
    AddDetails: {screen: AddDetails},
    AddBestPicture: {screen: AddBestPicture},
    SelectSource: {screen: SelectSource},
    FinalStep: {screen: FinalStep}
});

export const AppContainer = createAppContainer(AppSwitchNavigator);
