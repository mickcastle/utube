import { useEffect, useRef, useState } from "react"
import "./App.css"
import VideoPlayer from "./components/VideoPlayer"
import videos from "../index.json"
import PlayList from "./components/Playlist"
import { debounce } from "lodash"
import useEventListener from "./components/useEventListener"
import { useLocalStorage } from "./components/useLocalStorage"

const toggleSong = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <path d='M0 0h512v512H0z' fill='currentColor'></path>
    <g transform='translate(0,0)'>
      <path
        d='M427.6 106c15.6.1 27.7 13.8 25.7 29.3-16 124-16 117.4 0 241.4 2.5 19.8-17.4 35-35.8 27.3l-267-111.1v98.8c0 7.9-8.9 14.2-20 14.3H78.49c-11.1-.1-20-6.4-20-14.3V120.2c.1-7.8 9-14.1 20-14.2h52.01c11 .1 19.9 6.4 20 14.2v98.9l267-111.1c3.2-1.3 6.6-2 10.1-2z'
        fill='#000000'
      ></path>
    </g>
  </svg>
)

const pauseIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <path d='M0 0h512v512H0z' fill='currentColor' />
    <g transform='translate(0,0)'>
      <path
        d='M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z'
        fill='#000000'
      />
    </g>
  </svg>
)

const playIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <path d='M0 0h512v512H0z' fill='currentColor' />
    <g transform='translate(0,0)'>
      <path
        d='M106.854 106.002a26.003 26.003 0 0 0-25.64 29.326c16 124 16 117.344 0 241.344a26.003 26.003 0 0 0 35.776 27.332l298-124a26.003 26.003 0 0 0 0-48.008l-298-124a26.003 26.003 0 0 0-10.136-1.994z'
        fill='#000000'
      />
    </g>
  </svg>
)

function App() {
  const [media, setMedia] = useState(videos[0].localPath)
  const [title, setTitle] = useState(videos[0].title)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [filteredVideos, setFilteredVideos] = useState(shuffledVideos)
  const [isPaused, setIsPaused] = useLocalStorage("paused", false)
  const pauseButtonRef = useRef<HTMLButtonElement>(null)
  const fakeScrollerRef = useRef<HTMLDivElement>(null)
  useEventListener("scroll", () => scrollPlaylistFromOutside(), fakeScrollerRef.current)

  // focus input on keypress
  useEffect(() => {
    const fakeScroller = document.getElementById("fakeScroller") as HTMLDivElement
    fakeScroller.scrollTop = 200

    document.addEventListener("keydown", (e) => {
      // if key is letter or number, focus the input and type there
      if (/^[a-z0-9\s\b]+$/.exec(e.key) || e.key === "Backspace" || e.key === "Shift") {
        const input = document.querySelector("input")
        if (input) {
          input.focus()
        }
      }
    })

    return () => {
      document.removeEventListener("keydown", () => {})
    }
  }, [])

  // sets up fake scrolling div to be in a position where it can scroll up and down without moving to scroll playlist
  useEffect(() => {
    if (fakeScrollerRef.current) {
      fakeScrollerRef.current.scrollTop = 200
      fakeScrollerRef.current.onscroll = () => {
        scrollPlaylistFromOutside()
      }
    }
  }, [fakeScrollerRef])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnInput = (e: any) => {
    const inputValue = e.target.value
    // loosely match the title of the video with the input value
    const video = videos.filter((video) => video.title.toLowerCase().includes(inputValue.toLowerCase()))
    if (video) {
      setFilteredVideos(video)
    }
  }

  const handleOnEnded = () => {
    // if the last video in the playlist is played, set the mediaIndex to 0
    const lastIndex = filteredVideos.length - 1
    if (mediaIndex === lastIndex) {
      setMediaIndex(0)
    } else {
      setMediaIndex(mediaIndex + 1)
    }

    const nextSong = mediaIndex === lastIndex ? filteredVideos[0] : filteredVideos[mediaIndex + 1]

    setTitle(nextSong.title)
    setMedia(nextSong.localPath)

    const video = document.getElementById("videoElement") as HTMLVideoElement
    video.pause()
    video.load()
    video.play()
  }

  // Play next song button
  const handleNextSong = () => {
    const lastIndex = filteredVideos.length - 1
    if (mediaIndex === lastIndex) {
      setMediaIndex(0)
    } else {
      setMediaIndex(mediaIndex + 1)
    }

    const nextSong = mediaIndex === lastIndex ? filteredVideos[0] : filteredVideos[mediaIndex + 1]

    handleSong(nextSong.title, nextSong.localPath)
  }

  // Play previous song button
  const handlePreviousSong = () => {
    const lastIndex = filteredVideos.length - 1
    if (mediaIndex === 0) {
      setMediaIndex(lastIndex)
    } else {
      setMediaIndex(mediaIndex - 1)
    }

    const previousSong = mediaIndex === 0 ? filteredVideos[lastIndex] : filteredVideos[mediaIndex - 1]
    handleSong(previousSong.title, previousSong.localPath)
  }

  // Loads and plays the song
  const handleSong = (title: string, path: string) => {
    setIsPaused(false)

    setTitle(title)
    setMedia(path)

    setTimeout(() => {
      const video = document.getElementById("videoElement") as HTMLVideoElement
      video.pause()
      video.load()
      video.play()
    }, 100)
  }

  // Scroll to active video
  const scrollToVideo = () => {
    const activeVideo = document.querySelector(".video[data-title='" + title + "']") as HTMLButtonElement
    if (activeVideo) {
      activeVideo.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" })
    }
  }

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    const previousButton = document.querySelector(".previous") as HTMLButtonElement
    previousButton.click()
  })
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    const nextButton = document.querySelector(".next") as HTMLButtonElement
    nextButton.click()
  })
  navigator.mediaSession.setActionHandler("pause", () => {
    pauseButtonRef.current?.click()
  })
  navigator.mediaSession.setActionHandler("play", () => {
    pauseButtonRef.current?.click()
  })

  return (
    <>
      <div ref={fakeScrollerRef} id='fakeScroller'>
        <div className='big-element'></div>
      </div>

      <input type='text' onInput={handleOnInput} placeholder='Filter by value.includes()' />

      <h1>{title}</h1>

      <div className='controls'>
        <button className='scrollToActive' onClick={scrollToVideo}>
          Scroll to active video 👇
        </button>

        <button
          onClick={() => {
            const video = document.getElementById("videoElement") as HTMLVideoElement
            video.pause()
            window.open("https://www.youtube.com/results?search_query=" + title + " synthesia")
          }}
          className='scrollToActive'
        >
          Search for synthesia videos
        </button>

        <p className='video-count'>
          {filteredVideos.length === 0 ? "Finns iiiige" : filteredVideos.length + ` / ${videos.length}`}
        </p>

        <div style={{ display: "flex" }}>
          <button style={{ background: "white", color: "white" }} className='previous' onClick={handlePreviousSong}>
            {toggleSong}
          </button>

          <button
            id='playPause'
            ref={pauseButtonRef}
            style={{ color: isPaused ? "green" : "red" }}
            className={`${isPaused ? "play" : "pause"}`}
            onClick={() => {
              setIsPaused(!isPaused)
            }}
          >
            {isPaused ? playIcon : pauseIcon}
          </button>

          <button style={{ background: "white", color: "white" }} className='next' onClick={handleNextSong}>
            {toggleSong}
          </button>
        </div>
      </div>

      <div className='player'>
        <PlayList
          filteredVideos={filteredVideos}
          videoOnClick={(index, title, path) => {
            setIsPaused(false)

            setTimeout(() => {
              setMediaIndex(index)
              setTitle(title)
              setMedia(path)
            }, 0)
          }}
          activeVideo={title}
        />

        <div id='video-wrapper'>{!isPaused && <VideoPlayer onEnded={handleOnEnded} path={media} />}</div>
      </div>
    </>
  )
}

const scrollPlaylistFromOutside = debounce(() => {
  const fakeScroller = document.getElementById("fakeScroller") as HTMLDivElement
  const playlist = document.getElementById("playlist-scroll") as HTMLDivElement
  if (fakeScroller.scrollTop > 200) {
    fakeScroller.scrollTop = 200
    playlist.scrollTop = playlist.scrollTop + 22
  } else if (fakeScroller.scrollTop < 200) {
    fakeScroller.scrollTop = 200
    playlist.scrollTop = playlist.scrollTop - 22
  }
}, 1)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffleMusic = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const shuffledVideos = shuffleMusic(videos)

export default App
