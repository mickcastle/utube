import React, { useEffect } from "react"
import "./Playlist.scss"
import videos from "../../index.json"

interface Props {
  videoOnClick: (index: number, title: string, path: string) => void
  filteredVideos: typeof videos
  activeVideo: string
}

const Playlist: React.FC<Props> = (props) => {
  useEffect(() => {
    // scroll to active video
    const activeVideo = document.querySelector(".video[data-title='" + props.activeVideo + "']") as HTMLButtonElement
    if (activeVideo) {
      activeVideo.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" })
    }
  }, [props.activeVideo])

  return (
    <div id='playlist-scroll' className='playlist-wrapper'>
      {props.filteredVideos.map((video, index) => {
        return (
          <button
            key={`${video.title}`}
            onClick={() => {
              props.videoOnClick(index, video.title, video.localPath)
            }}
            data-title={video.title}
            className={`video ${props.activeVideo === video.title ? "active" : ""}`}
          >
            {video.title}
          </button>
        )
      })}
    </div>
  )
}

export default Playlist
