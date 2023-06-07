import React, {useState,useEffect,useRef,useContext} from 'react'; 
import { Icon, Row, Col, Button, Layout } from 'antd';
import * as faceapi from 'face-api.js';
import UserContext from '../store/AuthContext';
import { uploadSelfie,doKyc } from '../services/user';
import { useNavigate } from 'react-router-dom';
const { Content, Header } = Layout;


const TakeSelfie=()=>{

  const [image,setImage]=useState("")
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [text,setText]=useState("")
  const { userState:{email}} = useContext(UserContext)

  const videoRef = useRef();
  const videoHeight = 240;
  const videoWidth = 320;
  const canvasRef = useRef();
  let timer
  const navigate=useNavigate()

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    loadModels();

    startVideo();
  
  }, []);

  // console.log(videoRef.current)

  // console.log("state1",image)

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
        if (detections.length > 0) {
          setText("Face Detected, Please Stay Stable")
          setTimeout(() => capturePicture(), 3000);
        }
        else{
          setText("No Face Detected")
        }

      
      }
    }, 100)
  }


  const uploadDocument = async()=>{
    try {
        if(image)
        {
          const formData = new FormData();
          formData.append('image', image);
          formData.append('email', email);
      
          const resp = await uploadSelfie(formData);
          console.log(resp);
          if(resp.success){
            navigate('/dokyc')
          }
        }
      } catch (e) {
        console.log(e);
      }
  }



  const capturePicture = async () => {
    if (canvasRef && canvasRef.current) {
      console.log('picture taken');
      const context = canvasRef.current.getContext('2d');
      
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      const dataURL = canvasRef.current.toDataURL();
      setImage(dataURL)
    
      if (dataURL !== null) {
        if (videoRef.current && videoRef.current.srcObject) {
          closeWebcam();
        }
      }
    }
  };

  const closeWebcam = () => {
    
    videoRef.current.pause();
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    setCaptureVideo(false);
};

  const RetakePicture = () => {
    setImage("")
    setCaptureVideo(true)
    startVideo()
  };

  const back = () => {
    
  };




  return(
    <div className="block">
    <Layout>
      <Header className="header">
        <div onClick={back}>
          <Icon style={{ fontSize: 16 }} type="arrow-left" /> <span>BACK</span>
        </div>
      </Header>
      <Layout>
        <Content className="main">
          <Row className="validation_logo_area">
            
          </Row>
          <Row  className="validation_title_area">
            <Col span={12} offset={7}>
                <span className="validation_choose_title">&ensp;Take&ensp;A&ensp;Picture</span>
            </Col>
          </Row>
          <Row className="preview_camera">
            <Col offset={4} span={16}>
            <div>
              {text!=="" &&  captureVideo && <h3 style={{textAlign : 'center'}}>{text}</h3>}
              {
                captureVideo ?
                  modelsLoaded ?
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                        <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                      </div>
                    </div>
                    :
                    <div>loading...</div>
                  :
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <img style={{borderRadius: '10px'}} alt="true" className="screenshot" src={image}/>
                  </div>
              }

            </div>
            </Col>
          </Row>
          <Row className="upload_btn_area">
            <Col className="take_area" offset={4} span={8}>
              <Button disabled={image ? true : false} className="take_btn">
                Take a Picture<Icon style={{ fontSize: 16, color: '#ffffff'}} type="camera" />
              </Button>
            </Col>
            <Col className="preview_area" span={8}>
              <Button disabled={!image ? true : false} className="preview_btn" onClick={RetakePicture}>
                Retake<Icon style={{ fontSize: 16, color: '#ffffff'}} type="eye" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col offset={4} span={16}>
              <Button className={image === '' ? "continue_btn" : "continue_enable_btn"} disabled={image === '' ? true : false} onClick={uploadDocument}>NEXT</Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  </div>
  )
}



export default TakeSelfie;