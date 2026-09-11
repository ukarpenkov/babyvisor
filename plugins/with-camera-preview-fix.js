const { withDangerousMod } = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

const MARKER = 'babyvisor: android camera preview fix'

function patchExpoCameraView(src) {
    if (src.includes(MARKER)) {
        return src
    }

    let next = src.replace(
        'private var shouldCreateCamera = false',
        `private var shouldCreateCamera = true // ${MARKER}`
    )

    next = next.replace(
        `private var previewView = PreviewView(context).apply {
    elevation = 0f
  }`,
        `private var previewView = PreviewView(context).apply {
    elevation = 0f
    // ${MARKER}: TextureView so preview is visible inside react-native-screens
    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
  }`
    )

    next = next.replace(
        `  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()`,
        `  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    // ${MARKER}: New Architecture may skip OnViewDidUpdateProps on first mount
    shouldCreateCamera = true
    previewPaused = false
    scope.launch {
      createCamera()
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()`
    )

    if (next === src) {
        throw new Error(
            'with-camera-preview-fix: ExpoCameraView.kt did not match expected source. expo-camera may have changed.'
        )
    }

    if (
        !next.includes('ImplementationMode.COMPATIBLE') ||
        !next.includes('override fun onAttachedToWindow()')
    ) {
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
