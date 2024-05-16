// index all file names in src/assets
import fs, { readdirSync } from "fs"
import path, { join, relative } from "path"
import JSONbig from "json-bigint"

let __dirname = path.resolve()
const videoDirectory = join(__dirname, "./public/assets")

const videos = readdirSync(videoDirectory)

const listOfTitlesAndPaths = []
videos.forEach((video, index) => {
  const videoPath = join(videoDirectory, video)
  const dotIndex = video.lastIndexOf(".")
  const title = video.substring(0, dotIndex).replace(/'/g, "")
  const localPath = relative(__dirname, videoPath).replace("public\\", "").replace("\\", "/")

  listOfTitlesAndPaths[index] = {
    title,
    localPath,
  }
})

fs.writeFileSync(path.join(__dirname, "./index.json"), JSONbig.stringify(listOfTitlesAndPaths))
