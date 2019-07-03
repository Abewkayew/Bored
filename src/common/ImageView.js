import PhotoView from 'react-native-photo-view';

const ImageView = (props) => {
    return(
        <PhotoView
            source={{uri: `${props.photoUrl}`}}
            minimumZoomScale={0.5}
            maximumZoomScale={3}
            androidScaleType="center"
            onLoad={() => console.log("Image loaded!")}
            style={{width: 300, height: 300}}
        />
    )
}
export default ImageView;