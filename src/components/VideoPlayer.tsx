import React, { useEffect, useState } from "react"
import "./VideoPlayer.scss"
import usePrevious from "./usePrevious"

interface Props {
  path: string
  onEnded: () => void
}

const VideoPlayer: React.FC<Props> = (props) => {
  const [path, setPath] = useState(props.path)

  useEffect(() => {
    setPath(props.path)
  }, [props.path])

  return (
    <div className='video-responsive'>
      <VideoElement path={path} onEnded={props.onEnded} />
    </div>
  )
}

interface VideoProps {
  path: string
  onEnded: () => void
}

const VideoElement: React.FC<VideoProps> = (props) => {
  const { path, onEnded } = props
  const previous = usePrevious(path)

  useEffect(() => {
    if (path === previous) return
    setTimeout(() => {
      const video = document.getElementById("videoElement") as HTMLVideoElement
      // Initialize video
      video.pause()
      video.load()
      video.play()
    }, 100)
  }, [path, previous])

  useEffect(() => {
    // set volume
    const video = document.getElementById("videoElement") as HTMLVideoElement
    const volume = localStorage.getItem("volume")
    if (volume && video) {
      video.volume = parseFloat(volume)
    }
  }, [])

  return (
    <video id='videoElement' autoPlay onVolumeChange={updateVolume} onEnded={onEnded} controls>
      <source src={path} type='video/mp4' />
    </video>
  )
}

const updateVolume = () => {
  // set volume in localStorage
  const video = document.getElementById("videoElement") as HTMLVideoElement
  localStorage.setItem("volume", video.volume.toString())
}

export default VideoPlayer
