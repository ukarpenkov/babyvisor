const { withDangerousMod } = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

const MARKER = 'startWhenLaidOut'

function replaceOnce(src, from, to, label) {
    if (!src.includes(from)) {
        throw new Error(
            `with-camera-preview-fix: ${label} did not match. expo-camera may have changed.`
        )
    }
    return src.replace(from, to)
}

function patchExpoCameraView(src) {
    if (src.includes(MARKER) && src.includes('shouldUseAndroidLayout')) {
        return src
    }

    let next = src

    if (!next.includes('shouldUseAndroidLayout')) {
        next = replaceOnce(
            next,
            `) : ExpoView(context, appContext),
  CameraViewInterface {
  private val currentActivity`,
            `) : ExpoView(context, appContext),
  CameraViewInterface {
  // babyvisor: android camera preview fix v2
  // PreviewView adds its surface asynchronously. Without Android layout,
  // React Native drops that requestLayout and the preview stays black.
  override val shouldUseAndroidLayout: Boolean = true

  private val currentActivity`,
            'ExpoView header'
        )
    }

    next = next.replace(
        'private var shouldCreateCamera = false',
        'private var shouldCreateCamera = true // babyvisor: android camera preview fix v2'
    )

    if (!next.includes('ImplementationMode.COMPATIBLE')) {
        next = replaceOnce(
            next,
            `private var previewView = PreviewView(context).apply {
    elevation = 0f
  }`,
            `private var previewView = PreviewView(context).apply {
    elevation = 0f
    // babyvisor: android camera preview fix v2
    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
  }`,
            'PreviewView initializer'
        )
    }

    if (!next.includes('val displayRotation')) {
        next = replaceOnce(
            next,
            `    val resolutionSelector = buildResolutionSelector()
    val preview = Preview.Builder()
      .setResolutionSelector(resolutionSelector)
      .build()
      .also {
        it.surfaceProvider = previewView.surfaceProvider
      }`,
            `    val resolutionSelector = buildResolutionSelector()
    if (previewView.implementationMode != PreviewView.ImplementationMode.COMPATIBLE) {
      previewView.implementationMode = PreviewView.ImplementationMode.COMPATIBLE
    }
    val displayRotation = try {
      previewView.display?.rotation ?: getDeviceOrientation()
    } catch (_: Throwable) {
      Surface.ROTATION_0
    }
    val preview = Preview.Builder()
      .setResolutionSelector(resolutionSelector)
      .setTargetRotation(displayRotation)
      .build()
      .also {
        it.targetRotation = displayRotation
        it.surfaceProvider = previewView.surfaceProvider
      }`,
            'preview use case'
        )

        next = replaceOnce(
            next,
            `    imageCaptureUseCase = ImageCapture.Builder()
      .setResolutionSelector(resolutionSelector)
      .setFlashMode(flashMode.mapToLens())
      .build()`,
            `    imageCaptureUseCase = ImageCapture.Builder()
      .setResolutionSelector(resolutionSelector)
      .setTargetRotation(displayRotation)
      .setFlashMode(flashMode.mapToLens())
      .build()`,
            'image capture use case'
        )
    }

    if (!next.includes('if (shouldScanBarcodes) {\n          imageAnalysisUseCase')) {
        next = replaceOnce(
            next,
            `        imageAnalysisUseCase?.let {
          addUseCase(it)
        }`,
            `        if (shouldScanBarcodes) {
          imageAnalysisUseCase?.let {
            addUseCase(it)
          }
        }`,
            'image analysis use case'
        )
    }

    if (!next.includes('CancellationException')) {
        next = replaceOnce(
            next,
            `    } catch (_: Exception) {
      onMountError(
        CameraMountErrorEvent("Camera component could not be rendered - is there any other instance running?")
      )
    }`,
            `    } catch (exception: Exception) {
      if (exception is kotlinx.coroutines.CancellationException) {
        shouldCreateCamera = true
        throw exception
      }
      shouldCreateCamera = true
      onMountError(
        CameraMountErrorEvent(
          exception.message
            ?: "Camera component could not be rendered - is there any other instance running?"
        )
      )
    }`,
            'createCamera error handler'
        )
    }

    const attached = `  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    orientationEventListener.enable()
    if (previewView.implementationMode != PreviewView.ImplementationMode.COMPATIBLE) {
      previewView.implementationMode = PreviewView.ImplementationMode.COMPATIBLE
    }
    shouldCreateCamera = true
    previewPaused = false
    // babyvisor: android camera preview fix v2
    // Do not cancel this scope on detach: react-native-screens detaches the
    // view during the first layout, and a cancelled scope can never start again.
    post {
      fun startWhenLaidOut(attempt: Int) {
        if (!isAttachedToWindow) return
        if ((width == 0 || height == 0) && attempt < 10) {
          post { startWhenLaidOut(attempt + 1) }
          return
        }
        scope.launch {
          createCamera()
          if (width > 0 && height > 0) {
            measureAndLayout()
          }
        }
      }
      startWhenLaidOut(0)
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    orientationEventListener.disable()
    camera = null
    shouldCreateCamera = true
    cameraProvider?.unbindAll()
  }`

    if (next.includes('override fun onAttachedToWindow()')) {
        next = next.replace(
            /  override fun onAttachedToWindow\(\) \{\n[\s\S]*?\n  override fun onDetachedFromWindow\(\) \{\n[\s\S]*?\n  \}\n\}/,
            `${attached}\n}`
        )
    } else {
        next = replaceOnce(
            next,
            `  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    orientationEventListener.disable()
    cancelCoroutineScope()
    cameraProvider?.unbindAll()
    glSurfaceTexture?.release()
  }
}`,
            `${attached}
}`,
            'camera lifecycle'
        )
    }

    if (!next.includes(MARKER) || !next.includes('shouldUseAndroidLayout')) {
        throw new Error(
            'with-camera-preview-fix: failed to apply Android camera preview patches'
        )
    }

    return next
}

module.exports = function withCameraPreviewFix(config) {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const viewFile = path.join(
                config.modRequest.projectRoot,
                'node_modules/expo-camera/android/src/main/java/expo/modules/camera/ExpoCameraView.kt'
            )
            if (!fs.existsSync(viewFile)) {
                throw new Error(
                    `with-camera-preview-fix: missing ${viewFile}`
                )
            }
            const original = fs.readFileSync(viewFile, 'utf8')
            const patched = patchExpoCameraView(original)
            if (patched !== original) {
                fs.writeFileSync(viewFile, patched)
            }
            return config
        },
    ])
}

module.exports.patchExpoCameraView = patchExpoCameraView
