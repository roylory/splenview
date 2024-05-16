import { useEffect, useMemo, useState } from "react"
import DragDropArea from "./DragDropArea"
import ImageViewer from "./ImageViewer"
import FileInfo from "./FileInfo"
import Footer from "./Footer"
import { FileList } from "./types/FileList"
import Header from "./Header"
import { hashCode } from "./utils/hashCode"
import { parseJsonObj } from "./utils/parseJsonObj"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import enTranslation from "./assets/translations/en.json"
import koTranslation from "./assets/translations/ko.json"
import jaTranslation from "./assets/translations/ja.json"
import LongTouchDiv from "./LongTouchDiv"
import PressTab from "./PressTab"
import { toggleFullScreen } from "./utils/toggleFullscreen"
import { isMac } from "./utils/isMac"
import { useMediaQuery } from "usehooks-ts"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ko: {
        translation: koTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

const currentIndexes = parseJsonObj(localStorage.getItem("currentIndexes"))

function App() {
  const [fileList, setFileList] = useState<FileList>([])
  const [exited, setExited] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [infoMode, setInfoMode] = useState(false)
  const [readyToExit, setReadyToExit] = useState(false)
  const { t } = useTranslation()
  const [showTabMessage, setShowTabMessage] = useState(false)
  const readMode =
    !exited &&
    fileList.length > 0 &&
    currentIndex < fileList.length &&
    currentIndex >= 0
  const isTouchDevice = useMediaQuery("(pointer: coarse)")

  const initialize = () => {
    setFileList([])
    setCurrentIndex(-1)
    setInfoMode(false)
    setReadyToExit(false)
  }

  const exit = () => {
    if (readyToExit) {
      initialize()
    } else {
      setInfoMode(false)
      setReadyToExit(false)
      setExited(true)
    }
  }

  const goNext = () => {
    if (currentIndex < fileList.length - 1) {
      setCurrentIndex((index) => index + 1)
      setInfoMode(false)
      setReadyToExit(false)
    } else if (!readyToExit) {
      alert(t("messages.reachedEnd"))
      setReadyToExit(true)
      setInfoMode(true)
    } else {
      initialize()
    }
  }

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1)
      setInfoMode(false)
      setReadyToExit(false)
    } else if (!readyToExit) {
      alert(t("messages.reachedBeginning"))
      setReadyToExit(true)
      setInfoMode(true)
    } else {
      initialize()
    }
  }

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      // Disable right-click context menu on touch devices
      if (isTouchDevice) {
        e.preventDefault()
      }
    }
    document.addEventListener("contextmenu", handleContextmenu)
    return () => {
      document.removeEventListener("contextmenu", handleContextmenu)
    }
  }, [isTouchDevice])

  const hash = useMemo(
    () =>
      hashCode(
        fileList.map((item) => item.displayName + item.file.size).join(""),
      ),
    [fileList],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fileList.length > 0 && readMode) {
        if (
          event.key === "ArrowRight" ||
          event.key === "ArrowDown" ||
          event.key === " "
        ) {
          goNext()
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          goPrevious()
        } else if (event.key === "Tab") {
          event.preventDefault()
          setInfoMode((mode) => !mode)
        } else if (event.key === "Escape") {
          if (readyToExit) {
            initialize()
          } else if (infoMode) {
            setInfoMode(false)
          } else {
            exit()
          }
        } else if (readMode && event.key === "Enter") {
          // Command + Enter (Mac)
          // Alt + Enter (Windows)
          if ((isMac && event.metaKey) || (!isMac && event.altKey)) {
            toggleFullScreen()
            setInfoMode(false)
            setShowTabMessage(false)
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [fileList, currentIndex, readyToExit, readMode, infoMode])

  useEffect(() => {
    if (fileList.length === 0) return
    setExited(false)
    const hashedCurrentIndex = currentIndexes[hash]
    if (
      hashedCurrentIndex &&
      typeof hashedCurrentIndex === "number" &&
      hashedCurrentIndex <= fileList.length - 2
    ) {
      setCurrentIndex(hashedCurrentIndex)
    } else {
      setCurrentIndex(0)
    }
  }, [fileList, hash])

  useEffect(() => {
    if (currentIndex === -1) return
    if (currentIndex === 0 && !currentIndexes[hash]) return
    currentIndexes[hash] = currentIndex
    localStorage.setItem("currentIndexes", JSON.stringify(currentIndexes))
  }, [currentIndex])

  useEffect(() => {
    setShowTabMessage(false)
  }, [currentIndex, infoMode])

  useEffect(() => {
    if (readMode) {
      setShowTabMessage(true)
      const hideTimer = setTimeout(() => {
        setShowTabMessage(false)
      }, 5000)

      return () => {
        clearTimeout(hideTimer)
      }
    }
  }, [readMode])

  if (readMode) {
    const toggleInfoMode = () => setInfoMode((prev) => !prev)
    return (
      <div id="imageViewer">
        <ImageViewer file={fileList[currentIndex].file} />
        {infoMode ? (
          <FileInfo
            fileName={fileList[currentIndex].displayName}
            pageIndex={currentIndex}
            totalPages={fileList.length}
            exit={exit}
            toggleInfoMode={toggleInfoMode}
          />
        ) : (
          isTouchDevice && (
            <>
              <LongTouchDiv
                className="fixed top-0 bottom-0 left-0 right-1/2 opacity-0"
                onTouchEnd={goPrevious}
                onLongTouched={toggleInfoMode}
              />
              <LongTouchDiv
                className="fixed top-0 bottom-0 left-1/2 right-0 opacity-0"
                onTouchEnd={goNext}
                onLongTouched={toggleInfoMode}
              />
            </>
          )
        )}
        {showTabMessage && <PressTab isTouchDevice={isTouchDevice} />}
      </div>
    )
  }

  return (
    <>
      <Header exited={exited} goBack={() => setExited(false)} />
      <DragDropArea setFileList={setFileList} />
      <Footer />
    </>
  )
}

export default App
