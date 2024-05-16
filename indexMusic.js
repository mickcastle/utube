// index all file names in src/assets
import fs, { readdirSync } from "fs"
import path, { join } from "path"
import JSONbig from "json-bigint"

let __dirname = path.resolve()
const videoDirectory = join(__dirname, "./public/assets")

const videos = readdirSync(videoDirectory)

const listOfTitlesAndPaths = []
videos.forEach((video, index) => {
  const videoPath = join(videoDirectory, video)
  const dotIndex = video.lastIndexOf(".")
  const title = video.substring(0, dotIndex).replace(/'/g, "")

  listOfTitlesAndPaths[index] = {
    title,
    localPath: videoPath,
  }
})

fs.writeFileSync(path.join(__dirname, "./index.json"), JSONbig.stringify(listOfTitlesAndPaths))
